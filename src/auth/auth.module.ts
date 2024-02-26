import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { CompanyModule } from '../company/company.module';
import {MailerModule} from "../mailer/mailer.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET_NAME || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    CompanyModule,
    MailerModule,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
