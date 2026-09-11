import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Missing, invalid or expired JWT bearer token',
})
@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Post created with populated author' })
  @ApiBadRequestResponse({ description: 'Request body failed validation' })
  create(@Body() dto: CreatePostDto, @CurrentUser('sub') userId: string) {
    return this.postsService.create(dto, userId);
  }

  @Get()
  @ApiOkResponse({ description: 'List posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiOkResponse({ description: 'Get post' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiForbiddenResponse({
    description: 'Only the owner or an administrator can modify this post',
  })
  @ApiBadRequestResponse({ description: 'Request body failed validation' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiOkResponse({ description: 'Update post' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.postsService.update(id, dto, user.sub, user.role);
  }

  @Delete(':id')
  @ApiForbiddenResponse({
    description: 'Only the owner or an administrator can modify this post',
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiOkResponse({ description: 'Post deleted successfully' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.postsService.remove(id, user.sub, user.role);
  }
}
