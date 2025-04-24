import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { TransactionStatus } from '../transaction-status.enum';

@ObjectType()
@Entity('transactions')
export class Transaction {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Field()
  @Column()
  accountExternalIdDebit: string;

  @Field()
  @Column()
  accountExternalIdCredit: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Field(() => Int)
  @Column()
  tranferTypeId: number;

  @Field()
  @Column({
    default: TransactionStatus.PENDING
  })
  transactionStatus: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  // Métodos de dominio
  public approve(): void {
    if (this.transactionStatus !== TransactionStatus.PENDING) {
      throw new Error('Solo se pueden aprobar transacciones pendientes');
    }
    this.transactionStatus = TransactionStatus.APPROVED;
  }

  public reject(reason?: string): void {
    if (this.transactionStatus !== TransactionStatus.PENDING) {
      throw new Error('Solo se pueden rechazar transacciones pendientes');
    }
    this.transactionStatus = TransactionStatus.REJECTED;
  }

  public isPending(): boolean {
    return this.transactionStatus === TransactionStatus.PENDING;
  }

  public isApproved(): boolean {
    return this.transactionStatus === TransactionStatus.APPROVED;
  }

  public isRejected(): boolean {
    return this.transactionStatus === TransactionStatus.REJECTED;
  }
}