import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {
        this.isProd = configService.get('STATE') === 'prod'
    }

    async executeSeed () {

        if(this.isProd) {
            throw new UnauthorizedException('We cannot run SEED on Prod')
        }

        //Limpiar la base de datos (borrar)
        await this.deleteRegisters()

        //Crear usuarios


        //Crear items

        return true
    }

    async deleteRegisters() {

        //borrar items
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute()
            
        //borrar usuarios
        await this.usersRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute()
    }
}
