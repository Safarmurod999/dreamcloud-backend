import { IsBoolean,IsNumber, IsString } from 'class-validator';

export class CustomersUpdateDto {
  @IsString()
  mobile_phone: string;

  @IsBoolean()
  recall: boolean;
}
