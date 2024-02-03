import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';
import { setupSwagger } from './swagger';
// import { SessionBuilder } from '@ngrok/ngrok';
// const ngrok = require('@ngrok/ngrok');
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);
  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);

  // Get your endpoint online
  // Setup ngrok ingress
  // const session = await new SessionBuilder().authtokenFromEnv().connect();
  // const listener = await session.httpEndpoint().listen();
  // // new Logger('main').log(`Ingress established at ${listener.url()}`);
  // listener.forward(`localhost:${process.env.PORT}`);
  // Get your endpoint online
  // ngrok.connect({ addr: 3000, authtoken_from_env: true })
  //     .then(listener => console.log(`Ingress established at: ${listener.url()}`));
}

bootstrap();
// https://dbdiagram.io/d/612be3ce825b5b0146e9c12f
