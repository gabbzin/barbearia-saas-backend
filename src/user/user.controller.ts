import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

@Controller("user")
export class UserController {

  @Get("me")
  async getProfile(@Session() session: UserSession) {
    return {user: session.user}
  }
}