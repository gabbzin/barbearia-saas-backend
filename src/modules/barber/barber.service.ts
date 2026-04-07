import { Injectable } from "@nestjs/common";
import { BarberRepository } from "./barber.repository";

@Injectable()
export class BarberService {
	constructor(private readonly repository: BarberRepository) {}

	async findAllBarbers() {
		try {
			const result = await this.repository.findAll();

			return result;
		} catch (error) {
			throw error;
		}
	}

	async findBarberForId(id: string) {
		try {
			const result = await this.repository.findUnique(id);

			return result;
		} catch (error) {
			throw error;
		}
	}

	async create() {}
}
