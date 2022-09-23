import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  SwaggerModule.setup(
    '/docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('주문 관리 페이지')
        .setDescription('주문 관리 페이지 api')
        .setVersion('1.0')
        .build(),
    ),
  );

  await app.listen(3000);
}
bootstrap();
