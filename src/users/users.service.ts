import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'src/auth/schema/auth.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      return user || undefined;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(user: RegisterDto): Promise<User> {
    try {
      const newUser = this.usersRepository.create(user);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
