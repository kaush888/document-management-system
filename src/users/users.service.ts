import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      // Convert null to undefined to match the return type
      return user || undefined;
    } catch (error) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        console.error('Error finding user:', error.message);
      } else {
        console.error(
          'Unknown error occurred while finding user:',
          String(error),
        );
      }
      return undefined;
    }
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      const newUser = this.usersRepository.create(user);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating user:', error.message);
      } else {
        console.error(
          'Unknown error occurred while creating user:',
          String(error),
        );
      }
      throw error; // Re-throw the error after logging
    }
  }
}
