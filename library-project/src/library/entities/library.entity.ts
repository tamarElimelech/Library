import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LibraryBook } from "../../library-book/entities/library-book.entity";

@Entity('Library')
export class Library {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 50 })
    name: string

    @OneToMany(() => LibraryBook, (libraryBook) => libraryBook.library)
    libraryBooks: LibraryBook[]
}
