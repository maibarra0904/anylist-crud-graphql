import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt'

import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/input/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {

  private logger: Logger = new Logger('UsersService')

  constructor(

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){}

  async create (signupInput: SignupInput): Promise<User> {

    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync( signupInput.password, 10)
      });
      return await this.usersRepository.save(newUser)

    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async findAll( roles: ValidRoles[] ): Promise<User[]> {

    if ( roles.length === 0 ) 
      return this.usersRepository.find(//{
        // TODO: No es necesario porque tenemos lazy la propiedad lastUpdateBy
        // relations: {
        //   lastUpdateBy: true
        // }
      //}
    );

      console.log(roles)

    // ??? tenemos roles ['admin','superUser']
    return this.usersRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles )
      .getMany();

  
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({email})
    } catch (error) {
      this.handleDBErrors( {
        code: 'error-001',
        detail: 'Usuario No encontrado'
      })
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({id})
    } catch (error) {
      this.handleDBErrors( {
        code: 'error-001',
        detail: 'Usuario No encontrado'
      })
    }
  }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  block(id: string): Promise<User> {
    throw new Error( `blockUser not implemented for ${id}`)
  }

  private handleDBErrors (error: any) : never {

    this.logger.error(error)

    if( error.code = '23505') {
      throw new BadRequestException(error.detail.replace('Key ',''))
    }

    if( error.code = 'error-001') {
      throw new BadRequestException(error.detail.replace('Key ',''))
    }

    

    throw new InternalServerErrorException('Please check server logs')
  }
}
