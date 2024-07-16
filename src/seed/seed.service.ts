import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        private readonly usersService: UsersService,

        private readonly itemsService: ItemsService
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
        const user = await this.loadUsers();

        //Crear items
        await this.loadItems(user);

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

    async loadUsers(): Promise<User> {

        const users = []

        for (const user of SEED_USERS) {
            users.push( await this.usersService.create(user))
        }

        return users[0]
    }

    async loadItems(user:User): Promise<boolean> {

        const items = []

        for (const item of SEED_ITEMS) {
            const itemMod = {...item, quantity:1}
            items.push( await this.itemsService.create(itemMod, user))
        }

        return true
    }
}
