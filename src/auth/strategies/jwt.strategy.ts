import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const secretKey = configService.get<string>('JWT_SECRET');
    if (!secretKey) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: Pick<User, 'email'>) {
    try {
      const user = await this.usersService.findOne(payload?.email);
      if (!user) {
        throw new UnauthorizedException();
      }
      return { userId: user.id, email: user.email, role: user.role };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error validating token:', error.message);
      } else {
        console.error(
          'Unknown error occurred during token validation:',
          String(error),
        );
      }
      throw new UnauthorizedException();
    }
  }
}
