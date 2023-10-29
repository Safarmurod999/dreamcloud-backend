import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AdminUpdateDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsBoolean()
  isSuperAdmin: boolean;
}
