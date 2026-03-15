import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Book } from "../../book/entities/book.entity";
import { Borrow } from "../../borrow/entities/borrow.entity";
import { Library } from "../../library/entities/library.entity";

@Entity('LibraryBook')
export class LibraryBook {

    @PrimaryColumn()
    libraryId: number

    @PrimaryColumn()
    bookId: number

    @ManyToOne(() => Library, (library) => library.libraryBooks)
    @JoinColumn({ name: 'libraryId' })
    library: Library

    @ManyToOne(() => Book, (book) => book.libraryBooks)
    @JoinColumn({ name: 'bookId' })
    book: Book

    @Column()
    bookCount: number

    @Column()
    available: number

    @OneToMany(() => Borrow, (borrow) => borrow.libraryBook)
    borrows: Borrow[]
}
