import { Injectable } from '@nestjs/common'

import { SignUpDto, LoginDto, FindOneDto, FindManyDto, UpdateDto } from './dtos'
import {
	SignUpUseCase,
	LoginUseCase,
	FindByIdUseCase,
	FindOneUseCase,
	FindManyUseCase,
	UpdateUseCase
} from './use-cases'

@Injectable()
export class ShopService {
	constructor(
		private signUpUseCase: SignUpUseCase,
		private loginUseCase: LoginUseCase,
		private findByIdUseCase: FindByIdUseCase,
		private findOneUseCase: FindOneUseCase,
		private findManyUseCase: FindManyUseCase,
		private updateUseCase: UpdateUseCase
	) {}

	async signUp(input: SignUpDto) {
		return this.signUpUseCase.execute(input)
	}

	async login(input: LoginDto) {
		return this.loginUseCase.execute(input)
	}

	async findById(id: number) {
		return this.findByIdUseCase.execute(id)
	}

	async findOne(fields: FindOneDto) {
		return this.findOneUseCase.execute(fields)
	}

	async findMany(fields: FindManyDto) {
		return this.findManyUseCase.execute(fields)
	}

	async update(id: number, fields: UpdateDto) {
		return this.updateUseCase.execute(id, fields)
	}
}
