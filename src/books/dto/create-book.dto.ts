import { IsISBN, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @IsISBN()
  ISBN: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  Author: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(0)
  quantity: number;
}

