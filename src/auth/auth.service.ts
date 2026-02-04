import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { auth } from 'src/lib/auth';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  async signIn(data: LoginUserDto) {
    try {
      const result = await auth.api.signInEmail({
        body: {
          email: data.email,
          password: data.password
        }
      })

      return {
        user: result.user,
        token: result.token
      }
    } catch (error) {
      throw new UnauthorizedException("Invalid credentials");
    }
  }

  async signUp(data: RegisterUserDto) {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          name: data.name,
          email: data.email,
          password: data.password
        }
      })

      return {
        user: result.user,
        token: result.token
      }
    } catch (error) {
      throw new UnauthorizedException("Could not register user");
    }
  }
}
