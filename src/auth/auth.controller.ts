import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
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
import { ApiLogin, ApiLogout } from './auth.swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiLogin()
  @Post('/login')
  @UseGuards(IsLoggedInGuard)
  async login(
    @Res() res: Response,
    @Body() body: LoginDto,
    @Session() session: SessionData,
  ) {
    const user = await this.authService.login(body);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    session.userId = user.id;
    session.isLoggedIn = true;
    res.status(HttpStatus.OK).send({ ...user, isLoggedIn: true, password: '' });
  }

  @ApiLogout()
  @Get('/logout')
  @UseGuards(IsNotLoggedInGuard)
  async logout(@Res() res: Response, @Session() session: SessionData) {
    session.isLoggedIn = false;
    const user = await this.usersService.getUser(session.userId);
    res
      .status(HttpStatus.OK)
      .send({ ...user, isLoggedIn: false, password: '' });
  }
}
