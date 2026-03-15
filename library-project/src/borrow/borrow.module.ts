import { Module } from '@nestjs/common';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow } from './entities/borrow.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Borrow])],
  controllers: [BorrowController],
  providers: [BorrowService],
})
export class BorrowModule {}
