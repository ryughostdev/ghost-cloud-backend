import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ServicesService, EmailService, PrismaService],
  controllers: [ServicesController],
})
export class ServicesModule {}
