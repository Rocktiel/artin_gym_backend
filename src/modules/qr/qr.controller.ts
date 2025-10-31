import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QrService } from './qr.service';
import { GenerateDto, VerifyDto } from './dto';

@Controller('qr')
@UseGuards(AuthGuard('jwt'))
export class QrController {
    constructor(private readonly svc: QrService) { }
    @Post('generate') gen(@Req() req, @Body() d: GenerateDto) {
        const tenantId = req.user.tenantId; const memberId = d.memberId ?? req.user.userId;
        return this.svc.generate(tenantId, memberId);
    }
    @Post('verify') verify(@Req() req, @Body() d: VerifyDto) {
        return this.svc.verify(req.user.tenantId, d.qr);
    }
}
