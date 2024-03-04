import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty,IsNumber, IsString} from 'class-validator';

export class OrdersCreateDto {
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

}
