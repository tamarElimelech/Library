import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { LibraryBook } from 'src/library-book/entities/library-book.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { Borrow } from './entities/borrow.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BorrowService {
  constructor(private dataSource: DataSource,
    @InjectRepository(Borrow)
    private borrowRepository:Repository<Borrow>) { }

  async borrowBook(createBorrowDto: CreateBorrowDto) {
    const { libraryId, bookId } = createBorrowDto

    return this.dataSource.transaction(async (manager) => {

      const libraryBook = await manager.findOne(LibraryBook, {
        where: { libraryId, bookId }
      })

      if (!libraryBook) {
        throw new NotFoundException(`Book ${bookId} not found in library ${libraryId}`)
      }

      if (libraryBook.available <= 0) {
        throw new ConflictException(`No available copies of book ${bookId} in library ${libraryId} to borrow`)
      }

      const borrow =await manager.create(Borrow, { bookId, libraryId })

      await manager.save(borrow)

      libraryBook.available--
      await manager.save(libraryBook)

      return borrow
    })
  }

  async returnBook(borrowId: number) {

    return this.dataSource.transaction(async (manager) => {
      const borrow = await manager.findOne(Borrow, {
        where: { id: borrowId },
        relations: ['libraryBook']
      })
      if (!borrow) {
        throw new NotFoundException(`Borrow ${borrowId} not found`);
      }
      
      if (borrow.returnDate != null) {
        throw new ConflictException(`Book already returned`);
      }

      borrow.returnDate = new Date()
      borrow.libraryBook.available++

      await manager.save(borrow.libraryBook)
      await manager.save(borrow)
      
      return borrow

    })

  }

  async getBorrowsHistoryByLibraryId(libraryId:number){
    return this.borrowRepository.find({
      where:{libraryId}
    })
  }
}