import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { EmailService } from 'src/email/email.service';
import { Response } from 'express';
import { ServiceDto } from './dto/service.dto';
import { IsNotLoggedInGuard } from 'src/auth/guards/is-not-logged-in/is-not-logged-in.guard';
import { catchHandle } from 'src/chore/utils/catchHandle';
import { SessionData } from 'express-session';
import { userRoles } from 'config/constants';
import { ServiceInstanceDto } from './dto/serviceInstance.dto';

@Controller('services')
@ApiTags('services')
export class ServicesController {
  constructor(
    private servicesService: ServicesService,
    private emailService: EmailService,
  ) {}

  @Get()
  async getServicesController(@Res() res: Response) {
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
  @Patch('instances/:id')
  @UseGuards(IsNotLoggedInGuard)
  async updateServiceInstanceController(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Session() session: SessionData,
    @Body() body: ServiceInstanceDto,
  ) {
    console.log(body);
    try {
      if (!session.services.includes(id)) {
        if (!session.roles.includes(userRoles.Admin.id)) {
          throw new HttpException(
            'You do not have the permission to access this resource',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
      const serviceInstanceData =
        await this.servicesService.updateServiceInstance(id, body);
      if (serviceInstanceData === null) {
        throw new HttpException(
          'Service instance not found',
          HttpStatus.NOT_FOUND,
        );
      } else {
        res.status(HttpStatus.OK).send(serviceInstanceData);
      }
    } catch (e) {
      catchHandle(e);
    }
  }
  @Get('instances-all')
  @UseGuards(IsNotLoggedInGuard)
  async getServiceInstancesController(@Res() res: Response) {
    try {
      const serviceInstancesData =
        await this.servicesService.getServiceInstances();
      if (serviceInstancesData.length === 0) {
        throw new HttpException(
          'Service instances not found',
          HttpStatus.NOT_FOUND,
        );
      }
      res.status(HttpStatus.OK).send(serviceInstancesData);
    } catch (e) {
      catchHandle(e);
    }
  }

  @Get(':id')
  @UseGuards(IsNotLoggedInGuard)
  async getServiceController(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const serviceData = await this.servicesService.getService(id);
      if (serviceData === null) {
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
      } else {
        res.status(HttpStatus.OK).send(serviceData);
      }
    } catch (e) {
      catchHandle(e);
    }
  }

  @Post()
  @UseGuards(IsNotLoggedInGuard)
  async createServiceController(
    @Res() res: Response,
    @Body() body: ServiceDto,
  ) {
    try {
      const serviceData = await this.servicesService.createService(body);
      res.status(HttpStatus.CREATED).send(serviceData);
    } catch (e) {
      catchHandle(e);
    }
  }

  @Patch(':id')
  @UseGuards(IsNotLoggedInGuard)
  async updateServiceController(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ServiceDto,
  ) {
    try {
      const serviceData = await this.servicesService.updateService(id, body);
      res.status(HttpStatus.OK).send(serviceData);
    } catch (e) {
      catchHandle(e);
    }
  }

  @Delete(':id')
  @UseGuards(IsNotLoggedInGuard)
  async deleteServiceController(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const serviceData = await this.servicesService.deleteService(id);
      res.status(HttpStatus.OK).send(serviceData);
    } catch (e) {
      catchHandle(e);
    }
  }

  @Get('instances/:id')
  @UseGuards(IsNotLoggedInGuard)
  async getServiceInstanceController(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Session() session: SessionData,
  ) {
    try {
      // NOTE es posible que se necesite un middleware para verificar si el usuario tiene permisos similar a esto
      if (!session.services.includes(id)) {
        if (!session.roles.includes(userRoles.Admin.id)) {
          throw new HttpException(
            'You do not have the permission to access this resource',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
      const serviceInstanceData =
        await this.servicesService.getServiceInstance(id);
      if (serviceInstanceData === null) {
        throw new HttpException(
          'User does not have any service',
          HttpStatus.NOT_FOUND,
        );
      } else {
        res.status(HttpStatus.OK).send(serviceInstanceData);
      }
    } catch (e) {
      catchHandle(e);
    }
  }

  @Post('instances')
  @UseGuards(IsNotLoggedInGuard)
  async createServiceInstanceController(
    @Res() res: Response,
    @Body() body: ServiceInstanceDto,
    @Session() session: SessionData,
  ) {
    // NOTE es posible que se necesite un middleware para verificar si el usuario tiene permisos similar a esto
    try {
      if (session.userId !== body.userId) {
        if (!session.roles.includes(userRoles.Admin.id)) {
          throw new HttpException(
            'You do not have the permission to access this resource',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
      const serviceInstanceData =
        await this.servicesService.createServiceInstance(body);
      res.status(HttpStatus.CREATED).send(serviceInstanceData);
    } catch (e) {
      catchHandle(e);
    }
  }
}
