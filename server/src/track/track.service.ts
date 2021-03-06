import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Album, AlbumDocument } from 'src/album/schemas/album.schema';
import { FileService, FileType } from 'src/file/file.service';
import { OperateTrackWithAlbumDto } from './dto/operate-track-with-album.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Track, TrackDocument } from './schemas/track.schema';
import { UpdateTrackDto } from './dto/update-track-dto';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);

    const track = await this.trackModel.create({
      ...dto,
      listens: 0,
      audio: audioPath,
      picture: picturePath,
    });
    return track;
  }

  async updateTrack(
    id: ObjectId,
    dto: UpdateTrackDto,
    picture,
    audio,
  ): Promise<Track> {
    const media = this.getMediaData(audio, picture);
    const dataForUpdate = {
      ...dto,
      ...media,
    };
    this.deleteOldMediaData(id, media);

    const track = await this.trackModel.findOneAndUpdate(
      { _id: id },
      dataForUpdate,
      { new: true, useFindAndModify: false },
    );
    return track;
  }

  async getAll(count = 10, offset = 0): Promise<Track[]> {
    const tracks = await this.trackModel
      .find()
      .skip(Number(offset))
      .limit(Number(count))
      .populate('album');
    return tracks;
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel
      .findById(id)
      .populate('comments')
      .populate('album');
    return track;
  }

  async delete(id: ObjectId): Promise<{ message: string } | { error: string }> {
    const track = await this.trackModel.findByIdAndDelete(id);
    try {
      if (track?.picture) {
        this.fileService.removeFile(track.picture);
      }
      if (track?.audio) {
        this.fileService.removeFile(track.audio);
      }
      return { message: 'Track has been successfully removed.' };
    } catch (e) {
      return { error: e.message };
    }

    return track._id;
  }

  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create({ ...dto });
    track.comments.push(comment._id);
    await track.save();
    return comment;
  }

  async listen(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    track.listens += 1;
    track.save();
  }

  async search(query: string): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return tracks;
  }

  async addTrackToAlbum(
    dto: OperateTrackWithAlbumDto,
  ): Promise<{ message: string } | { error: string }> {
    try {
      const track = await this.trackModel.findById(dto.trackId);
      const album = await this.albumModel.findById(dto.albumId);

      track.album = album._id;

      album.tracks.push(track._id);
      album.save();
      track.save();

      return { message: 'Track successfully added to album.' };
    } catch (e) {
      return { error: 'An error occurred adding file.' };
    }
  }

  async removeTrackFromAlbum(
    dto: OperateTrackWithAlbumDto,
  ): Promise<{ message: string } | { error: string }> {
    try {
      const album = await this.albumModel.findById(dto.albumId);
      const track = await this.trackModel.findById(dto.trackId);

      album.tracks = album.tracks.filter((trackItem: TrackDocument) => {
        return trackItem._id.toString() !== track._id.toString();
      });
      track.album = undefined;

      album.save();
      track.save();

      return { message: 'Track successfully removed from album.' };
    } catch (error) {
      return { error: 'An error occurred removing file' };
    }
  }

  private getMediaData(audio, picture) {
    const returnData: { audio?: string; picture?: string } = {};

    if (audio) {
      audio = this.fileService.createFile(FileType.AUDIO, audio);
      returnData.audio = audio;
    }
    if (picture) {
      picture = this.fileService.createFile(FileType.IMAGE, picture);
      returnData.picture = picture;
    }
    return returnData;
  }

  private async deleteOldMediaData(id, media) {
    const track = await this.trackModel.findById(id);
    if (media.picture) {
      await this.fileService.removeFile(track.picture);
    }
    if (media.audio) {
      await this.fileService.removeFile(track.audio);
    }
  }
}
