import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UsePipes,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
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
import {
  LoginResponse,
  LoginDtoSwagger,
  RegisterDtoSwagger,
  RegisterResponse,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDtoSwagger })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: LoginResponse,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDtoSwagger })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: RegisterResponse,
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(@Body() createUserDto: RegisterDto) {
    try {
      const existingUser = await this.usersService.findOneByEmail(createUserDto.email);
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
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
  
}
