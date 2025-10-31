import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './authService';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly svc: AuthService) { }
    @Post('register') register(@Body() d: RegisterDto) { return this.svc.register(d.email, d.password, d.tenantName); }
    @Post('login') login(@Body() d: LoginDto) { return this.svc.login(d.email, d.password); }
}
