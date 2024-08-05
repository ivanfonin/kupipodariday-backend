import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number): Promise<Offer> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wish = await queryRunner.manager.findOne(Wish, {
        where: { id: createOfferDto.itemId },
        relations: ['owner'],
      });

      if (!wish) {
        throw new NotFoundException(`Подарок не найден`);
      }

      if (wish.owner.id === userId) {
        throw new ForbiddenException(`Нельзя скинуться на свой же подарок`);
      }

      if (Number(wish.raised) >= wish.price) {
        throw new BadRequestException(`Средства на этот подарок уже собраны`);
      }

      if (Number(wish.raised) + createOfferDto.amount > wish.price) {
        throw new BadRequestException(
          `Сумма сбора не может превышать стоимость подарка`,
        );
      }

      // Создаём новый offer
      const newOffer = queryRunner.manager.create(Offer, {
        amount: createOfferDto.amount,
        hidden: createOfferDto.hidden,
        user: { id: userId },
        item: wish,
      });
      const offer = await queryRunner.manager.save(newOffer);

      // Увеличиваем сумму собранных средств на подарок и сохраняем
      wish.raised = Number(wish.raised) + createOfferDto.amount;
      await queryRunner.manager.save(wish);

      await queryRunner.commitTransaction();

      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Создание оффера не удалось`);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all offers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }
}
