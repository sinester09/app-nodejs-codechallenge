import { ValidatorDto } from '../dto/validator.dto';
import { ValidationResult } from './rule.engine.service';

export interface Rule {
  name: string;
  evaluate(transaction: ValidatorDto): Promise<ValidationResult>;
}
