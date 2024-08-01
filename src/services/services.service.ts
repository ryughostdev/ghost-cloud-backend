import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ServiceDto } from './dto/service.dto';
import { ServiceInstanceDto } from './dto/serviceInstance.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  //Service CRUD
  async getServices() {
    return await this.prisma.services.findMany();
  }
  async getService(id: number) {
    return await this.prisma.services.findUnique({
      where: {
        id,
      },
    });
  }
  async createService(data: ServiceDto) {
    return await this.prisma.services.create({
      data,
    });
  }
  async updateService(id: number, data: ServiceDto) {
    return await this.prisma.services.update({
      where: { id },
      data: data,
    });
  }

  async deleteService(id: number) {
    return await this.prisma.services.delete({
      where: { id },
    });
  }

  // ServiceInstance CRUD
  async getServiceInstances() {
    return await this.prisma.service_instances.findMany();
  }
  async getServiceInstancebyId(SIId: number) {
    return await this.prisma.service_instances.findUnique({
      where: { id: SIId },
    });
  }

  async getServiceInstance(id: number) {
    return await this.prisma.service_instances.findMany({
      where: {
        userId: id,
      },
      include: {
        service: true,
      },
    });
  }

  async createServiceInstance(data: ServiceInstanceDto) {
    return await this.prisma.service_instances.create({
      data,
    });
  }

  async updateServiceInstance(id: number, data: ServiceInstanceDto) {
    return await this.prisma.service_instances.update({
      where: { id },
      data,
    });
  }

  async deleteServiceInstance(id: number) {
    return await this.prisma.service_instances.delete({
      where: { id: id },
    });
  }
}
