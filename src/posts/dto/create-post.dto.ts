import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'Getting started with NestJS',
    minLength: 3,
    maxLength: 120,
  })
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @ApiProperty({
    example: 'This post explains how to build an authenticated NestJS API.',
    minLength: 10,
  })
  content!: string;

  @IsOptional()
  @IsEnum(PostStatus)
  @ApiPropertyOptional({ enum: PostStatus, example: PostStatus.DRAFT })
  status?: PostStatus;
}
