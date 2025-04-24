import { Injectable, Logger } from '@nestjs/common';
import { ValidatorDto } from '../dto/validator.dto';
import { Rule } from './rule.interface';
import { AmountRule } from './rules/amount.rule';
import { AccountRule } from './rules/account.rule';
import { TransferTypeRule } from './rules/transfer-type.rule';

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

@Injectable()
export class RuleEngine {
  private readonly logger = new Logger(RuleEngine.name);
  private rules: Rule[];

  constructor(
    private readonly amountRule: AmountRule,
    private readonly accountRule: AccountRule,
    private readonly transferTypeRule: TransferTypeRule
  ) {
    // Inicializar las reglas en el constructor
    this.rules = [
      this.amountRule,
      this.accountRule,
      this.transferTypeRule
    ];
  }

  async evaluateTransaction(transaction: ValidatorDto): Promise<ValidationResult> {
    this.logger.log(`Evaluando transacción según reglas de negocio: ${transaction.transactionExternalId}`);
    
    // Evaluar cada regla secuencialmente
    for (const rule of this.rules) {
      try {
        const result = await rule.evaluate(transaction);
        
        // Si alguna regla falla, retornar el resultado negativo inmediatamente
        if (!result.isValid) {
          this.logger.warn(`Regla ${rule.name} falló para la transacción ${transaction.transactionExternalId}: ${result.reason}`);
          return result;
        }
        
        this.logger.log(`Regla ${rule.name} pasó para la transacción ${transaction.transactionExternalId}`);
      } catch (error) {
        this.logger.error(`Error evaluando regla ${rule.name}: ${error.message}`, error.stack);
        return { 
          isValid: false, 
          reason: `Error evaluando regla ${rule.name}: ${error.message}` 
        };
      }
    }
    
    // Si todas las reglas pasan, la transacción es válida
    this.logger.log(`Todas las reglas pasaron para la transacción ${transaction.transactionExternalId}`);
    return { isValid: true };
  }
}