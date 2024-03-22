import { Injectable, NotFoundException  } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) { }
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    const newBook = await this.bookRepository.save(book);
    return newBook;
  }
  async findByISBN(ISBN: string): Promise<Book | undefined> {
    const book = await this.bookRepository.findOne({ where: { ISBN } });
    return book;
  }
  async updateByISBN(
    ISBN: string,
    updateBookDto: UpdateBookDto,
  ): Promise<Book | undefined> {
    const book = await this.bookRepository.findOne({ where: { ISBN } });

    if (!book) {
      throw new NotFoundException('ISBN not found');
    }

    if (updateBookDto.title) {
      book.title = updateBookDto.title;
    }
    if (updateBookDto.Author) {
      book. Author = updateBookDto.Author;
    }
    if (updateBookDto.description) {
      book.description = updateBookDto.description;
    }
    if (updateBookDto.genre) {
      book.genre = updateBookDto.genre;
    }
    if (updateBookDto.price) {
      book.price = updateBookDto.price;
    }
    if (updateBookDto.quantity) {
      book.quantity = updateBookDto.quantity;
    }

    return this.bookRepository.save(book);
  }
}
