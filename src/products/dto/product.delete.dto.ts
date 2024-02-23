import { IsNumber } from 'class-validator';

export class ProductDeleteDto {
  @IsNumber()
  id: number;
}
