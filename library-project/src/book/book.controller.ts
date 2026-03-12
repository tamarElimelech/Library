import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { LoggingInterceptor } from '../interceptors/logging.interceptor'
import { BookService } from './book.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post('/createBook')
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto)
  }

  @Get('/getAllBooks')
  getAllBooks() {
    return this.bookService.getAllBooks()
  }

  @Get('/getBookById/:id')
  getBookById(@Param('id') id: string) {
    return this.bookService.getBookById(+id)
  }

  @Patch('/updateBook/:id')
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(+id, updateBookDto)
  }

  @Delete('deleteBook/:id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.removeBook(+id)
  }

  @Get('/searchBook')
  searchBook(@Query('prefix') prefix: string) {
    return this.bookService.searchBook(prefix)
  }

  @Get('/searchBookByAuthor')
  searchBookByAuthor(@Query('prefix') prefix: string) {
    return this.bookService.searchBookByAuthor(prefix)
  }
}
