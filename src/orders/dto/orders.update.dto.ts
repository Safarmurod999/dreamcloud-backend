import { IsBoolean, IsNotEmpty,IsNumber} from 'class-validator';

export class OrdersUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @IsNotEmpty()
  @IsNumber()
  customer_id: number;

  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @IsBoolean()
  recall:boolean;

  @IsNotEmpty()
  @IsNumber()
  state: number;

}

