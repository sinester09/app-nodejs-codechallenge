import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { TransactionStatus } from './transaction-status.enum';

interface UpdateTransactionEvent {
  transactionExternalId: string;
  status: string;
}

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}
  
  @EventPattern('transaction-validated')
  async handleTransactionValidated(@Payload() message: string) {
    try {
      const payload = JSON.parse(message) as UpdateTransactionEvent;
      this.logger.log(`Recibido evento transaction-validated: ${JSON.stringify(payload)}`);
      
      const { transactionExternalId, status } = payload;
      
      // Validar que el estado es válido
      if (!Object.values(TransactionStatus).includes(status as TransactionStatus)) {
        this.logger.error(`Estado de transacción inválido: ${status}`);
        return;
      }
      
      await this.transactionService.updateStatus(transactionExternalId, status);
      this.logger.log(`Transacción ${transactionExternalId} actualizada a ${status}`);
    } catch (error) {
      this.logger.error(`Error procesando evento transaction-validated: ${error.message}`, error.stack);
    }
  }
}