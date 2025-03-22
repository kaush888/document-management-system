import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from 'src/users/entities/user.entity';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  role: 'user',
  validatePassword: jest.fn(),
} as unknown as User;

const mockUsersService = {
  findOneByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('fake-jwt-token'),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword = jest.fn().mockResolvedValue(true);

      const result = await authService.validateUser(mockUser.email, 'valid-password');

      expect(result).toEqual({
        email: mockUser.email,
        id: mockUser.id,
        role: mockUser.role,
      });
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith('valid-password');
    });

    it('should return null if user does not exist', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      const result = await authService.validateUser('nonexistent@example.com', 'password');

      expect(result).toBeNull();
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });

    it('should return null if password is incorrect', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword = jest.fn().mockResolvedValue(false);

      const result = await authService.validateUser(mockUser.email, 'wrong-password');

      expect(result).toBeNull();
      expect(mockUser.validatePassword).toHaveBeenCalledWith('wrong-password');
    });
  });

  describe('login', () => {
    it('should return a JWT token and user details', () => {
      const user = { id: '1', email: 'test@example.com', role: UserRole.VIEWER };
      const result = authService.login(user);

      expect(result).toEqual({
        token: 'fake-jwt-token',
        user,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith(user);
    });
  });
});
