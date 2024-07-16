import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { IGenerateToken } from '../common/interfaces';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async login(@Body() loginDto: AuthLoginDto): Promise<IGenerateToken> {
    return await this.authService.login(loginDto);
  }
  @Post('/register')
  async registration(
    @Body() adminDto: AuthRegisterDto,
  ): Promise<IGenerateToken> {
    return await this.authService.registration(adminDto);
  }

  @Post('/forgot-password')
  async forgetPassword(
    @Body() email: ForgetPasswordDto,
  ): Promise<{ status: number }> {
    return await this.authService.forgetPassword(email);
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() resetDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return await this.authService.resetPassword(resetDto);
  }
}
