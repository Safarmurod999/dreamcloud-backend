import { IsBoolean,IsNumber, IsString } from 'class-validator';

export class CategoriesUpdateDto {
  @IsString()
  category_name: string;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  state: number;
}
