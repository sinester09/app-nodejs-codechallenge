import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  
  // Kafka brokers desde configuración
  const kafkaBrokers = configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(',');
  
  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Configurar microservicio
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'antifraud-consumer',
        brokers: kafkaBrokers,
      },
      consumer: {
        groupId: 'antifraud-consumer-group',
      },
    },
  });
  
  // Iniciar microservicios
  await app.startAllMicroservices();
  logger.log(`Microservicio Kafka iniciado con brokers: ${kafkaBrokers.join(',')}`);
  
  // Puerto HTTP desde configuración
  const port = configService.get<number>('PORT', 3001);
  
  // Iniciar aplicación HTTP
  await app.listen(port);
  logger.log(`Aplicación iniciada en: ${await app.getUrl()}`);
}

bootstrap();