import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductCreateDto {
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsNotEmpty()
  @IsNumber()
  count: string;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsNumber()
  price: string;


  // @IsBoolean()
  // @IsNotEmpty()
  // active: boolean;
}
