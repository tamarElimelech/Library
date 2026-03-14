import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor)
@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) { }

  @Post('/borrowBook')
  borrowBook(@Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowService.borrowBook(createBorrowDto);
  }

  @Post('/returnBook/:borrowId')
  returnBook(@Param('borrowId') borrowId: number) {
    return this.borrowService.returnBook(borrowId);
  }

  @Get('/getBorrowsHistoryByLibraryId/:libraryId')
  getAllBorrowsHistoryByLibraryId(@Param('libraryId') libraryId:number){
  return this.borrowService.getBorrowsHistoryByLibraryId(libraryId)
  }

}
