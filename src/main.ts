import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Specify the app type as NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from "uploads" folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', // Files will be accessible via "/uploads/filename"
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
