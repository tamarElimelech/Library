import { ApiPropertyOptional } from '@nestjs/swagger'
import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt, IsOptional, IsString, Length } from 'class-validator'

export class UpdateBookDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(1, 50)
    name?: string

    @ApiPropertyOptional({ type: [Number] })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsInt({ each: true })
    authorIds?: number[]

}
