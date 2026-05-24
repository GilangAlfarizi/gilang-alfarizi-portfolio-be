import { envsConfig } from '@infrastructure/envs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function configureApp(app: INestApplication): Promise<void> {
  const env = envsConfig();

  // app.enableCors({
  //   origin: env.corsOrigins,
  //   credentials: true,
  //   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'x-trace-id'],
  // });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('Simple API for my portfolio requirement')
    .setVersion('2.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js',
    ],
  });
}
