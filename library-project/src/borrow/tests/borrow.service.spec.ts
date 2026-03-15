import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LibraryBook } from '../../library-book/entities/library-book.entity';
import { DataSource, Repository } from 'typeorm';
import { BorrowService } from '../borrow.service';
import { Borrow } from '../entities/borrow.entity';
import { mockBorrowRepository, mockDataSource, mockLibraryBookRepository } from './borrow.mocks';
import { ConflictException, NotFoundException } from '@nestjs/common';

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

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('borrow book', () => {

    const createBorrowDto = { libraryId: 1, bookId: 1 }

    mockDataSource.transaction.mockImplementation(async (fn) => fn({
      findOne: mockLibraryBookRepository.findOne,
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => entity)
    }))

    it('should borrow book successfully', async () => {

      mockLibraryBookRepository.findOne.mockResolvedValue({
        libraryId: 1,
        bookId: 1,
        available: 3,
        bookCount: 3
      })



      const result = await service.borrowBook(createBorrowDto)

      expect(result).toBeDefined()
      expect(mockLibraryBookRepository.findOne).toHaveBeenCalledWith(
        LibraryBook, { where: { "bookId": 1, "libraryId": 1 } }
      )
      expect(mockDataSource.transaction).toHaveBeenCalledTimes(1)
    })

    it('should throw NotFoundException when libraryBook not found', async () => {

      mockLibraryBookRepository.findOne.mockResolvedValue(null)

      await expect(service.borrowBook(createBorrowDto))
        .rejects
        .toThrow(NotFoundException)

    })

    it('should throw ConflictException when no books available', async () => {
      mockLibraryBookRepository.findOne.mockResolvedValue({
        libraryId: 1,
        bookId: 1,
        available: 0,
        bookCount: 3
      })

      await expect(service.borrowBook(createBorrowDto)).rejects.toThrow(ConflictException)
    })

  })


})
