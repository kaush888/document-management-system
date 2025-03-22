import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './schema/auth.schema';
import { UserRole } from 'src/users/entities/user.entity';

const mockAuthService = {
  validateUser: jest.fn(),
  login: jest.fn(),
};

const mockUsersService = {
  findOneByEmail: jest.fn(),
  create: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return login success response', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const user = { id: '1', email: loginDto.email, role: 'user' };
      const token = { accessToken: 'fake-jwt-token' };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockReturnValue(token);

      const result = await authController.login(loginDto);
      
      expect(result).toEqual({ message: 'Login successful', data: token });
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockAuthService.login).toHaveBeenCalledWith({ email: user.email, id: user.id, role: user.role });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);
      
      await expect(authController.login({ email: 'wrong@example.com', password: 'wrongpass' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password',
        firstName: 'New',
        lastName: 'User',
        role: UserRole.EDITOR
      };
      const createdUser = { id: '1', ...registerDto };

      mockUsersService.findOneByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await authController.register(registerDto);
      expect(result).toEqual({
        message: 'User registered successfully',
        data: {
          id: createdUser.id,
          email: createdUser.email,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          role: createdUser.role,
        },
      });
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(mockUsersService.create).toHaveBeenCalledWith(registerDto);
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue({ id: '1', email: 'existing@example.com' });

      await expect(
        authController.register({
          email: 'existing@example.com',
          password: 'password',
          firstName: 'Existing',
          lastName: 'User',
          role: UserRole.EDITOR
        })
      ).rejects.toThrow(ConflictException);
    });
  });
});
