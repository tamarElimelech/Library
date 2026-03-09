import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { LibraryModule } from './library/library.module';
import { BorrowModule } from './borrow/borrow.module';
import { LibraryBookModule } from './library-book/library-book.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<number>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, 
        extra: {
          trustServerCertificate: true,
        },
      }),
    }),
    AuthorModule,
    BookModule,
    LibraryModule,
    BorrowModule,
    LibraryBookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
