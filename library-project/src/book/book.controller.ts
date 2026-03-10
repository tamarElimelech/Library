import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post('/createBook')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Get('/getAllBooks')
  getAllBooks() {
    return this.bookService.getAllBooks();
  }

  @Get('/getBookById/:id')
  getBookById(@Param('id') id: string) {
    return this.bookService.getBookById(+id);
  }

  @Patch('/updateBook/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(+id, updateBookDto);
  }

  @Delete('deleteBook/:id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.removeBook(+id);
  }
}
