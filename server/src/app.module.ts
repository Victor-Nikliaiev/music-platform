import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileModule } from './file/file.module';
import { TrackModule } from './track/track.module';
import * as path from 'path';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://arhis:arhis@cluster0.hduwg.mongodb.net/music-app?retryWrites=true&w=majority',
    ),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    TrackModule,
    FileModule,
    AlbumModule,
  ],
})
export class AppModule {}
