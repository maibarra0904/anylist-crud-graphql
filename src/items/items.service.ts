import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';


@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>
  ) { }

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {

    const newItem = this.itemsRepository.create({...createItemInput, user});

    return await this.itemsRepository.save(newItem);



  }

  async findAll(): Promise<Item[]> {
    return this.itemsRepository.find();
  }

  async findOne(id: string): Promise<Item> {

    const item = await this.itemsRepository.findOneBy({ id });


    if (!item) throw new NotFoundException(`Item with id: ${id} not found`)



    return item;


  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {

    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Actualizar las propiedades del item con los valores de updateItemInput
    item.name = updateItemInput?.name ? updateItemInput.name : item.name;
    item.quantity = updateItemInput?.quantity ? updateItemInput.quantity : item.quantity;
    item.quantityUnits = updateItemInput?.quantityUnits ? updateItemInput.quantityUnits : item.quantityUnits;

    // Guardar los cambios en la base de datos
    await this.itemsRepository.save(item);

    return item;

  }

  async remove(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id }); // Cambio "findOneBy" a "findOne"
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await this.itemsRepository.delete({ id });  
  
    return item
  }
  
}
