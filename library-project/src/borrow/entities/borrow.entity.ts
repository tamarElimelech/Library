import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LibraryBook } from "../../library-book/entities/library-book.entity";

@Entity('Borrow')
export class Borrow {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    libraryId: number
  
    @Column()
    bookId: number

    @ManyToOne(() => LibraryBook, (libraryBook) => libraryBook.borrows)
    @JoinColumn([
        { name: "libraryId", referencedColumnName: "libraryId" },
        { name: "bookId", referencedColumnName: "bookId" }
    ])
    libraryBook: LibraryBook

    @Column({ type: 'datetime', default: () => 'GETDATE()' })
    borrowDate: Date

    @Column({ type: 'datetime', nullable: true })
    returnDate: Date
}
