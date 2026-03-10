import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from 'src/author/entities/author.entity';
import { In, Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>
  ) { }

  async createBook(createBookDto: CreateBookDto) {
    const authors = await this.authorRepository.findBy({
      id: In(createBookDto.authorIds)
    })

    if (authors.length != createBookDto.authorIds.length) {
      throw new NotFoundException('one or more author id not found')
    }

    const book = this.bookRepository.create(
      {
        name: createBookDto.name,
        authors: authors
      })
    return this.bookRepository.save(book)
  }

  async getAllBooks() {
    return this.bookRepository.find()
  }

  async getBookById(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
    })
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return book
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['authors']
    })
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    if (updateBookDto.authorIds) {
      const authors = await this.authorRepository.findBy({
        id: In(updateBookDto.authorIds)
      })
      if (updateBookDto.authorIds.length != authors.length) {
        throw new NotFoundException('One or more authors not found')
      }
      book.authors = authors
    }
    if (updateBookDto.name) {
      book.name = updateBookDto.name
    }
    return await this.bookRepository.save(book)
  }

  async removeBook(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } })
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return this.bookRepository.remove(book)
  }
}
