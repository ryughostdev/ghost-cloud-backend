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
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatusGuard } from './guards/user-status/user-status.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async getUsers(@Res() res: Response) {
    try {
      const usersData = await this.usersService.getUsers();
      if (!usersData)
        throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
      res.send(usersData);
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Get(':id')
  @UseGuards(UserStatusGuard)
  async getUser(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.getUser(id);
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      res.send(user);
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @ApiOperation({ summary: 'Create user' })
  @Post()
  async createUser(@Res() res: Response, @Body() body: CreateUserDto) {
    try {
      const newUser = await this.usersService.createUser(body);
      const { password, ...user } = newUser;
      res.status(HttpStatus.CREATED).send(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          throw new HttpException('Email already exists', HttpStatus.CONFLICT);
        }
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  @ApiOperation({ summary: 'Delete user by id' })
  @Delete(':id')
  async deleteUser(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.usersService.deleteUser(id);
      res.send({ message: `User id ${id} deleted` });
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
