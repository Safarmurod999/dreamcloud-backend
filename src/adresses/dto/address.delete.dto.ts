import {IsNumber} from 'class-validator';

export class AddressDeleteDto {
  @IsNumber()
  id: number;
}
