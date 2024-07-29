import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUser(@Req() req) {
    return req.user;
  }

  @Patch('me')
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getUserWishes() {
    return 'returns auth user wishes';
  }

  @Post('find')
  find(@Body() findUserDto: FindUserDto) {
    const { query } = findUserDto;
    return this.usersService.findMany(query);
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Get(':username/wishes')
  getUsernameWishes(@Param('username') username: string) {
    return `returns ${username} wishes`;
  }
}
