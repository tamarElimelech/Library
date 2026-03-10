import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateBookDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    name: string;

    @ApiProperty({ type: [Number] })
    @IsArray()
    @ArrayNotEmpty({ message: 'authorIds cannot be empty' })
    @ArrayUnique()
    @IsInt({ each: true })
    authorIds: number[];
}
