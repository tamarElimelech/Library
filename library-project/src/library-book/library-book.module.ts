import { Module } from '@nestjs/common';
import { LibraryBookService } from './library-book.service';
import { LibraryBookController } from './library-book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryBook } from './entities/library-book.entity';
import { Book } from 'src/book/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryBook, Book])],
  controllers: [LibraryBookController],
  providers: [LibraryBookService],
})
export class LibraryBookModule { }
