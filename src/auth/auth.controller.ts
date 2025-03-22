import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UsePipes,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import {
  LoginDto,
  loginSchema,
  RegisterDto,
  registerSchema,
} from './schema/auth.schema';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const data = this.authService.login({
        email: user.email,
        id: user.id,
        role: user.role,
      });

      return {
        message: 'Login successful',
        data: data,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('An error occurred during login');
    }
  }

  @Public()
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(
    @Body()
    createUserDto: RegisterDto,
  ) {
    try {
      const existingUser = await this.usersService.findOneByEmail(
        createUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const user = await this.usersService.create(createUserDto);

      return {
        message: 'User registered successfully',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
