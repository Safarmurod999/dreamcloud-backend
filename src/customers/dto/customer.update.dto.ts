import { IsBoolean, IsString } from 'class-validator';

export class CustomerUpdateDto {
  @IsString()
  fullname: string;

  @IsString()
  phone_number: string;

  @IsBoolean()
  isActive: boolean;
}
