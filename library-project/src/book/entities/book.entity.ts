import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Author } from "../../author/entities/author.entity";
import { LibraryBook } from "../../library-book/entities/library-book.entity";

@Entity('Book')
export class Book {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 50 })
    name: string

    @ManyToMany(() => Author, (author) => author.books)
    @JoinTable({
        name: 'AuthorBook',
        joinColumn: {
            name: 'bookId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'authorId',
            referencedColumnName: 'id'
        }
    })
    authors: Author[]

    @OneToMany(() => LibraryBook, (libraryBook) => libraryBook.book)
    libraryBooks: LibraryBook[];
}
