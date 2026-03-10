import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  createAuthor(createAuthorDto: CreateAuthorDto) {
    return 'This action adds a new author';
  }

  getAllAuthors() {
    return `This action returns all author`;
  }

  getAuthorById(id: number) {
    return `This action returns a #${id} author`;
  }

  updateAuthor(id: number, updateAuthorDto: UpdateAuthorDto) {
    return `This action updates a #${id} author`;
  }

  deleteAuthor(id: number) {
    return `This action removes a #${id} author`;
  }
}
