import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }
  getToken() {
    const payload = { username: 'user' }
    return {
      token: this.jwtService.sign(payload),
    }
  }


}
