import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from './entities/social-account.entity';
import { MediaPortfolio } from './entities/media-portfolio.entity';
import { User } from '../user/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import axios from 'axios';

interface SyncResult {
  platform: string;
  success: boolean;
  count: number;
  error?: string;
}

interface LinkedinProfile {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
}

interface LinkedinMe {
  id?: string;
  localizedHeadline?: string;
  localizedFirstName?: string;
  localizedLastName?: string;
  profilePicture?: { 'displayImage~'?: { elements?: [{ identifiers?: [{ identifier?: string }] }] } };
}

interface LinkedinPost {
  id: string;
  created?: { time?: number };
  content?: {
    description?: string;
    media?: { id?: string; title?: { text?: string } }[];
  };
  lifecycleState?: string;
  visibility?: { 'com.linkedin.ugc.MemberNetworkVisibility'?: string };
}

interface TwitterUser {
  data?: { id: string; name: string; username: string; profile_image_url?: string };
}

interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics?: { like_count?: number; retweet_count?: number };
  attachments?: { media_keys?: string[] };
}

interface TwitterTweets {
  data?: TwitterTweet[];
  includes?: { media?: { media_key: string; type: string; url?: string; preview_image_url?: string }[] };
  meta?: { result_count: number };
}

@Injectable()
export class SocialService {
  private readonly handledByOwnModule = new Set(['github', 'gitlab']);

  constructor(
    @InjectRepository(SocialAccount)
    private socialRepo: Repository<SocialAccount>,
    @InjectRepository(MediaPortfolio)
    private mediaRepo: Repository<MediaPortfolio>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private auth: AuthService,
  ) {}

  async sync(user: User) {
    const accounts = await this.socialRepo.find({ where: { user_id: user.id } });
    if (!accounts.length) {
      return { message: 'Tidak ada akun sosial yang terhubung', synced: 0 };
    }

    const results = await Promise.allSettled(
      accounts.map((account) => this.syncPlatform(user, account)),
    );

    const synced = results.reduce((total, r) => total + (r.status === 'fulfilled' ? r.value.count : 0), 0);
    const errors = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map((r) => r.reason?.message ?? 'Unknown error');

    if (errors.length && !synced) {
      throw new HttpException(
        { message: 'Sinkronisasi gagal untuk semua platform', errors },
        HttpStatus.BAD_GATEWAY,
      );
    }

    return {
      message: 'Sync completed successfully',
      synced,
    };
  }

  private async syncPlatform(user: User, account: SocialAccount): Promise<SyncResult> {
    if (this.handledByOwnModule.has(account.platform)) {
      return { platform: account.platform, success: true, count: 0 };
    }

    switch (account.platform) {
      case 'linkedin':
        return this.syncLinkedin(user, account);
      case 'twitter':
        return this.syncTwitter(user, account);
      default:
        return { platform: account.platform, success: false, count: 0, error: `Platform ${account.platform} belum didukung` };
    }
  }

