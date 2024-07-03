import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { IsLoggedInGuard } from './guards/is-logged-in/is-logged-in.guard';
import { UsersService } from 'src/users/users.service';
import { SessionData } from 'express-session';
import { IsNotLoggedInGuard } from './guards/is-not-logged-in/is-not-logged-in.guard';
import { ApiLogin, ApiLogout, ApiVerify } from './auth.swagger';
import { EmailService } from 'src/email/email.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  @ApiLogin()
  @Post('/login')
  @UseGuards(IsLoggedInGuard)
  async login(
    @Res() res: Response,
    @Body() body: LoginDto,
    @Session() session: SessionData,
  ) {
    try {
      const user = await this.authService.login(body);
      const { password, ...userData } = user;
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      session.userId = user.id;
      session.isLoggedIn = true;
      res.status(HttpStatus.ACCEPTED).send({ ...userData, isLoggedIn: true });
    } catch (e) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiLogout()
  @Get('/logout')
  @UseGuards(IsNotLoggedInGuard)
  async logout(@Res() res: Response, @Session() session: SessionData) {
    try {
      const user = await this.usersService.getUser(session.userId);
      session.isLoggedIn = false;
      const { password, ...userData } = user;
      res.status(HttpStatus.OK).send({ ...userData, isLoggedIn: false });
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiVerify()
  @Get('/verify-email/:token')
  async verifyEamil(
    @Res() res: Response,
    @Session() session: SessionData,
    @Param('token') token: string,
  ) {
    try {
      const verifyData = await this.authService.verifyEmail(token);
      if (verifyData) {
        await this.emailService.subscribeToNewsLetter(verifyData.email);
      }
      res.status(HttpStatus.OK).send({ status: 'active' });
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
