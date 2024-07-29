import { IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @Length(6)
  password: string;
}
