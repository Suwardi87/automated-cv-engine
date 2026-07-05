import { Controller, Get, Put, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller()
export class UserController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  getUser(@CurrentUser() user: User) {
    return { success: true, data: user };
  }

  @UseGuards(JwtAuthGuard)
  @Put('user')
  async updateUser(
    @CurrentUser() user: User,
    @Body() body: { name?: string; email?: string; bio?: string; phone?: string; location?: string; website?: string; linkedin?: string; job_title?: string },
  ) {
    if (body.name) user.name = body.name;
    if (body.email) user.email = body.email;
    if (body.bio !== undefined) user.bio = body.bio;
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.location !== undefined) user.location = body.location;
    if (body.website !== undefined) user.website = body.website;
    if (body.linkedin !== undefined) user.linkedin = body.linkedin;
    if (body.job_title !== undefined) user.job_title = body.job_title;
    await this.userRepo.save(user);
    return { success: true, data: user };
  }
}
