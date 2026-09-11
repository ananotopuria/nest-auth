import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PostStatus } from '../enums/post-status.enum';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(120)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content!: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;
}
