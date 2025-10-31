import { IsOptional, IsString } from 'class-validator';
export class GenerateDto { @IsOptional() @IsString() memberId?: string; }
export class VerifyDto { @IsString() qr: string; }
