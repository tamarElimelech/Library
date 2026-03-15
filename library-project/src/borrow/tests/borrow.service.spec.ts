import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LibraryBook } from '../../library-book/entities/library-book.entity';
import { mockLibraryBookRepository } from '../../library-book/tests/library-book.mocks';
import { BorrowService } from '../borrow.service';
import { Borrow } from '../entities/borrow.entity';
import { mockBorrowRepository, mockDataSource } from './borrow.mocks';

describe('BorrowService', () => {
  let service: BorrowService

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

  describe('return book', () => {
    const borrowId = 1
    it('should return book successfully', async () => {
      const borrowMock = {
        id: borrowId,
        returnDate: null,
        libraryBook: { available: 2 },
      }
      mockDataSource.transaction.mockImplementation(async (fn) => {
        return fn({
          findOne: jest.fn().mockResolvedValue(borrowMock),
          save: jest.fn((entity) => entity),
        })
      })

      const result = await service.returnBook(borrowId)

      expect(result.returnDate).toBeInstanceOf(Date)
      expect(result.libraryBook.available).toBe(3)
    })

    it('should throw NotFoundException if borrow not found', async () => {
      mockDataSource.transaction.mockImplementation(async (fn) => {
        return fn({
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn(),
        })
      })

      await expect(service.returnBook(borrowId)).rejects.toThrow(NotFoundException)
    })

    it('should throw ConflictException if book already returned', async () => {
      const borrowMock = {
        id: borrowId,
        returnDate: new Date(),
        libraryBook: { available: 2 },
      }

      mockDataSource.transaction.mockImplementation(async (fn) => {
        return fn({
          findOne: jest.fn().mockResolvedValue(borrowMock),
          save: jest.fn(),
        })
      })

      await expect(service.returnBook(borrowId)).rejects.toThrow(ConflictException)
    })

  })


})
