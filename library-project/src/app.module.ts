import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'mssql',
    //   host: 'localhost',
    //   port: 1433,
    //   username: 'tamar',
    //   password: 'tomy0101',
    //   database: 'Library',

    //   autoLoadEntities: true,
    //   synchronize: false,
    //   options: {
    //     encrypt: false,
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
