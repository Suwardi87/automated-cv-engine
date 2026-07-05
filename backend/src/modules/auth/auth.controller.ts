import { Controller, Get, Param, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import axios from 'axios';

interface ProviderConfig {
  authUrl: string;
  tokenUrl: string;
  userUrl: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  redirectUri?: string;
  emailField: string;
  nameField: string;
  avatarField: string;
  idField: string;
  usernameField?: string;
}

@Controller('auth')
export class AuthController {
  private providers: Record<string, ProviderConfig> = {};

  constructor(private auth: AuthService) {
    const appUrl = process.env.APP_URL || 'http://localhost:8082';
    this.providers = {
      github: {
        authUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        userUrl: 'https://api.github.com/user',
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        scope: 'user:email repo',
        redirectUri: `${appUrl}/api/auth/github/callback`,
        emailField: 'email',
        nameField: 'name',
        avatarField: 'avatar_url',
        idField: 'id',
        usernameField: 'login',
      },
      gitlab: {
        authUrl: 'https://gitlab.com/oauth/authorize',
        tokenUrl: 'https://gitlab.com/oauth/token',
        userUrl: 'https://gitlab.com/api/v4/user',
        clientId: process.env.GITLAB_CLIENT_ID || '',
        clientSecret: process.env.GITLAB_CLIENT_SECRET || '',
        scope: 'read_user read_api',
        redirectUri: `${appUrl}/api/auth/gitlab/callback`,
        emailField: 'email',
        nameField: 'name',
        avatarField: 'avatar_url',
        idField: 'id',
        usernameField: 'username',
      },
    };
  }

  @Get(':provider/redirect')
  redirect(@Param('provider') provider: string, @Res() res) {
    const cfg = this.providers[provider];
    if (!cfg) throw new HttpException('Unsupported provider', HttpStatus.BAD_REQUEST);
    const params = new URLSearchParams({
      client_id: cfg.clientId,
      scope: cfg.scope,
    });
    if (cfg.redirectUri) params.set('redirect_uri', cfg.redirectUri);
    params.set('response_type', 'code');
    return res.redirect(`${cfg.authUrl}?${params.toString()}`);
  }

  @Get(':provider/callback')
  async callback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    if (!process.env.FRONTEND_URL) {
      console.warn(
        'FRONTEND_URL is not set, falling back to http://localhost:3000. ' +
        'For docker setup, set FRONTEND_URL=http://localhost:3000 in docker-compose environment.',
      );
    }

    if (error) {
      return res.redirect(`${frontendUrl}/cms/login?error=oauth_denied`);
    }

    const cfg = this.providers[provider];
    if (!cfg) throw new HttpException('Unsupported provider', HttpStatus.BAD_REQUEST);

    try {
      const tokenPayload: Record<string, string> = {
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        code,
        grant_type: 'authorization_code',
      };
      if (cfg.redirectUri) tokenPayload.redirect_uri = cfg.redirectUri;

      const tokenRes = await axios.post(cfg.tokenUrl, tokenPayload, {
        headers: { Accept: 'application/json' },
      });

      const accessToken = tokenRes.data.access_token;
      if (!accessToken) throw new HttpException('Failed to get access token', HttpStatus.UNAUTHORIZED);

      const userRes = await axios.get(cfg.userUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const profile = userRes.data;
      const username = cfg.usernameField ? profile[cfg.usernameField] : undefined;
      const { user, token } = await this.auth.findOrCreateUser({
        name: profile[cfg.nameField] || username || 'User',
        email: profile[cfg.emailField] || `${profile[cfg.idField]}@${provider}.placeholder`,
        username,
        avatar_url: profile[cfg.avatarField],
        provider,
        provider_id: String(profile[cfg.idField]),
        access_token: accessToken,
      });

      res.cookie('auth_token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return res.redirect(`${frontendUrl}/cms/auth/callback`);
    } catch {
      return res.redirect(`${frontendUrl}/cms/login?error=auth_failed`);
    }
  }
}
