import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { environment } from 'config/constants';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(body: LoginDto, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) return null;
    if (user.password !== body.password)
      throw new HttpException('Wrong Password', HttpStatus.UNAUTHORIZED);
    req.session.user = user;
    req.session.isLoggedIn = true;
    return user;
  }
  cookieSessionInject = (req: Request, res: Response) => {
    if (environment === 'production') {
      res.cookie('sessionId', req.session.id, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000 * 24 * 7,
        sameSite: 'none',
      });
    } else {
      res.cookie('sessionId', req.session.id, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000 * 24 * 7,
      });
    }
  };
}
