import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ValidationExecutor } from 'class-validator/types/validation/ValidationExecutor';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metatype: ArgumentMetadata): Promise<any> {
    const object = plainToClass(metatype.metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      let messages = errors.map(error => {
        return `${error.property} - ${Object.values(error.constraints).join(
          ', ',
        )}`;
      });

      throw new ValidationExecutor(messages);
    }
    return value;
  }
}
