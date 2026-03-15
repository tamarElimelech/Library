import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/book/entities/book.entity';
import { LibraryBook } from './entities/library-book.entity';
import { LibraryBookController } from './library-book.controller';
import { LibraryBookService } from './library-book.service';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryBook, Book])],
  controllers: [LibraryBookController],
  providers: [LibraryBookService],
})
export class LibraryBookModule { }
