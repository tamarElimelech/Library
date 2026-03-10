import { Injectable } from '@nestjs/common';
import { CreateLibraryBookDto } from './dto/create-library-book.dto';
import { UpdateLibraryBookDto } from './dto/update-library-book.dto';

@Injectable()
export class LibraryBookService {
  create(createLibraryBookDto: CreateLibraryBookDto) {
    return 'This action adds a new libraryBook';
  }

  findAll() {
    return `This action returns all libraryBook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} libraryBook`;
  }

  update(id: number, updateLibraryBookDto: UpdateLibraryBookDto) {
    return `This action updates a #${id} libraryBook`;
  }

  remove(id: number) {
    return `This action removes a #${id} libraryBook`;
  }
}
