import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Pupils tracker backend')
    .setDescription('Pupils tracker backend')
    .setVersion('1.0.0')
    .addTag('pupils-tracker')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const options = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'defaultBearerAuth',
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: 'thisIsASampleBearerAuthToken123',
        },
      },
    },
  };
  SwaggerModule.setup('/api/docs', app, document, options);
}
