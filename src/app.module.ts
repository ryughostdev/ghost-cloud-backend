import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [UsersModule, AuthModule, EmailModule, ServicesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
