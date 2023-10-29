import { IsNotEmpty, IsString } from 'class-validator';

export class ProductCreateDto {
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsNotEmpty()
  @IsString()
  count: string;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsString()
  price: string;


  // @IsBoolean()
  // @IsNotEmpty()
  // active: boolean;
}
