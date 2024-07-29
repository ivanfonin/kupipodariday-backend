import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('/')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signin')
  signin() {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.authService.signup(createUserDto);
  }
}
