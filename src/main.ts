import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Specify the app type as NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from "uploads" folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', // Files will be accessible via "/uploads/filename"
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Document Management System API')
    .setDescription('The Document Management System API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT',
    )
    .addTag('auth', 'Authentication operations')
    .addTag('documents', 'Document operations')
    .addTag('embeddings', 'Document embeddings operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
