import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserIdQuery {
  @IsNotEmpty()
  @IsEmail()
  userId: string;
}
