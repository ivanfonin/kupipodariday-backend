import { IsUrl, Length, IsPositive } from 'class-validator';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/utils/entities/base.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  @IsPositive()
  price: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  raised: number;

  // relation
  // owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  // offers

  @Column({ default: 0 })
  copied: number;
}
