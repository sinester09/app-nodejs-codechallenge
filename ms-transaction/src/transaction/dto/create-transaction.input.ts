import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field()
  @IsNotEmpty()
  @IsUUID(4, { message: 'ID de cuenta débito debe ser un UUID válido' })
  accountExternalIdDebit: string;

  @Field()
  @IsNotEmpty()
  @IsUUID(4, { message: 'ID de cuenta crédito debe ser un UUID válido' })
  accountExternalIdCredit: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'El tipo de transferencia debe ser un número positivo' })
  tranferTypeId: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'El valor debe ser un número positivo' })
  value: number;
}