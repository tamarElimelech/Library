import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsInt, IsOptional, Min } from "class-validator"

export class AddBookToLibraryDto {

  @ApiProperty()
  @IsInt()
  libraryId: number

  @ApiProperty()
  @IsInt()
  bookId: number

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @IsOptional()
  count?: number
}