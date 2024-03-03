import {IsNumber} from 'class-validator';

export class TechnologyDeleteDto {
  @IsNumber()
  id: number;
}
