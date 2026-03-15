import { ConflictException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { Book } from '../../book/entities/book.entity';
import { LibraryBook } from '../entities/library-book.entity';
import { LibraryBookService } from '../library-book.service';
import { mockBookRepository, mockLibraryBookRepository } from './library-book.mocks';

describe('LibraryBookService', () => {
  let service: LibraryBookService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibraryBookService,
        { provide: getRepositoryToken(LibraryBook), useValue: mockLibraryBookRepository },
        { provide: getRepositoryToken(Book), useValue: mockBookRepository }
      ],
    }).compile();

    service = module.get<LibraryBookService>(LibraryBookService);
    jest.clearAllMocks()
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add book to library', () => {

    it('should update counts when libraryBook exists', async () => {
      const dto = { libraryId: 1, bookId: 1, count: 2 }
      const existingBook = { libraryId: 1, bookId: 1, bookCount: 3, available: 3 }

      mockLibraryBookRepository.findOne.mockResolvedValue(existingBook)
      mockLibraryBookRepository.save.mockImplementation((b) => b)

      const result = await service.addBookToLibrary(dto)

      expect(mockLibraryBookRepository.findOne).toHaveBeenCalledWith({
        where: { libraryId: 1, bookId: 1 }
      })
      expect(result.bookCount).toBe(5)
      expect(result.available).toBe(5)
      expect(mockLibraryBookRepository.save).toHaveBeenCalledWith(existingBook)
    })

    it('should create new libraryBook when not exists', async () => {
      const dto = { libraryId: 1, bookId: 2, count: 2 }
      const newBook = { ...dto, bookCount: 2, available: 2 }

      mockLibraryBookRepository.findOne.mockResolvedValue(null)
      mockLibraryBookRepository.create.mockReturnValue(newBook)
      mockLibraryBookRepository.save.mockImplementation((b) => b)

      const result = await service.addBookToLibrary(dto)

      expect(mockLibraryBookRepository.create).toHaveBeenCalledWith({
        libraryId: 1,
        bookId: 2,
        bookCount: 2,
        available: 2
      })
      expect(result.bookCount).toBe(2)
      expect(result.available).toBe(2)
      expect(mockLibraryBookRepository.save).toHaveBeenCalledWith(newBook)
    })
  })

  describe('remove book copy from library', () => {
    const bookId = 1
    const libraryId = 1

    it('should throw ConflictException if count is negative', async () => {
      await expect(service.removeBookCopyFromLibrary(bookId, libraryId, -1))
        .rejects.toThrow(ConflictException)
    })

    it('should throw ConflictException if available copies < count', async () => {
      const libraryBook = { bookId, libraryId, bookCount: 5, available: 1 }
      service.findLibraryBookOrFail = jest.fn().mockResolvedValue(libraryBook)

      await expect(service.removeBookCopyFromLibrary(bookId, libraryId, 2))
        .rejects.toThrow(ConflictException)
    })


    it('should remove book completely if bookCount 0', async () => {
      const libraryBook = { bookId, libraryId, bookCount: 1, available: 1 }
      service.findLibraryBookOrFail = jest.fn().mockResolvedValue(libraryBook)
      mockLibraryBookRepository.remove.mockImplementation((b) => b)

      const result = await service.removeBookCopyFromLibrary(bookId, libraryId, 1)

      expect(mockLibraryBookRepository.remove).toHaveBeenCalledWith(libraryBook)
      expect(result).toBe(libraryBook)
    })

    it('should save book with updated count if still copies left', async () => {
      const libraryBook = { bookId, libraryId, bookCount: 5, available: 3 }
      service.findLibraryBookOrFail = jest.fn().mockResolvedValue(libraryBook)
      mockLibraryBookRepository.save.mockImplementation((b) => b)

      const result = await service.removeBookCopyFromLibrary(bookId, libraryId, 2)

      expect(mockLibraryBookRepository.save).toHaveBeenCalledWith(libraryBook)
      expect(result.bookCount).toBe(3)
      expect(result.available).toBe(1)
    })

  })

  describe('get books by library with filter', () => {
    const libraryId = 1

    it('should return empty array if no library books found', async () => {
      mockLibraryBookRepository.find.mockResolvedValue([])

      const result = await service.getBooksByLibraryWithFilter(libraryId, () => true)

      expect(result).toEqual([])
    })

    it('should return books that match filter', async () => {
      const libraryBooks = [
        { bookId: 1, available: 2 },
        { bookId: 2, available: 0 },
      ]
      mockLibraryBookRepository.find.mockResolvedValue(libraryBooks)

      const filteredBooks = [
        { id: 1, name: 'Book One' },
      ]

      mockBookRepository.findBy.mockResolvedValue(filteredBooks)

      const result = await service.getBooksByLibraryWithFilter(libraryId, lb => lb.available > 0)

      expect(mockBookRepository.findBy).toHaveBeenCalledWith({ id: In([1]) })
      expect(result).toEqual(filteredBooks)
    })

  })

})
