import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseUseCase } from '@common/domain/base'

import { UpdateDto } from '@modules/foods/dtos'
import { Food } from '@modules/foods/entities'
import { ShopService } from '@modules/shops/shops.service'

@Injectable()
export class UpdateUseCase implements BaseUseCase<Food> {
	private logger: Logger = new Logger('UpdateFood')

	constructor(
		private readonly shopService: ShopService,
		@InjectRepository(Food)
		private readonly foodRepository: Repository<Food>
	) {}

	async execute(shopId: number, foodId: number, input: UpdateDto): Promise<Food> {
		const shopExists = await this.shopService.findById(shopId)

		if (!shopExists) {
			this.logger.error('Throwing because food does not exist')
			throw new NotFoundException('Estabelecimento não existe')
		}

		const foodExists = await this.foodRepository.findOne({
			where: {
				id: foodId
			}
		})

		if (!foodExists) {
			this.logger.error('Throwing because food does not exist')
			throw new NotFoundException('Alimento não existe')
		}

		const updatedFood = await this.foodRepository.save({
			...input,
			shopId,
			id: foodId
		})

		return {
			...foodExists,
			...updatedFood
		}
	}
}
