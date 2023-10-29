import { IsNotEmpty, IsString } from 'class-validator';

export class AdminCreateDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

}