  async getLinkedinProfile(user: User) {
    const account = await this.socialRepo.findOneBy({ user_id: user.id, platform: 'linkedin' });
    if (!account) {
      throw new HttpException('LinkedIn account not connected', HttpStatus.BAD_REQUEST);
    }

    try {
      const [userinfoRes, meRes] = await Promise.allSettled([
        axios.get<LinkedinProfile>('https://api.linkedin.com/v2/userinfo', {
          headers: { Authorization: `Bearer ${account.access_token}` },
          timeout: 10000,
        }),
        axios.get<LinkedinMe>(
          'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,localizedHeadline,profilePicture(displayImage~:playableStreams))',
          {
            headers: { Authorization: `Bearer ${account.access_token}` },
            timeout: 10000,
          },
        ),
      ]);

      const userinfo = userinfoRes.status === 'fulfilled' ? userinfoRes.value.data : {};
      const me = meRes.status === 'fulfilled' ? meRes.value.data : {};

      return {
        id: userinfo.sub ?? me.id ?? '',
        name: userinfo.name ?? `${me.localizedFirstName ?? ''} ${me.localizedLastName ?? ''}`.trim(),
        email: userinfo.email ?? '',
        picture: userinfo.picture ?? '',
        headline: me.localizedHeadline ?? '',
        first_name: userinfo.given_name ?? me.localizedFirstName ?? '',
        last_name: userinfo.family_name ?? me.localizedLastName ?? '',
      };
    } catch (err: any) {
      throw new HttpException(
        { message: 'Gagal mengambil profil LinkedIn', error: err?.message },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private async syncLinkedin(user: User, account: SocialAccount): Promise<SyncResult> {
    try {
      const profile = await this.getLinkedinProfile(user);
      let savedCount = 0;

      const updates: Partial<User> = {};
      if (profile.headline && user.job_title !== profile.headline) {
        updates.job_title = profile.headline;
      }
      if (profile.name && user.name !== profile.name) {
        updates.name = profile.name;
      }
      if (profile.picture && user.avatar_url !== profile.picture) {
        updates.avatar_url = profile.picture;
      }
      if (Object.keys(updates).length > 0) {
        await this.userRepo.update(user.id, updates);
        savedCount++;
      }

      const linkedinSub = profile.id || account.provider_id;
      let posts: LinkedinPost[] = [];
      try {
        const postsRes = await axios.get<{ elements?: LinkedinPost[] }>(
          'https://api.linkedin.com/v2/rest/posts',
          {
            params: { author: `urn:li:person:${linkedinSub}`, q: 'author', count: 20 },
            headers: {
              Authorization: `Bearer ${account.access_token}`,
              'LinkedIn-Version': '202401',
            },
            timeout: 10000,
          },
        );
        posts = postsRes.data?.elements ?? [];
      } catch {
        try {
          const ugcRes = await axios.get<{ elements?: LinkedinPost[] }>(
            'https://api.linkedin.com/v2/ugcPosts',
            {
              params: { q: 'authors', authors: `List(urn:li:person:${linkedinSub})`, count: 20 },
              headers: { Authorization: `Bearer ${account.access_token}` },
              timeout: 10000,
            },
          );
          posts = ugcRes.data?.elements ?? [];
        } catch {
          posts = [];
        }
      }

      const existingIds = new Set(
        (await this.mediaRepo.find({
          where: { user_id: user.id, platform: 'linkedin' },
          select: ['media_id'],
        })).map((m) => m.media_id),
      );

      for (const post of posts) {
        if (!post.id || existingIds.has(post.id)) continue;

        const mediaPortfolio = this.mediaRepo.create({
          user_id: user.id,
          platform: 'linkedin',
          media_id: post.id,
          media_type: 'post',
          media_url: `https://www.linkedin.com/feed/update/${post.id}`,
          caption: post.content?.description ?? '',
          posted_at: post.created?.time ? new Date(post.created.time) : new Date(),
        });
        await this.mediaRepo.save(mediaPortfolio);
        savedCount++;
      }

      return { platform: 'linkedin', success: true, count: savedCount };
    } catch (err: any) {
      return { platform: 'linkedin', success: false, count: 0, error: err?.message ?? 'Unknown error' };
    }
  }

  private async syncTwitter(user: User, account: SocialAccount): Promise<SyncResult> {
    try {
      const meRes = await axios.get<TwitterUser>('https://api.twitter.com/2/users/me', {
        headers: { Authorization: `Bearer ${account.access_token}` },
        params: { 'user.fields': 'profile_image_url' },
        timeout: 10000,
      });

      const twitterUserId = meRes.data?.data?.id;
      if (!twitterUserId) {
        return { platform: 'twitter', success: false, count: 0, error: 'Gagal mendapatkan profil Twitter' };
      }

      let tweets: TwitterTweet[] = [];
      try {
        const tweetsRes = await axios.get<TwitterTweets>(
          `https://api.twitter.com/2/users/${twitterUserId}/tweets`,
          {
            params: {
              max_results: 20,
              'tweet.fields': 'created_at,public_metrics,attachments',
              'media.fields': 'url,preview_image_url,type',
              expansions: 'attachments.media_keys',
            },
            headers: { Authorization: `Bearer ${account.access_token}` },
            timeout: 10000,
          },
        );
        tweets = tweetsRes.data?.data ?? [];
      } catch {
        return { platform: 'twitter', success: true, count: 0 };
      }

      let savedCount = 0;
      const existingIds = new Set(
        (await this.mediaRepo.find({
          where: { user_id: user.id, platform: 'twitter' },
          select: ['media_id'],
        })).map((m) => m.media_id),
      );

      for (const tweet of tweets) {
        if (existingIds.has(tweet.id)) continue;

        const mediaPortfolio = this.mediaRepo.create({
          user_id: user.id,
          platform: 'twitter',
          media_id: tweet.id,
          media_type: 'tweet',
          media_url: `https://twitter.com/i/web/status/${tweet.id}`,
          caption: tweet.text ?? '',
          posted_at: tweet.created_at ? new Date(tweet.created_at) : new Date(),
        });
        await this.mediaRepo.save(mediaPortfolio);
        savedCount++;
      }

      return { platform: 'twitter', success: true, count: savedCount };
    } catch (err: any) {
      return { platform: 'twitter', success: false, count: 0, error: err?.message ?? 'Unknown error' };
    }
  }
}
