import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const response = await this.authService.login(dto);

    res.status(response.status).json(response);
  }
}
