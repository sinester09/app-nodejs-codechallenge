import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionStatus } from './transaction-status.enum';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    @Inject('ANTIFRAUD_RULES_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async create(createTransactionInput: CreateTransactionInput): Promise<Transaction> {
    this.logger.log(`Creando nueva transacción: ${JSON.stringify(createTransactionInput)}`);
    
    // Validar datos de entrada
    this.validateTransactionInput(createTransactionInput);
    
    // Crear transacción en base de datos
    const transaction = await this.transactionRepository.create({
      ...createTransactionInput,
      transactionStatus: TransactionStatus.PENDING,
    });

    // Emitir evento para validación antifraude
    if (transaction) {
      this.kafkaClient.emit('transaction-created', JSON.stringify({
        transactionExternalId: transaction.transactionExternalId,
        value: transaction.value,
        accountExternalIdDebit: transaction.accountExternalIdDebit,
        accountExternalIdCredit: transaction.accountExternalIdCredit,
        tranferTypeId: transaction.tranferTypeId,
      }));
    }

    return transaction;
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findByExternalId(id);

    if (!transaction) {
      this.logger.warn(`Transacción no encontrada: ${id}`);
      throw new NotFoundException(`Transacción '${id}' no encontrada`);
    }

    return transaction;
  }

  async updateStatus(id: string, status: string): Promise<Transaction> {
    const transaction = await this.findOne(id);
    
    // Verificar si el estado es válido
    if (!Object.values(TransactionStatus).includes(status as TransactionStatus)) {
      throw new Error(`Estado de transacción inválido: ${status}`);
    }

    // Actualizar el estado usando métodos de dominio
    if (status === TransactionStatus.APPROVED) {
      transaction.approve();
    } else if (status === TransactionStatus.REJECTED) {
      transaction.reject();
    } else {
      transaction.transactionStatus = status;
    }

    this.logger.log(`Actualizando estado de transacción ${id} a ${status}`);
    return this.transactionRepository.save(transaction);
  }

  private validateTransactionInput(dto: CreateTransactionInput): void {
    if (dto.value <= 0) {
      throw new Error('El valor de la transacción debe ser mayor a cero');
    }
    
    if (dto.accountExternalIdDebit === dto.accountExternalIdCredit) {
      throw new Error('Las cuentas de origen y destino no pueden ser iguales');
    }
  }
}