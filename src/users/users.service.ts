import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getUsers() {
    return this.prisma.user.findMany();
  }
  createUser(user: CreateUserDto) {
    return this.prisma.user.create({ data: user });
  }
  getUser(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
