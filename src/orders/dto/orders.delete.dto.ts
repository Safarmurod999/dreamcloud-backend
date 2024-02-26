import { IsNumber } from 'class-validator';

export class OrdersDeleteDto {
  @IsNumber()
  id: number;
}
