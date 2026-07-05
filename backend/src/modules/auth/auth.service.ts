import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { SocialAccount } from '../social/entities/social-account.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(SocialAccount)
    private socialRepo: Repository<SocialAccount>,
  ) {}

  async findOrCreateUser(profile: {
    name: string;
    email: string;
    username?: string;
    avatar_url?: string;
    provider: string;
    provider_id: string;
    access_token: string;
  }): Promise<{ user: User; token: string }> {
    let username = profile.username
      ? profile.username.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : profile.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (username && await this.userRepo.findOneBy({ username })) {
      username = `${username}-${profile.provider_id.slice(-4)}`;
    }
    let user = await this.userRepo.findOneBy({ email: profile.email.toLowerCase() });
    if (!user) {
      try {
        user = this.userRepo.create({
          name: profile.name,
          email: profile.email.toLowerCase(),
          username,
          avatar_url: profile.avatar_url ?? undefined,
        });
        user = await this.userRepo.save(user);
      } catch {
        user = await this.userRepo.findOneBy({ email: profile.email.toLowerCase() });
        if (!user) throw new Error('Failed to create or find user');
      }
    } else {
      if (profile.name && user.name !== profile.name) user.name = profile.name;
      if (profile.avatar_url && user.avatar_url !== profile.avatar_url) user.avatar_url = profile.avatar_url;
      await this.userRepo.save(user);
    }
    await this.upsertSocialAccount(user.id, profile);
    const token = this.jwt.sign({ sub: user.id });
    return { user, token };
  }

  private async upsertSocialAccount(userId: number, profile: {
    provider: string;
    provider_id: string;
    access_token: string;
  }) {
    const existing = await this.socialRepo.findOneBy({
      user_id: userId,
      platform: profile.provider,
    });
    if (existing) {
      existing.provider_id = profile.provider_id;
      existing.access_token = profile.access_token;
      await this.socialRepo.save(existing);
      return;
    }
    const created = this.socialRepo.create({
      user_id: userId,
      platform: profile.provider,
      provider_id: profile.provider_id,
      access_token: profile.access_token,
    });
    await this.socialRepo.save(created);
  }

  async getUser(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  async getAccessToken(userId: number, platform: string): Promise<string | null> {
    const account = await this.socialRepo.findOneBy({ user_id: userId, platform });
    return account?.access_token ?? null;
  }
}
