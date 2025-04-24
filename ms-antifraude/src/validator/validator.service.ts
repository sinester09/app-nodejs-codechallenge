import { 
  Inject, 
  Injectable, 
  Logger, 
  OnModuleInit
} from '@nestjs/common';
import { ValidatorDto } from './dto/validator.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class ValidatorService implements OnModuleInit {
  private readonly logger = new Logger(ValidatorService.name);

  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  validateTransaction({ transactionExternalId, value }: ValidatorDto) {
    const status = value > 1000 ? 'REJECTED' : 'APPROVED';
    this.kafkaClient.emit('transaction-validated', {
      transactionExternalId,
      status,
    });

    this.logger.log(`Transacción ${transactionExternalId} actualizada al estado ${status}`);
  }
}
