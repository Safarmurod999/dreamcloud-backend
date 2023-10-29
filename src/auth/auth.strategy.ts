import { ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_KEY'),
    });
  }

  async validate(payload: { username: string; isSuperAdmin: boolean }) {
    try {
      let username = payload.username;
      return await this.adminRepository.findOne({ where: { username } });
    } catch (err) {
      throw new RequestTimeoutException({
        status: 408,
        message:
          'Timed out fetching a new connection from the connection pool!',
        error: true,
      });
    }
  }
}
