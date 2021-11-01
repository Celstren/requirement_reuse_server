import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
var cors = require('cors')


async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });

  // const options = {
  //   "origin": "*",
  //   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  //   "preflightContinue": false,
  //   "optionsSuccessStatus": 200,
  //   "credentials":true,
  //   "allowedHeaders": "Content-Type,Accept,Authorization",

  // }
  // app.use(cors(options));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept,Authorization');
    next();
  });

  app.useGlobalPipes(new ValidationPipe());
  
  const config = new DocumentBuilder()
    .setTitle('Agile Requirement Reuse Server')
    .setDescription('The Agile Requirement Reuse API to allow users to reuse requirements from other projects')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
}
bootstrap();
