import { faker } from '@faker-js/faker';
import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function seedUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const usersService = app.get(UsersService);
    const hashedPassword = await bcrypt.hash('Password123', 10);

    let createdUsersCount = 0;

    while (createdUsersCount < 10) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const email = faker.internet
        .email({
          firstName,
          lastName,
        })
        .toLowerCase();

      const existingUser = await usersService.findByEmail(email);

      if (existingUser) {
        continue;
      }

      await usersService.create({
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
      });

      createdUsersCount++;
    }

    console.log(`${createdUsersCount} fake users created successfully`);
  } catch (error) {
    console.error('Failed to seed users', error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

void seedUsers();
