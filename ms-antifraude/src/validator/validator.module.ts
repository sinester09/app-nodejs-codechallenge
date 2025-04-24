import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidatorService } from './validator.service';
import { ValidatorController } from './validator.controller';
import { RuleEngine } from './rules/rule.engine.service';
import { AmountRule } from './rules/rules/amount.rule';
import { AccountRule } from './rules/rules/account.rule';
import { TransferTypeRule } from './rules/rules/transfer-type.rule'

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'TRANSACTION_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'antifraud-producer',
              brokers: configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
            },
            consumer: {
              groupId: 'antifraud-consumer-group',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ValidatorController],
  providers: [
    ValidatorService,
    RuleEngine,
    AmountRule,
    AccountRule,
    TransferTypeRule
  ],
  exports: [ValidatorService],
})
export class ValidatorModule {}