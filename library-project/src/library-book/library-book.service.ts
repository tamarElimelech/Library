import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Book } from '../book/entities/book.entity'
import { In, Repository } from 'typeorm'
import { AddBookToLibraryDto } from './dto/add-book-to-library.dto'
import { LibraryBook } from './entities/library-book.entity'

@Injectable()
export class LibraryBookService {

  constructor(
    @InjectRepository(LibraryBook)
    private libraryBookRepository: Repository<LibraryBook>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>
  ) { }

  async addBookToLibrary(dto: AddBookToLibraryDto) {

    const { libraryId, bookId, count = 1 } = dto

    const libraryBook = await this.libraryBookRepository.findOne({
      where: { libraryId, bookId }
    })

    if (libraryBook) {

      libraryBook.bookCount += count
      libraryBook.available += count

      return this.libraryBookRepository.save(libraryBook)
    }

    const newLibraryBook = this.libraryBookRepository.create({
      libraryId,
      bookId,
      bookCount: count,
      available: count
    })

    return this.libraryBookRepository.save(newLibraryBook)
  }

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

  async findLibraryBookOrFail(bookId: number, libraryId: number) {
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

  async getBooksByLibraryWithFilter(
    libraryId: number,
    filterFn: (lb: LibraryBook) => boolean
  ) {
    const libraryBooks = await this.libraryBookRepository.find({ where: { libraryId } })

    const filteredLibraryBooks = libraryBooks.filter(filterFn)

    if (filteredLibraryBooks.length === 0) return []

    const bookIds = filteredLibraryBooks.map(lb => lb.bookId)

    return this.bookRepository.findBy({ id: In(bookIds) })
  }

  async getAllAvailableBooksByLibraryId(libraryId: number) {

    return this.getBooksByLibraryWithFilter(libraryId, lb => lb.available > 0)
  }

  async getAllBorrowBooksByLibraryId(libraryId: number) {

    return this.getBooksByLibraryWithFilter(libraryId, lb => lb.bookCount - lb.available > 0)
  }

}
