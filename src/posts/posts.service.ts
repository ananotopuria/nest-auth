import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Role } from '../users/enums/role.enum';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string) {
    const post = await this.postModel.create({
      ...createPostDto,
      author: authorId,
    });

    await this.userModel.findByIdAndUpdate(authorId, {
      $addToSet: { posts: post._id },
    });

    return post.populate('author', 'name email role');
  }

  findAll() {
    return this.postModel.find().populate('author', 'name email role').exec();
  }

  async findOne(id: string) {
    const post = await this.findPostById(id);
    return post.populate('author', 'name email role');
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    role: Role,
  ) {
    const post = await this.findPostById(id);
    this.ensureCanModify(post, userId, role);

    Object.assign(post, updatePostDto);
    await post.save();
    return post.populate('author', 'name email role');
  }

  async remove(id: string, userId: string, role: Role) {
    const post = await this.findPostById(id);
    this.ensureCanModify(post, userId, role);

    await post.deleteOne();
    await this.userModel.findByIdAndUpdate(post.author, {
      $pull: { posts: post._id },
    });

    return { message: 'Post deleted successfully' };
  }

  private async findPostById(id: string): Promise<PostDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Post not found');
    }

    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  private ensureCanModify(post: PostDocument, userId: string, role: Role) {
    const isOwner = post.author.equals(new Types.ObjectId(userId));
    if (!isOwner && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only modify your own posts');
    }
  }
}
