import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/users/entities/user.entity';
import { USER_CONFIG } from 'src/config/constants';

export class LoginDtoSwagger {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    minLength: USER_CONFIG.PASSWORD.MIN,
    maxLength: USER_CONFIG.PASSWORD.MAX,
    example: 'password123',
  })
  password: string;
}

export class RegisterDtoSwagger {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    minLength: USER_CONFIG.PASSWORD.MIN,
    maxLength: USER_CONFIG.PASSWORD.MAX,
    example: 'password123',
  })
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.VIEWER,
  })
  role: UserRole;
}

export class LoginResponse {
  @ApiProperty({
    description: 'Response message',
    example: 'Login successful',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        role: 'viewer',
      },
    },
  })
  data: {
    token?: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
}

export class RegisterResponse {
  @ApiProperty({
    description: 'Response message',
    example: 'User registered successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    example: {
      id: '9a413e9d-d190-4685-9cdb-fc56a8d9810c',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'viewer',
    },
  })
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
