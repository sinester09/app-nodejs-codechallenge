mport { Test, TestingModule } from '@nestjs/testing';
import { ValidatorService } from '../src/validator/validator.service';
import { RuleEngine } from '../src/validator/rules/rule.engine.service';
import { AmountRule } from '../src/validator/rules/rules/amount.rule';
import { AccountRule } from '../src/validator/rules/rules/account.rule';
import { TransferTypeRule } from '../src/validator/rules/rules/transfer-type.rule';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

describe('ValidatorService (integration)', () => {
  let validatorService: ValidatorService;
  let ruleEngine: RuleEngine;
  let kafkaClientMock: ClientKafka;

  beforeEach(async () => {
    // Crear mock para el cliente Kafka
    kafkaClientMock = {
      emit: jest.fn(),
      connect: jest.fn().mockResolvedValue(undefined),
    } as unknown as ClientKafka;

    // Crear mock para ConfigService
    const configServiceMock = {
      get: jest.fn((key, defaultValue) => {
        if (key === 'TRANSACTION_MAX_AMOUNT') return 1000;
        return defaultValue;
      }),
    } as unknown as ConfigService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidatorService,
        RuleEngine,
        AmountRule,
        AccountRule,
        TransferTypeRule,
        {
          provide: 'TRANSACTION_SERVICE',
          useValue: kafkaClientMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    validatorService = module.get<ValidatorService>(ValidatorService);
    ruleEngine = module.get<RuleEngine>(RuleEngine);
  });

  it('should approve transactions with amounts less than 1000', async () => {
    // Arrange
    const transaction = {
      transactionExternalId: '123e4567-e89b-12d3-a456-426614174000',
      value: 500,
    };

    // Act
    await validatorService.validateTransaction(transaction);

    // Assert
    expect(kafkaClientMock.emit).toHaveBeenCalledWith(
      'transaction-validated',
      expect.stringContaining('"status":"APPROVED"')
    );
  });

  it('should reject transactions with amounts greater than 1000', async () => {
    // Arrange
    const transaction = {
      transactionExternalId: '123e4567-e89b-12d3-a456-426614174000',
      value: 1500,
    };

    // Act
    await validatorService.validateTransaction(transaction);

    // Assert
    expect(kafkaClientMock.emit).toHaveBeenCalledWith(
      'transaction-validated',
      expect.stringContaining('"status":"REJECTED"')
    );
  });
});