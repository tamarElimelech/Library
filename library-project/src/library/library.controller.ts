import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CreateLibraryDto } from './dto/create-library.dto'
import { UpdateLibraryDto } from './dto/update-library.dto'
import { LibraryService } from './library.service'

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) { }

  @Post()
  create(@Body() createLibraryDto: CreateLibraryDto) {
    return this.libraryService.createLibrary(createLibraryDto)
  }

  @Get()
  findAll() {
    return this.libraryService.getAllLibraries()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.libraryService.getLibraryById(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    return this.libraryService.updateLibrary(+id, updateLibraryDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryService.removeLibrary(+id)
  }
}
