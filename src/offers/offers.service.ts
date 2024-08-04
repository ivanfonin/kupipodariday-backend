import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number): Promise<Offer> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wish = await this.wishesService.findOne(createOfferDto.itemId);

      if (wish.owner.id === userId) {
        throw new ForbiddenException(`Нельзя скинуться на свой же подарок`);
      }

      if (wish.raised >= wish.price) {
        throw new BadRequestException(`Средства на этот подарок уже собраны`);
      }

      if (wish.raised + createOfferDto.amount > wish.price) {
        throw new BadRequestException(
          `Сумма сбора не может превышать стоимость подарка`,
        );
      }

      // Создаём новый offer
      const offer = queryRunner.manager.create(Offer, {
        ...createOfferDto,
        user: { id: userId },
        item: wish,
      });

      // Сохраняем offer в базе
      await queryRunner.manager.save(offer);

      // Увеличиваем сумму собранных средств на подарок и сохраняем
      wish.raised += createOfferDto.amount;
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
