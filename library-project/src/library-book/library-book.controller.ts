import { Controller, Delete, Get, Param, Query } from '@nestjs/common'
import { LibraryBookService } from './library-book.service'

@Controller('library-book')
export class LibraryBookController {
  constructor(private readonly libraryBookService: LibraryBookService) { }

  @Get('/getAllBooksByLibraryId/:libraryId')
  getAllBooksByLibraryId(@Param('libraryId') libraryId: number) {
    return this.libraryBookService.getAllBooksByLibraryId(libraryId)
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
