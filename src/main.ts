import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

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
