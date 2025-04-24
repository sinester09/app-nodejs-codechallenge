import { Injectable, Logger } from '@nestjs/common';
import { ValidatorDto } from '../../dto/validator.dto';
import { Rule } from '../rule.interface
import { ValidationResult } from '../rule.engine.service';

@Injectable()
export class AccountRule implements Rule {
  name = 'AccountRule';
  private readonly logger = new Logger(AccountRule.name);
  
  // Lista simulada de cuentas bloqueadas (en un caso real, esto vendría de una base de datos)
  private readonly blockedAccounts: string[] = [
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002'
  ];
  
  async evaluate(transaction: ValidatorDto): Promise<ValidationResult> {
    this.logger.log(`Evaluando regla de cuentas para transacción: ${transaction.transactionExternalId}`);
    
    // Validar que las cuentas de origen y destino están presentes
    if (!transaction.accountExternalIdDebit || !transaction.accountExternalIdCredit) {
      return {
        isValid: true, // Por ahora permitimos que sean opcionales
      };
    }
    
    // Verificar si alguna cuenta está en la lista de bloqueadas
    if (transaction.accountExternalIdDebit && 
        this.blockedAccounts.includes(transaction.accountExternalIdDebit)) {
      return {
        isValid: false,
        reason: 'La cuenta de origen está bloqueada para transacciones'
      };
    }
    
    if (transaction.accountExternalIdCredit && 
        this.blockedAccounts.includes(transaction.accountExternalIdCredit)) {
      return {
        isValid: false,
        reason: 'La cuenta de destino está bloqueada para transacciones'
      };
    }
    
    // Verificar que las cuentas de origen y destino no sean iguales
    if (transaction.accountExternalIdDebit === transaction.accountExternalIdCredit) {
      return {
        isValid: false,
        reason: 'Las cuentas de origen y destino no pueden ser iguales'
      };
    }
    
    return { isValid: true };
  }
}