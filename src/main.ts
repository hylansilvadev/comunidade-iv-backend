import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:[
      'http://localhost:8081',
      'http://localhost:8080',
    ],
    methods:["GET","POST"],
    credentials:true
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
