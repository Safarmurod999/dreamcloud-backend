import { IsBoolean, IsNotEmpty,IsNumber} from 'class-validator';

export class OrdersCreateDto {
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @IsNotEmpty()
  @IsNumber()
  customer_id: number;

  @IsNotEmpty()
  @IsNumber()
  count: number;

}
