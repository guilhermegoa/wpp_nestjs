import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenAuthDto } from './dto/token-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('token')
  @ApiOperation({ summary: 'Get token to api' })
  @ApiResponse({ status: 200, description: 'Returned token' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async token(@Body() body: TokenAuthDto) {
    return this.authService.token(body.username, body.password, body.phone);
  }
}
