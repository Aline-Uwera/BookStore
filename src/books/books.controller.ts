import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
  NotFoundException
} from '@nestjs/common';
import { Book } from './entities/book.entity';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Response } from 'express';
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto, @Res() res: Response) {
    const missingFields = Object.keys(createBookDto).filter(
      (key) => !createBookDto[key],
    );
    if (missingFields.length > 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Missing or malformed input.' });
    }

    const existingBook = await this.booksService.findByISBN(createBookDto.ISBN);
    if (existingBook) {
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: 'This ISBN already exists in the system.' });
    }

    if (!/^\d+(\.\d{1,2})?$/.test(createBookDto.price.toString())) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Price must be a valid number with 2 decimal places.',
      });
    }

    const createdBook = await this.booksService.create(createBookDto);

    return res
      .status(HttpStatus.CREATED)
      .location(`/books/${createdBook.ISBN}`)
      .json(createdBook);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':ISBN')
  async findByISBN(@Param('ISBN') ISBN: string, @Res() res: Response) {
    try {
      const book = await this.booksService.findByISBN(ISBN);
console.log(book);

      if (!book) {
        throw new NotFoundException('ISBN not found');
      }

      return res.status(HttpStatus.OK).json(book);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error.' });
      }
    }
  }
  @Get('isbn/:ISBN')
  async findByISBNAlt(@Param('ISBN') ISBN: string, @Res() res: Response) {
    // Delegate the retrieval to the existing endpoint
    return this.findByISBN(ISBN, res);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
  //   return this.booksService.update(+id, updateBookDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  @Put('/:ISBN')
  async update(
    @Param('ISBN') ISBN: string,
    @Body() updateBookDto: UpdateBookDto,
    @Res() res: Response,
  ) {
    const missingFields = Object.keys(updateBookDto).filter(
      (key) => !updateBookDto[key],
    );
    if (missingFields.length > 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Missing or malformed input.' });
    }

    if (!/^\d+(\.\d{1,2})?$/.test(updateBookDto.price.toString())) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Price must be a valid number with 2 decimal places.',
      });
    }

    try {
      // Update the book
      const updatedBook = await this.booksService.updateByISBN(
        ISBN,
        updateBookDto,
      );

      // If the book with the provided ISBN is not found, throw a NotFoundException
      if (!updatedBook) {
        throw new NotFoundException('ISBN not found');
      }

      // Return the updated book
      return res.status(HttpStatus.OK).json(updatedBook);
    } catch (error) {
      // Catch any errors and return appropriate responses
      if (error.status && error.status === HttpStatus.NOT_FOUND) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error.' });
      }
    }
  }
}
