import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/utils/entities/base.entity';

@Entity()
export class Offer extends BaseEntity {
  // user

  // item

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
