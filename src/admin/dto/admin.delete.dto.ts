import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AdminDeleteDto {
  @IsNumber()
  id: number;
}
