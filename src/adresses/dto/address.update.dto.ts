import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddressUpdateDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  isActive: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  state: number;
}
