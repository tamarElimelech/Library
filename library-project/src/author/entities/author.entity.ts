import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "../../book/entities/book.entity";

@Entity('Author')
export class Author {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 30 })
    name: string

    @ManyToMany(() => Book, (book) => book.authors)
    books: Book[]
}
