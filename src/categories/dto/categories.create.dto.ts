import { IsNotEmpty,IsString } from 'class-validator';

export class CategoriesCreateDto {
  @IsNotEmpty()
  @IsString()
  category_name: string;
}
