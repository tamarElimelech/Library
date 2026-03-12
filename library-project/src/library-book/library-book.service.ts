import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Book } from 'src/book/entities/book.entity'
import { In, Repository } from 'typeorm'
import { LibraryBook } from './entities/library-book.entity'

@Injectable()
export class LibraryBookService {

  constructor(
    @InjectRepository(LibraryBook)
    private libraryBookRepository: Repository<LibraryBook>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>
  ) { }

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
