import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  Put,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Response } from 'express';
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto, @Res() res: Response) {
    if (!/^\d+(\.\d{1,2})?$/.test(createBookDto.price.toString())) {
      throw new BadRequestException(
        'Price must be a valid number with 2 decimal places.',
      );
    }
    const existingBook = await this.booksService.findByISBN(createBookDto.ISBN);
    if (existingBook) {
      throw new UnprocessableEntityException('Book already exists');
    }
    const createdBook = await this.booksService.create(createBookDto);
    res
      .status(HttpStatus.CREATED)
      .location(`/books/${createdBook.ISBN}`)
      .json(createdBook);
  }

  @Get(':ISBN')
  async findByISBN(@Param('ISBN') ISBN: string) {
    const book = await this.booksService.findByISBN(ISBN);
    if (!book) {
      throw new NotFoundException('ISBN not found');
    }
    return book;
  }
  @Get('isbn/:ISBN')
  async findByISBNAlt(@Param('ISBN') ISBN: string) {
    return this.findByISBN(ISBN);
  }

  @Put('/:ISBN')
  async update(
    @Param('ISBN') ISBN: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    if (!/^\d+(\.\d{1,2})?$/.test(updateBookDto.price.toString())) {
      throw new BadRequestException(
        'Price must be a valid number with 2 decimal places.',
      );
    }
    console.log(updateBookDto);
    const bookExists = await this.booksService.findByISBN(ISBN);
    console.log(bookExists);
    if (!bookExists) {
      throw new NotFoundException('Book not found');
    }
    const updatedBook = await this.booksService.updateByISBN(
      ISBN,
      updateBookDto,
    );
    return updatedBook;
  }
}
