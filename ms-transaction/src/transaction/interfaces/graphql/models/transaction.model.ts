import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionModel {
  @Field()
  transactionExternalId: string;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field(() => Float)
  value: number;

  @Field(() => Int)
  tranferTypeId: number;

  @Field()
  transactionStatus: string;

  @Field()
  createdAt: Date;
}