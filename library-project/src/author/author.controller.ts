import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@UseInterceptors(LoggingInterceptor)
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) { }

  @Post('/createAuthor')
  createAuthor(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.createAuthor(createAuthorDto);
  }

  @Get('/getAllAuthors')
  getAllAuthors() {
    return this.authorService.getAllAuthors();
  }

  @Get('/getAuthorById/:id')
  getAuthorById(@Param('id') id: string) {
    return this.authorService.getAuthorById(+id);
  }

  @Patch('/updateAuthor/:id')
  updateAuthor(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.updateAuthor(+id, updateAuthorDto);
  }

  @Delete('/deleteAuthor/:id')
  deleteAuthor(@Param('id') id: string) {
    return this.authorService.deleteAuthor(+id);
  }
}
