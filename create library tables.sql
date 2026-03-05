create table Library(
 id int identity(1,1) primary key,
 name varchar(50) not null
)

create table Author (
    id int identity(1,1) primary key,
    name nvarchar(30) not null
)


create table Book (
    id int identity(1,1) primary key,
    name nvarchar(50) not null
)

create table AuthorBook (
    authorId int not null,
    bookId int not null,

    primary key (authorId, bookId),

    foreign key (authorId) references Author(id),
    foreign key (bookId) references Book(id)
)

create table LibraryBook (
    libraryId int not null,
    bookId int not null,

    bookCount int not null check (BookCount > 0),

    available int not null,

    primary key (libraryId, bookId),

    foreign key (libraryId) references Library(id),
    foreign key (bookId) references Book(id),

    check (available >= 0 and available <= bookCount)
)

create table Borrow (
    id int identity(1,1) primary key,

    libraryId int not null,
    bookId int not null,

    borrowDate datetime not null default getdate(),
    returnDate datetime null,

    foreign key (libraryId, bookId)
    references LibraryBook(libraryId, bookId)
)






