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
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { Book } from './entities/book.entity';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiCreatedResponse({
    description: 'Added book successfully.',
    type: Book,
  })
  @ApiBadRequestResponse({
    description: 'Invalid price',
  })
  @ApiUnprocessableEntityResponse({
    description: 'This ISBN already exists in the system.',
  })
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

  @ApiOkResponse({
    description: 'Retrieved a book by its ISBN',
  })
  @ApiNotFoundResponse({
    description: 'A book is not found',
  })
  @Get(':ISBN')
  async findByISBN(@Param('ISBN') ISBN: string) {
    const book = await this.booksService.findByISBN(ISBN);
    if (!book) {
      throw new NotFoundException('ISBN not found');
    }
    return book;
  }

  @ApiOkResponse({
    description: 'Retrieved a book by its ISBN',
  })
  @ApiNotFoundResponse({
    description: 'A book is not found',
  })
  @Get('isbn/:ISBN')
  async findByISBNAlt(@Param('ISBN') ISBN: string) {
    return this.findByISBN(ISBN);
  }

  @ApiOkResponse({
    description: 'Updated book',
  })
  @ApiBadRequestResponse({
    description: 'Invalid price.',
  })
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
    const bookExists = await this.booksService.findByISBN(ISBN);
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
