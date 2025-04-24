import { Injectable, Logger } from '@nestjs/common';
import { ValidatorDto } from '../../dto/validator.dto';
import { Rule } from '../rule.interface';
import { ValidationResult } from '../rule-engine.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AmountRule implements Rule {
  name = 'AmountRule';
  private readonly logger = new Logger(AmountRule.name);
  
  // Valores límite para transacciones
  private readonly maxAmount: number;
  
  constructor(private configService: ConfigService) {
    // Obtener el límite de configuración o usar valor por defecto
    this.maxAmount = this.configService.get<number>('TRANSACTION_MAX_AMOUNT', 1000);
    this.logger.log(`Regla de monto inicializada con límite: ${this.maxAmount}`);
  }
  
  async evaluate(transaction: ValidatorDto): Promise<ValidationResult> {
    this.logger.log(`Evaluando regla de monto para transacción: ${transaction.transactionExternalId}`);
    
    if (!transaction.value || transaction.value <= 0) {
      return {
        isValid: false,
        reason: 'El monto de la transacción debe ser positivo'
      };
    }
    
    if (transaction.value > this.maxAmount) {
      return {
        isValid: false,
        reason: `El monto de la transacción (${transaction.value}) excede el límite permitido (${this.maxAmount})`
      };
    }
    
    return { isValid: true };
  }
}