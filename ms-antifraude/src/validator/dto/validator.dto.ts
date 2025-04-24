import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class ValidatorDto {
  @IsNotEmpty()
  @IsUUID(4, { message: 'transactionExternalId debe ser un UUID válido' })
  transactionExternalId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'El valor debe ser un número positivo' })
  value: number;

  // Campos adicionales que podrían ser útiles para reglas más complejas
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  tranferTypeId?: number;
}
