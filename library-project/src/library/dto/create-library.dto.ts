import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateLibraryDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string

}