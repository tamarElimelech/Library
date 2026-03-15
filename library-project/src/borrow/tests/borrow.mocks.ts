export const mockBorrowRepository = {
    save: jest.fn()
}

export const mockLibraryBookRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };
  
 export const mockDataSource = {
    transaction: jest.fn(),
  };