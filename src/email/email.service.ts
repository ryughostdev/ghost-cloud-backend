import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/prisma.service';
import * as crypto from 'crypto';
@Injectable()
export class EmailService {
  constructor(
    private readonly mailService: MailerService,
    private prisma: PrismaService,
  ) {}
  async sendEmailVerification(email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    try {
      await this.prisma.temporal_token_pool.create({
        data: {
          token,
          userEmail: email,
          type: 'email_verification',
        },
      });
    } catch (error) {
      throw new Error('Error creating token');
    }
    // BUG no lee las variables de ejs en el template
    this.mailService.sendMail({
      to: email,
      subject: 'verifique su correo electronico',
      template: 'user-sign_up',
      context: {
        link: `http://localhost:3000/auth/verify-email?token=${token}`,
      },
    });
  }
}
