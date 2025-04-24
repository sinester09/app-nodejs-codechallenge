import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { TransactionStatus } from '../transaction-status.enum';

export class UpdateTransactionEvent {
  @IsNotEmpty()
  @IsUUID(4, { message: 'ID de transacción debe ser un UUID válido' })
  transactionExternalId: string;

  @IsNotEmpty()
  @IsEnum(TransactionStatus, { message: 'Estado de transacción inválido' })
  status: string;
}