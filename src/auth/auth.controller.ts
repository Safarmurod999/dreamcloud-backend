import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const response = await this.authService.login(dto);
    res.status(response.status).json(response);
  }
}
