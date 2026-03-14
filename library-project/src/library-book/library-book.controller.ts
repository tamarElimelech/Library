import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth } from '@nestjs/swagger'
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor'
import { LibraryBookService } from './library-book.service'
import { AddBookToLibraryDto } from './dto/add-book-to-library.dto'

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor)
@Controller('library-book')
export class LibraryBookController {
  constructor(private readonly libraryBookService: LibraryBookService) { }

  @Post('addBookToLibrary')
  addBookToLibrary(@Body() dto: AddBookToLibraryDto) {
    return this.libraryBookService.addBookToLibrary(dto)
  }

  @Get('/getAllBooksByLibraryId/:libraryId')
  getAllBooksByLibraryId(@Param('libraryId') libraryId: number) {
    return this.libraryBookService.getAllBooksByLibraryId(libraryId)
  }

  @Get('/getAllAvailableBooksByLibraryId/:libraryId')
  getAllAvailableBooksByLibraryId(@Param('libraryId') libraryId: number) {
    return this.libraryBookService.getAllAvailableBooksByLibraryId(libraryId)
  }

  @Get('/getAllBorrowBooksByLibraryId/:libraryId')
  getAllBorrowBooksByLibraryId(@Param('libraryId') libraryId: number) {
    return this.libraryBookService.getAllBorrowBooksByLibraryId(libraryId)
  }

  @Delete('deleteBookFromLibrary/:bookId/:libraryId')
  deleteBookFromLibrary(
    @Param('bookId') bookId: number,
    @Param('libraryId') libraryId: number) {
    return this.libraryBookService.deleteBookFromLibrary(bookId, libraryId)
  }

  @Delete('removeBookCopyFromLibrary/:bookId/:libraryId')
  removeBookCopyFromLibrary(
    @Param('bookId') bookId: number,
    @Param('libraryId') libraryId: number,
    @Query('count') count: number) {
    return this.libraryBookService.removeBookCopyFromLibrary(bookId, libraryId, count)
  }
}
