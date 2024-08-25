import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';
import { setupSwagger } from './swagger';

async function bootstrap(): Promise<void> {
  const logger: Logger = new Logger();
  const port: string = process.env.PORT;
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);
  await app.listen(port ? parseInt(port) : 3000);
  logger.log(`Application running on port ${port}`);
}

bootstrap();
// https://dbdiagram.io/d/612be3ce825b5b0146e9c12f
