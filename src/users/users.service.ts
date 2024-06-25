import { Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {


  async findAll(): Promise<User[]> {
    return [];
  }

  findOne(id: string): Promise<User> {
    throw new Error( `findOne not implemented for ${id}`)
  }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  block(id: string): Promise<User> {
    throw new Error( `blockUser not implemented for ${id}`)
  }
}
