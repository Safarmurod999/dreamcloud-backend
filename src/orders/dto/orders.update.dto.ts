import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrdersUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @IsNotEmpty()
  @IsString()
  mobile_phone: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @IsBoolean()
  recall: boolean;

  @IsNotEmpty()
  @IsNumber()
  state: number;
}
