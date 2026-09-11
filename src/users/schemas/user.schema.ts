import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({
    required: true,
    select: false,
  })
  password!: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role!: Role;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Post' }],
    default: [],
  })
  posts!: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
