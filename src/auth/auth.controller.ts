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
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { IsLoggedInGuard } from './guards/is-logged-in/is-logged-in.guard';
import { UsersService } from 'src/users/users.service';
import { SessionData } from 'express-session';
import { IsNotLoggedInGuard } from './guards/is-not-logged-in/is-not-logged-in.guard';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiOperation({
    summary: 'Login',
    description: 'Logs in a user and sets the session',
  })
  @ApiOkResponse({
    description: 'User logged in',
    schema: {
      example: {
        id: 0,
        email: 'email@mail.com',
        name: 'user',
        password: '',
        status: 'active',
        createdAt: '2024-05-30T07:53:19.200Z',
        updatedAt: '2024-05-30T07:53:19.200Z',
        isLoggedIn: true,
      },
    },
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      user: {
        value: {
          email: 'user_email@email.com',
          password: 'userPasword1234!',
        },
        summary: 'User email and password',
      },
    },
    required: true,
  })
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

  @ApiOperation({
    summary: 'Logout',
    description: 'Logs out a user and set session isLoggedIn = false',
  })
  @ApiOkResponse({
    description: 'User logged out',
    schema: {
      example: {
        id: 0,
        email: 'email@mail.com',
        name: 'user',
        password: '',
        status: 'active',
        createdAt: '2024-05-30T07:53:19.200Z',
        updatedAt: '2024-05-30T07:53:19.200Z',
        isLoggedIn: false,
      },
    },
  })
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
