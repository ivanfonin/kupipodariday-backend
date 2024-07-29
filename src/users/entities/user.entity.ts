import { IsOptional, IsUrl, Length, IsEmail } from 'class-validator';
import { Entity, Column, Unique } from 'typeorm';
import { BaseEntity } from 'src/utils/entities/base.entity';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User extends BaseEntity {
  @Column()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsOptional()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsOptional()
  @IsUrl()
  avatar: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Length(6)
  password: string;

  // wishes

  // offers

  // wishlists
}
