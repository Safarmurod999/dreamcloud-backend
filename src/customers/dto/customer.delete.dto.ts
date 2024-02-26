import {IsNumber} from 'class-validator';

export class CustomerDeleteDto {
  @IsNumber()
  id: number;
}
