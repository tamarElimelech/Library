import { Module } from '@nestjs/common';
import { LibraryBookService } from './library-book.service';
import { LibraryBookController } from './library-book.controller';

@Module({
  controllers: [LibraryBookController],
  providers: [LibraryBookService],
})
export class LibraryBookModule {}
