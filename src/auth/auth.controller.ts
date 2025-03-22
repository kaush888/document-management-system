import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Public } from './decorators/public.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return this.authService.login({
        email: user.email,
        id: user.id,
        role: user.role,
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('An error occurred during login');
    }
  }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: Partial<User>) {
    try {
      // Check if user already exists
      if (!createUserDto.email) {
        throw new UnauthorizedException('Email is required');
      }
      const existingUser = await this.usersService.findOne(createUserDto.email);
      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }

      // Create new user
      const user = await this.usersService.create(createUserDto);

      // Return user without password
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new UnauthorizedException('An error occurred during registration');
    }
  }
}
