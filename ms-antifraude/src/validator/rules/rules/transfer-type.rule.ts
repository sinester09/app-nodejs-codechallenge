import { Injectable, Logger } from '@nestjs/common';
import { ValidatorDto } from '../../dto/validator.dto';
import { Rule } from '../rule.interface';
import { ValidationResult } from '../rule-engine.service';

@Injectable()
export class TransferTypeRule implements Rule {
  name = 'TransferTypeRule';
  private readonly logger = new Logger(TransferTypeRule.name);
  
  // Tipos de transferencia permitidos (simulado)
  private readonly allowedTransferTypes: number[] = [1, 2, 3];
  
  // Límites por tipo de transferencia
  private readonly transferTypeLimits: Record<number, number> = {
    1: 500,   // Transferencia regular
    2: 1000,  // Transferencia premium
    3: 5000   // Transferencia corporativa
  };
  
  async evaluate(transaction: ValidatorDto): Promise<ValidationResult> {
    this.logger.log(`Evaluando regla de tipo de transferencia para transacción: ${transaction.transactionExternalId}`);
    
    // Si no viene el tipo de transferencia, lo consideramos válido (para compatibilidad)
    if (transaction.tranferTypeId === undefined) {
      return { isValid: true };
    }
    
    // Verificar si el tipo de transferencia es permitido
    if (!this.allowedTransferTypes.includes(transaction.tranferTypeId)) {
      return {
        isValid: false,
        reason: `El tipo de transferencia ${transaction.tranferTypeId} no es válido`
      };
    }
    
    // Verificar el límite según el tipo de transferencia
    const limit = this.transferTypeLimits[transaction.tranferTypeId];
    if (transaction.value > limit) {
      return {
        isValid: false,
        reason: `El monto ${transaction.value} excede el límite de ${limit} para el tipo de transferencia ${transaction.tranferTypeId}`
      };
    }
    
    return { isValid: true };
  }
}