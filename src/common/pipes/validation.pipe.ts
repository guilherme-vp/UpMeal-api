/* eslint-disable @typescript-eslint/ban-types */
import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException
} from '@nestjs/common'
import { plainToClassFromExist } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
	async transform(value: any, { metatype }: ArgumentMetadata) {
		if (!metatype || !this.toValidate(metatype)) {
			return value
		}

		const object = plainToClassFromExist(metatype, value)
		const errors = await validate(object)
		const constraintErrors = errors.map(({ constraints }) => constraints)

		if (errors.length > 0) {
			throw new BadRequestException(constraintErrors)
		}

		return value
	}

	private toValidate(metatype: Function): boolean {
		const types: Function[] = [String, Boolean, Number, Array, Object]
		return !types.includes(metatype)
	}
}
