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

	async findBarberById(id: string) {
		try {
			const result = await this.repository.findUniqueById(id);

			return result;
		} catch (error) {
			throw error;
		}
	}

	async createBarber(data: any) {}
}
