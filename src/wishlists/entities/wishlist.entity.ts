import { IsUrl, Length } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/utils/entities/base.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @Length(1, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  // items
}
