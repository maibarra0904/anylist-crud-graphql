import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity({name: 'items'})
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('identity')
  @Field( () => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  quantity: number;

  @Column()
  @Field()
  quantityUnits: string;

}
