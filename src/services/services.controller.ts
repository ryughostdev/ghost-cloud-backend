import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { EmailService } from 'src/email/email.service';
import { IsLoggedInGuard } from 'src/auth/guards/is-logged-in/is-logged-in.guard';
import { Response } from 'express';
import { ServiceDto } from './dto/service.dto';
import { IsNotLoggedInGuard } from 'src/auth/guards/is-not-logged-in/is-not-logged-in.guard';

@Controller('services')
@ApiTags('services')
export class ServicesController {
  constructor(
    private servicesService: ServicesService,
    private emailService: EmailService,
  ) {}

  @Get()
  @UseGuards(IsNotLoggedInGuard)
  async getServices(@Res() res: Response) {
    try {
      const servicesData = await this.servicesService.getServices();
      res.status(HttpStatus.OK).send(servicesData);
    } catch (e) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UseGuards(IsNotLoggedInGuard)
  async createService(@Res() res: Response, @Body() body: ServiceDto) {
    try {
      const serviceData = await this.servicesService.createService(body);
      res.status(HttpStatus.CREATED).send(serviceData);
    } catch (e) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
