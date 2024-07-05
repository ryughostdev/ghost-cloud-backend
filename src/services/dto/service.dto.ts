import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  status: 'active' | 'inactive';

  @IsInt()
  @IsNotEmpty()
  memory: number;

  @IsInt()
  @IsNotEmpty()
  cores: number;

  @IsInt()
  @IsNotEmpty()
  disk: number;

  @IsString()
  @IsNotEmpty()
  os: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
