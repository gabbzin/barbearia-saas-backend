import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  // create(createUserDto: CreateUserDto) {
  //   return "This action adds a new user";
  // }

  // findAll() {
  //   return `This action returns all user`;
  // }

  findUser(id: string) {
    return ``;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
