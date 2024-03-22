import {
  IsISBN,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  ISBN: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  Author: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  genre: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  quantity: number;
}
