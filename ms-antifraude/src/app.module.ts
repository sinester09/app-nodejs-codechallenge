import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ValidatorModule } from './validator/validator.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    // Configuración centralizada
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Logging estructurado
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
        level: process.env.LOG_LEVEL || 'info',
      },
    }),
    
    // Módulos de la aplicación
    ValidatorModule,
  ],
})
export class AppModule {}