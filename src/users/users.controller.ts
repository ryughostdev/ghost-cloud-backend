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
import { EmailService } from 'src/email/email.service';
import { IsLoggedInGuard } from 'src/auth/guards/is-logged-in/is-logged-in.guard';
import { IsNotLoggedInGuard } from 'src/auth/guards/is-not-logged-in/is-not-logged-in.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  @UseGuards(IsNotLoggedInGuard)
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
  @UseGuards(IsNotLoggedInGuard)
  async getUser(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.getUser(id);
      const { password, ...rest } = user;
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      res.send(rest);
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @ApiOperation({ summary: 'Create user' })
  @Post()
  @UseGuards(IsLoggedInGuard)
  async createUser(@Res() res: Response, @Body() body: CreateUserDto) {
    try {
      const newUser = await this.usersService.createUser(body);
      const { password, ...user } = newUser;

      if (newUser.id >= 1) {
        await this.emailService.sendEmailVerification(newUser.email);
      }
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
  @UseGuards(IsNotLoggedInGuard)
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

  @ApiOperation({ summary: 'Update user by id' })
  @Post(':id')
  @UseGuards(IsNotLoggedInGuard)
  async updateUser(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateUserDto,
  ) {
    try {
      const updatedUser = await this.usersService.updateUser(id, body);
      res.send(updatedUser);
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Update role of user' })
  @Get('/add-role/:userId/:roleId')
  @UseGuards(IsNotLoggedInGuard)
  async addRole(
    @Res() res: Response,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    try {
      const updatedUser = await this.usersService.addRole(userId, roleId);
      res.send(updatedUser);
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @ApiOperation({ summary: 'Delete role of user' })
  @Get('/delete-role/:userId/:roleId')
  @UseGuards(IsNotLoggedInGuard)
  async removeRole(
    @Res() res: Response,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    try {
      const updatedUser = await this.usersService.removeRole(userId, roleId);
      res.send(updatedUser);
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
