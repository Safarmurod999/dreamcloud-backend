import { IsNotEmpty, IsString } from 'class-validator';

export class AddressCreateDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}
