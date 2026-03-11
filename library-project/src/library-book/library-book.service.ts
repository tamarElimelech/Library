import { Injectable } from '@nestjs/common';
import { CreateLibraryBookDto } from './dto/create-library-book.dto';
import { UpdateLibraryBookDto } from './dto/update-library-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryBook } from './entities/library-book.entity';
import { In, Repository } from 'typeorm';
import { Book } from 'src/book/entities/book.entity';

@Injectable()
export class LibraryBookService {

  constructor(
    @InjectRepository(LibraryBook)
    private libraryBookRepository: Repository<LibraryBook>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>
  ) { }

  // create(createLibraryBookDto: CreateLibraryBookDto) {
  //   return 'This action adds a new libraryBook';
  // }

  // findAll() {
  //   return `This action returns all libraryBook`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} libraryBook`;
  // }

  // update(id: number, updateLibraryBookDto: UpdateLibraryBookDto) {
  //   return `This action updates a #${id} libraryBook`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} libraryBook`;
  // }

  // async removeBookFromLibrary() { }
  // async getAllAvailableBooks() { }
  // async getAllBorrowBooks() { }
  async getAllBooksByLibraryId(libraryId: number) {
    const libraryBooks = await this.libraryBookRepository.find({
      where: { libraryId }
    })

    const bookIds = libraryBooks.map(lb => lb.bookId)

    const books = await this.bookRepository.findBy({
      id: In(bookIds)
    })
    return books
  }
}
