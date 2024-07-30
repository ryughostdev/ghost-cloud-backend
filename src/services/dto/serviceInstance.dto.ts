import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ServiceInstanceDto {
  @IsInt()
  @IsOptional()
  serviceId: number;

  @IsInt()
  userId: number;

  @IsString()
  @IsOptional()
  ip: string;

  @IsString()
  @IsOptional()
  serviceUsername: string;

  @IsString()
  @IsOptional()
  servicePassword: string;

  @IsNotEmpty()
  paymentDate: Date;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  status: 'active' | 'inactive';
}
