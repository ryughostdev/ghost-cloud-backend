import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatusGuard } from './guards/user-status/user-status.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async getUsers(@Res() res: Response) {
    const usersData = await this.usersService.getUsers();
    res.send(usersData);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Get(':id')
  @UseGuards(UserStatusGuard)
  async getUser(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getUser(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    res.send(user);
  }
  @ApiOperation({ summary: 'Create user' })
  @Post()
  async createUser(@Res() res: Response, @Body() body: CreateUserDto) {
    const newUser = await this.usersService.createUser(body);
    res.send(newUser);
  }
  @ApiOperation({ summary: 'Delete user by id' })
  @Delete(':id')
  async deleteUser(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.usersService.deleteUser(id);
    res.send({ message: `User id ${id} deleted` });
  }
}
