import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ServiceInstanceDto {
  @IsInt()
  serviceId: number;

  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty()
  ip: string;

  @IsString()
  @IsNotEmpty()
  serviceUsername: string;

  @IsString()
  @IsNotEmpty()
  servicePassword: string;

  @IsNotEmpty()
  paymentDate: Date;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  status: 'active' | 'inactive';
}
