import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth } from '@nestjs/swagger'
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor'
import { CreateLibraryDto } from './dto/create-library.dto'
import { UpdateLibraryDto } from './dto/update-library.dto'
import { LibraryService } from './library.service'

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor)
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) { }

  @Post('/createLibrary')
  createLibrary(@Body() createLibraryDto: CreateLibraryDto) {
    return this.libraryService.createLibrary(createLibraryDto)
  }

  @Get('/getAllLibraries')
  getAllLibraries() {
    return this.libraryService.getAllLibraries()
  }

  @Get('getLibraryById/:id')
  getLibraryById(@Param('id') id: string) {
    return this.libraryService.getLibraryById(+id)
  }

  @Patch('updateLibrary/:id')
  updateLibrary(@Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    return this.libraryService.updateLibrary(+id, updateLibraryDto)
  }

  @Delete('removeLibrary/:id')
  removeLibrary(@Param('id') id: string) {
    return this.libraryService.removeLibrary(+id)
  }
}
