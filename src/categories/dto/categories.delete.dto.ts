import { IsNumber } from 'class-validator';

export class CategoriesDeleteDto {
  @IsNumber()
  id: number;
}
