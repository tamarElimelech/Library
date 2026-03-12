import { Controller, Delete, Get, Param, Query } from '@nestjs/common'
import { LibraryBookService } from './library-book.service'

@Controller('library-book')
export class LibraryBookController {
  constructor(private readonly libraryBookService: LibraryBookService) { }

  @Get('/getAllBooksByLibraryId/:libraryId')
  getAllBooksByLibraryId(@Param('libraryId') libraryId: number) {
    return this.libraryBookService.getAllBooksByLibraryId(libraryId)
  }


}
