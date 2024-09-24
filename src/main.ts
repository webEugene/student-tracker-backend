import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';
import { setupSwagger } from './swagger';
import { WinstonModule } from 'nest-winston';
import { CustomLoggerService } from './core/custom-logger';

async function bootstrap(): Promise<void> {
  const customLoggerService = new CustomLoggerService();
  const port: string = process.env.PORT;
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger(customLoggerService.createLoggerConfig),
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);
  await app.listen(port ? parseInt(port) : 3000);
}

bootstrap();
// https://dbdiagram.io/d/612be3ce825b5b0146e9c12f
