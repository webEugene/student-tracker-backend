import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async login(@Body() loginDto: AuthLoginDto) {
    return await this.authService.login(loginDto);
  }
  @Post('/register')
  registration(@Body() adminDto: AuthRegisterDto) {
    return this.authService.registration(adminDto);
  }
}
