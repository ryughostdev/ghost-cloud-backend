import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma.service';
import { IsAdminMiddleware } from './middlewares/is-admin/is-admin.middleware';

@Module({
  providers: [ServicesService, EmailService, PrismaService],
  controllers: [ServicesController],
})
export class ServicesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAdminMiddleware).forRoutes({
      path: 'services*',
      method: RequestMethod.POST,
    });
  }
}
