import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  async create(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.repository.create(transactionData);
    return this.repository.save(transaction);
  }

  async findByExternalId(id: string): Promise<Transaction | null> {
    return this.repository.findOne({
      where: { transactionExternalId: id },
    });
  }

  async save(transaction: Transaction): Promise<Transaction> {
    return this.repository.save(transaction);
  }
}