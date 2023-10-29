import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CustomerDeleteDto {
  @IsNumber()
  id: number;
}
