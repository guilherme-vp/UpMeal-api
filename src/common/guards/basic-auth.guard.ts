import {
	Injectable,
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Shop } from '@modules/shops/entities'

import { CryptService } from '@services/crypt'

@Injectable()
export class BasicAuthGuard implements CanActivate {
	private logger: Logger = new Logger('BasicAuthGuard')

	constructor(
		@InjectRepository(Shop)
		private readonly shopRepository: Repository<Shop>,
		private readonly cryptService: CryptService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		const authHeader = request.headers.authorization

		if (!authHeader) {
			this.logger.error('No authorization header given')
			throw new HttpException(
				'Você não tem autorização para realizar esse acesso',
				HttpStatus.UNAUTHORIZED
			)
		}

		const splitted = authHeader.split(' ')

		if (!splitted[1]) {
			this.logger.error('Header not valid or without Basic word')
			throw new HttpException(
				'Você não tem autorização para realizar esse acesso',
				HttpStatus.UNAUTHORIZED
			)
		}

		const basicToken = splitted[1]

		let decoded: string[]

		try {
			const decodedToken = Buffer.from(basicToken, 'base64').toString()

			decoded = decodedToken.split(':')
		} catch {
			this.logger.error('Invalid Auth')
			throw new HttpException('Autenticação inválida', HttpStatus.UNAUTHORIZED)
		}

		const shop = await this.shopRepository.findOne({ email: decoded[0] })

		if (!shop) {
			this.logger.error('Shop does not exists')
			throw new HttpException(
				'Estabelecimento com o email fornecido não existe',
				HttpStatus.NOT_FOUND
			)
		}

		const compared = await this.cryptService.compare(decoded[1], shop.password as string)

		if (!compared) {
			this.logger.error('Wrong password')
			throw new HttpException('Senha incorreta', HttpStatus.UNAUTHORIZED)
		}

		request.user = shop

		return true
	}
}
