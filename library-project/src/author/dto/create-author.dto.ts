import { ApiProperty } from "@nestjs/swagger"
import { ArrayUnique, IsArray, IsInt, IsNotEmpty, IsString, Length } from "class-validator"

export class CreateAuthorDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 30)
    name: string

    @ApiProperty({ type: [Number] })
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    bookIds: Number[]
}
