import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST') ?? 'localhost',
    port: parseInt(configService.get<string>('DB_PORT') ?? '5432', 10),
    username: configService.get<string>('DB_USERNAME') ?? 'defaultUser',
    password: configService.get<string>('DB_PASSWORD') ?? 'defaultPassword',
    database:
      configService.get<string>('DB_DATABASE') ?? 'document_management_system',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: false, // Set to false in production
    migrations: ['dist/migrations/**/*{.ts,.js}'],
    migrationsRun: true,
    logging: true,
  }),
};
