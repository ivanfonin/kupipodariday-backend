import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { isEmail } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.save(createUserDto);
      delete user.password;
      return user;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.driverError.code === '23505') {
          throw new ConflictException(
            'Пользователь с такими данными уже существует',
          );
        }
      }
      throw err; // Если не поймали, то выбросим снова
    }
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    delete user.password;
    return user;
  }

  async findOne(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException(`Пользователь ${username} не найден`);
    }

    delete user.password;
    return user;
  }

  async findMany(query: string) {
    const user = isEmail(query)
      ? await this.findByEmail(query)
      : await this.findByUsername(query);

    if (!user) {
      throw new NotFoundException(`Не удалось найти пользователей`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    delete user.password;
    delete user.email;
    return user;
  }

  async findByUsername(username: string) {
    const users = await this.userRepository.find({
      where: { username: Like(`%${username}%`) },
    });
    const usersWithoutPasswordsAndEmails = users.map((user) => {
      delete user.password;
      delete user.email;
      return user;
    });
    return usersWithoutPasswordsAndEmails;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
