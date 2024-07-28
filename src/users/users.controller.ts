import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUser(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Patch('me')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getUserWishes() {
    return this.usersService.findAll();
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.findOne(+username);
  }

  @Get(':username/wishes')
  getUsernameWishes() {
    return this.usersService.findAll();
  }

  @Post('find')
  find(@Body() findUserDto: FindUserDto) {
    const { query } = findUserDto;
    return this.usersService.findByEmailOrUsername(query);
  }
}
