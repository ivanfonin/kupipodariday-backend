import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
  ) {}

  async create(userId: number, createWishDto: CreateWishDto): Promise<Wish> {
    return await this.wishRepository.save({
      ...createWishDto,
      owner: { id: userId },
    });
  }

  async getTopWishes() {
    const wishes = await this.wishRepository.find({
      relations: {
        owner: true,
      },
      order: {
        copied: 'DESC',
      },
      take: 20,
    });

    if (!wishes) {
      throw new NotFoundException(`Подаки не найдены`);
    }

    return wishes;
  }

  async getLastWishes() {
    const wishes = await this.wishRepository.find({
      relations: {
        owner: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });

    if (!wishes) {
      throw new NotFoundException(`Подаки не найдены`);
    }

    return wishes;
  }

  async findOne(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException(`Подарок не найден`);
    }

    return wish;
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return this.wishRepository.update({ id }, updateWishDto);
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
