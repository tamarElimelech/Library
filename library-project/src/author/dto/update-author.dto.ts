import { ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayUnique, IsArray, IsInt, IsOptional, IsString, Length } from "class-validator";

export class UpdateAuthorDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @Length(1, 30)
    name: string

    @ApiPropertyOptional({ type: [Number] })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    bookIds: Number[]
}
