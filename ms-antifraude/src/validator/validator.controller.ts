import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ValidatorService } from './validator.service';
import { ValidatorDto } from './dto/validator.dto';

@Controller()
export class ValidatorController {
  private readonly logger = new Logger(ValidatorController.name);

  constructor(private readonly validatorService: ValidatorService) {}

  @EventPattern('transaction-created')
  async handleTransactionCreated(@Payload() message: string) {
    try {
      this.logger.log(`Recibido evento transaction-created: ${message}`);
      
      // Parsear el mensaje y validar datos
      const payload = JSON.parse(message) as ValidatorDto;
      
      if (!payload.transactionExternalId || !payload.value) {
        this.logger.error(`Datos incompletos en el mensaje: ${message}`);
        return;
      }
      
      // Procesar la validación
      await this.validatorService.validateTransaction(payload);
      
    } catch (error) {
      this.logger.error(`Error procesando transaction-created: ${error.message}`, error.stack);
    }
  }
}