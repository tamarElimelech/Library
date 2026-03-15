import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LibraryBook } from '../../library-book/entities/library-book.entity';
import { DataSource, Repository } from 'typeorm';
import { BorrowService } from '../borrow.service';
import { Borrow } from '../entities/borrow.entity';
import { mockBorrowRepository, mockDataSource, mockLibraryBookRepository } from './borrow.mocks';

describe('BorrowService', () => {
  let service: BorrowService
  let dataSource: DataSource
  let borrowRepository: Repository<Borrow>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorrowService,
        { 
          provide: DataSource, 
          useValue: mockDataSource 
        },
        {
          provide: getRepositoryToken(Borrow),
          useValue: mockBorrowRepository
        },
        {
          provide: getRepositoryToken(LibraryBook),
          useValue: mockLibraryBookRepository,
        },
      ],
    }).compile();

    service = module.get<BorrowService>(BorrowService)
    dataSource = module.get<DataSource>(DataSource)
    borrowRepository = module.get<Repository<Borrow>>(getRepositoryToken(Borrow))

  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  
});
