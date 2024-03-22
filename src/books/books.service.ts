import { Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}
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
    await this.bookRepository.update({ ISBN }, updateBookDto);
    return await this.bookRepository.findOne({
      where: { ISBN: updateBookDto.ISBN },
    });
  }
}
