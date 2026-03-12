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

  private async findLibraryBookOrFail(bookId: number, libraryId: number) {
    const libraryBook = await this.libraryBookRepository.findOne({
      where: { libraryId, bookId }
    })

    if (!libraryBook) {
      throw new NotFoundException(
        `book with id ${bookId} not found in library ${libraryId}`
      )
    }

    return libraryBook
  }

  async removeBookCopyFromLibrary(bookId: number, libraryId: number, count: number = 1) {
    if (count < 0) {
      throw new ConflictException('count must be greater than 0')
    }
    count = Math.floor(count)

    const libraryBook = await this.findLibraryBookOrFail(bookId, libraryId)

    if (libraryBook.available < count) {
      throw new ConflictException(
        `can't remove copy of book ${bookId} from library ${libraryId} because no copies are available`
      )
    }

    libraryBook.bookCount -= count
    libraryBook.available -= count

    if (libraryBook.bookCount === 0) {
      return this.libraryBookRepository.remove(libraryBook)
    }

    return this.libraryBookRepository.save(libraryBook)
  }

  async deleteBookFromLibrary(bookId: number, libraryId: number) {

    const libraryBook = await this.findLibraryBookOrFail(bookId, libraryId)

    const borrowedCount = libraryBook.bookCount - libraryBook.available

    if (borrowedCount > 0) {
      throw new ConflictException(
        `can't delete book ${bookId} from library ${libraryId} because ${borrowedCount} copies are currently borrowed`
      )
    }

    return this.libraryBookRepository.remove(libraryBook)
  }

  

}
