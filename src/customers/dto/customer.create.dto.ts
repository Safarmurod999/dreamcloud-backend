import { IsNotEmpty, IsString } from 'class-validator';

export class CustomerCreateDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  // @IsBoolean()
  // @IsNotEmpty()
  // active: boolean;

}
