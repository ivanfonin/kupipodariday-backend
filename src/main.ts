import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включить CORS для теста
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);

  // Вывод в консоль всех  раутов для разработки
  const server = app.getHttpServer();
  const router = server._events.request._router;
  const availableRoutes: Array<object> = router.stack
    .filter((layer: any) => layer.route)
    .map((layer: any) => ({
      path: layer.route?.path,
      method: layer.route?.stack[0].method,
    }));
  console.log(availableRoutes);
}
bootstrap();
