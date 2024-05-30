import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { IsLoggedInGuard } from './guards/is-logged-in/is-logged-in.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('/login')
  @UseGuards(IsLoggedInGuard)
  async login(
    @Res() res: Response,
    @Body() body: LoginDto,
    @Req() req: Request,
  ) {
    const user = await this.authService.login(body, req);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    res.send(user).status(HttpStatus.OK);
  }
}
