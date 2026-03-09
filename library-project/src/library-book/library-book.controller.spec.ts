import { Test, TestingModule } from '@nestjs/testing';
import { LibraryBookController } from './library-book.controller';
import { LibraryBookService } from './library-book.service';

describe('LibraryBookController', () => {
  let controller: LibraryBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibraryBookController],
      providers: [LibraryBookService],
    }).compile();

    controller = module.get<LibraryBookController>(LibraryBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
