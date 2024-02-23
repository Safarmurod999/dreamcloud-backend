import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductUpdateDto {
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  category_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  count: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  discount: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  overweight: number;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  capacity: number;

  @IsNotEmpty()
  @IsString()
  guarantee: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  // @IsNotEmpty()
  // @IsString()
  // image: string;

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  status: boolean;
}
