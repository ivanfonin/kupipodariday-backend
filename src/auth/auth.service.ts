import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  auth(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDto): Promise<any> {
    const { username, about, avatar, email, password } = createUserDto;

    // hash password
    const hashedPassword = password;

    const user = await this.usersService.create({
      username,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    return this.auth(user);
  }

  async signin(loginUserDto: LoginUserDto) {
    console.log(loginUserDto);
  }
}
