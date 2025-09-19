import { Body, Controller, HttpCode, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './service/auth.service';
import { Tokens } from '../utils/tokens';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(Tokens.Auth.Service)
    private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const response = await this.authService.login(dto);

    res.status(response.status).json(response);
  }
}
