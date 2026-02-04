import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() data: LoginUserDto) {
    return this.authService.signIn(data);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() data: RegisterUserDto) {
    return this.authService.signUp(data);
  }
}
