import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<User, 'email' | 'id' | 'role'> | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await user.validatePassword(password))) {
      return {
        email: user.email,
        id: user.id,
        role: user.role,
      };
    }
    return null;
  }

  login({ email, id, role }: Pick<User, 'email' | 'id' | 'role'>) {
    const payload = { email, sub: id, role };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id,
        email,
        role,
      },
    };
  }
}
