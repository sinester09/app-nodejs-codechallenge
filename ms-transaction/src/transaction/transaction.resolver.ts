import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => Transaction)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTransaction(
    @Args('createTransactionInput') createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    return this.transactionService.create(createTransactionInput);
  }

  @Query(() => Transaction, { name: 'transaction' })
  async findOne(@Args('id') id: string): Promise<Transaction> {
    return this.transactionService.findOne(id);
  }
}