import { ApiProperty } from "@nestjs/swagger"
import { IsInt } from "class-validator"

export class CreateBorrowDto {
    @ApiProperty()
    @IsInt()
    libraryId: number
    
    @ApiProperty()
    @IsInt()
    bookId: number
}
