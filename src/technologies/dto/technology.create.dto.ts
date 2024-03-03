import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class TechnologyCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
