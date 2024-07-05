import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt'

import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/input/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';

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

  async findAll( roles?: ValidRoles[] ): Promise<User[]> {

    if ( roles.length === 0 ) 
      return this.usersRepository.find({
        // TODO: No es necesario porque se tiene lazy en la propiedad lastUpdatuBy en la entity
        // relations: {
        //   lastUpdateBy: true
        // }
      }
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

  async update(id: string, updateUserInput: UpdateUserInput, admin: User): Promise<User> {
    
    try {
      
      const user = await this.findOneById(id)

      user.lastUpdateBy = admin;
      user.email = updateUserInput?.email ? updateUserInput.email : user.email; 
      user.fullName = updateUserInput?.fullName? updateUserInput.fullName : user.fullName;
      user.roles = updateUserInput?.roles? updateUserInput.roles : user.roles;  // TODO: Validar que solo administradores puedan modificar roles
      user.isActive = updateUserInput?.isActive? updateUserInput.isActive : user.isActive;  // TODO: Validar que solo administradores puedan desactivar usuarios

      return await this.usersRepository.save(user);
      

    } catch (error) {
     console.log(error) 
    }
  }

  async block(id: string, admin:User): Promise<User> {
    
    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = admin;
    
    return await this.usersRepository.save(userToBlock);

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
