import { UserModel } from '@common/domain/entities'
import { Reservation } from '@modules/reservations/entities'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('CLIENTE')
export class Client extends UserModel {
	@PrimaryGeneratedColumn({ name: 'CD_CLIENTE', type: 'number' })
	id!: number

	@Column({ name: 'NM_CLIENTE', type: 'varchar2', length: 50 })
	name!: string

	@Column({ name: 'ID_ACESSO', type: 'varchar2', length: 36 })
	accessId!: string

	@OneToMany(() => Reservation, reservation => reservation.client)
	reservations?: Reservation[]
}
