import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Library } from './entities/library.entity'
import { CreateLibraryDto } from './dto/create-library.dto'
import { UpdateLibraryDto } from './dto/update-library.dto'

@Injectable()
export class LibraryService {

  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,
  ) { }

  private async findLibraryByIdOrFail(id: number, relations: string[] = []){
    const library = await this.libraryRepository.findOne({
      where: { id },
      relations
    })

    if (!library) {
      throw new NotFoundException(`Library with id ${id} not found`)
    }
    return library
  }

  async createLibrary(createLibraryDto: CreateLibraryDto) {

    const library = this.libraryRepository.create({
      name: createLibraryDto.name
    })

    return this.libraryRepository.save(library)
  }

  async getAllLibraries() {
    return this.libraryRepository.find()
  }

  async getLibraryById(id: number) {
    return this.findLibraryByIdOrFail(id)
  }

  async updateLibrary(id: number, updateLibraryDto: UpdateLibraryDto) {

    const library = await this.findLibraryByIdOrFail(id)

    if (updateLibraryDto.name) {
      library.name = updateLibraryDto.name
    }

    return this.libraryRepository.save(library)
  }

  async removeLibrary(id: number) {
    const library = await this.findLibraryByIdOrFail(id)

    return this.libraryRepository.remove(library)
  }
}