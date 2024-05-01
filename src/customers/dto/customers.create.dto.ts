import { IsNotEmpty,IsString } from 'class-validator';

export class CustomersCreateDto {
  @IsNotEmpty()
  @IsString()
  mobile_phone: string;
}
