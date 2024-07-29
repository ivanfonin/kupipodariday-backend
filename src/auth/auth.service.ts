import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  auth(user: User) {
    console.log(user);
    return user;
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
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
}
