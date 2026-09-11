import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from './enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Missing, invalid or expired JWT bearer token',
})
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ description: 'List users' })
  @Roles(Role.ADMIN)
  @ApiForbiddenResponse({ description: 'Administrator role required' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ description: 'Get user' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBadRequestResponse({ description: 'Request body failed validation' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ description: 'Update user' })
  @Roles(Role.ADMIN)
  @ApiForbiddenResponse({ description: 'Administrator role required' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @Roles(Role.ADMIN)
  @ApiForbiddenResponse({ description: 'Administrator role required' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
