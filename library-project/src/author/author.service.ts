import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Book } from '../book/entities/book.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) { }

  private async findAuthorByIdOrFail(id: number, relations: string[] = []) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations
    })
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`)
    }
    return author
  }

  async createAuthor(createAuthorDto: CreateAuthorDto) {
    const books = await this.bookRepository.findBy({ id: In(createAuthorDto.bookIds) })
    if (createAuthorDto.bookIds && createAuthorDto.bookIds.length > 0) {
      if (books.length !== createAuthorDto.bookIds.length) {
        throw new NotFoundException('One or more book IDs not found')
      }
    }

    const author = await this.authorRepository.create({
      name: createAuthorDto.name,
      books: books,
    })

    return this.authorRepository.save(author)
  }

  async getAllAuthors() {
    return this.authorRepository.find({ relations: ['books'] })
  }

  async getAuthorById(id: number) {

    return this.findAuthorByIdOrFail(id)
  }

  async updateAuthor(id: number, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.findAuthorByIdOrFail(id, ['books'])

    if (updateAuthorDto.bookIds) {
      const books = await this.bookRepository.findBy({ id: In(updateAuthorDto.bookIds) })
      if (books.length !== updateAuthorDto.bookIds.length) {
        throw new NotFoundException('One or more book IDs not found')
      }
      author.books = books
    }

    if (updateAuthorDto.name) {
      author.name = updateAuthorDto.name
    }

    return this.authorRepository.save(author)
  }

  async deleteAuthor(id: number) {
    const author = await this.findAuthorByIdOrFail(id)
    return this.authorRepository.remove(author)
  }
}