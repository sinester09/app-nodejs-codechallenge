import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export class TransactionValidatedDto {
  @IsNotEmpty()
  @IsUUID(4, { message: 'transactionExternalId debe ser un UUID válido' })
  transactionExternalId: string;

  @IsNotEmpty()
  @IsEnum(TransactionStatus, { message: 'Estado debe ser APPROVED o REJECTED' })
  status: TransactionStatus;

  @IsString()
  reason?: string;
}
