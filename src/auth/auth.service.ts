import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { environment } from 'config/constants';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) return null;
    if (user.password !== body.password)
      throw new HttpException('Invalid Password', HttpStatus.UNAUTHORIZED);
    return user;
  }
}
