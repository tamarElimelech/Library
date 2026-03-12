import { ApiProperty } from "@nestjs/swagger"

export class CreateBorrowDto {
    @ApiProperty()
    libraryId: number
    
    @ApiProperty()
    bookId: number
}
