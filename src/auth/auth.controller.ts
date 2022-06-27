import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';

@ApiTags('authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  login(@Body() loginDto: AuthLoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('/register')
  registration(@Body() userDto: AuthRegisterDto) {
    return this.authService.registration(userDto);
  }
}
