import { Controller, Get } from "@nestjs/common";
import type { BarberService } from "./barber.service";

@Controller("barber")
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Get()
  findAll() {
    return this.barberService.findAll();
  }

  @Get(":id")
  findOne(id: string) {
    return this.barberService.findOne(id);
  }

  // @Post()
  // create(@Body() createBarberDto: CreateBarberDto) {
  //   return this.barberService.create(createBarberDto);
  // }

  // @Patch(":id")
  // update(@Param('id') id: string, @Body() updateBarberDto: UpdateBarberDto) {
  //   return this.barberService.update(id, updateBarberDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.barberService.remove(id);
  // }
}
