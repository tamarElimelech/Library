import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LibraryBookService } from './library-book.service';
import { CreateLibraryBookDto } from './dto/create-library-book.dto';
import { UpdateLibraryBookDto } from './dto/update-library-book.dto';

@Controller('library-book')
export class LibraryBookController {
  constructor(private readonly libraryBookService: LibraryBookService) {}

  @Post()
  create(@Body() createLibraryBookDto: CreateLibraryBookDto) {
    return this.libraryBookService.create(createLibraryBookDto);
  }

  @Get()
  findAll() {
    return this.libraryBookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.libraryBookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLibraryBookDto: UpdateLibraryBookDto) {
    return this.libraryBookService.update(+id, updateLibraryBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryBookService.remove(+id);
  }
}
