import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiBadRequestResponse({
  description:
    'Validation failed: invalid or missing fields, or unexpected properties',
})
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description:
      'User registered successfully. Copy accessToken into Authorize to call protected endpoints.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User registered successfully' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Anano Topuria' },
            email: { type: 'string', example: 'anano@example.com' },
            role: { type: 'string', example: 'user' },
          },
        },
        accessToken: { type: 'string', description: 'JWT access token' },
      },
    },
  })
  @ApiConflictResponse({ description: 'Email is already registered' })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in and receive a JWT access token' })
  @ApiCreatedResponse({
    description:
      'User signed in successfully. Copy accessToken into Authorize to call protected endpoints.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User signed in successfully' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Anano Topuria' },
            email: { type: 'string', example: 'anano@example.com' },
            role: { type: 'string', example: 'user' },
          },
        },
        accessToken: { type: 'string', description: 'JWT access token' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
