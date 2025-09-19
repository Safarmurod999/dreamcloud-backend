import { BaseResponse } from '@utils/base.response';
import { LoginDto } from '../dto/auth.dto';

export interface AuthService {
  login(dto: LoginDto): Promise<BaseResponse<any | Error>>;
}
