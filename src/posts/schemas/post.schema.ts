import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { PostStatus } from '../enums/post-status.enum';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  content!: string;

  @Prop({ type: String, enum: PostStatus, default: PostStatus.DRAFT })
  status!: PostStatus;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  author!: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
