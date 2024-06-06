import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { passwordEncrypt } from './utils/handlePassword';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getUsers() {
    return this.prisma.user.findMany();
  }
  async createUser(user: CreateUserDto) {
    const password = await passwordEncrypt(user.password);
    return this.prisma.user.create({ data: { ...user, password } });
  }
  getUser(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
