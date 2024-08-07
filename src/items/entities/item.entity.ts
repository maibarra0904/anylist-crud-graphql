import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ListItem } from '../../list-item/entities/list-item.entity';

@Entity({name: 'items'})
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('increment')
  @Field( () => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field( () => Float, { nullable: true })
  quantity: number;

  @Column({ nullable: true })
  @Field( () => String, { nullable: true } )
  quantityUnits?: string; // g, ml, kg, tsp

  @ManyToOne( () => User, (user) => user.items, {nullable: false, lazy: true })
  @Index('userId-index')
  @Field( () => User )
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Field( () => [ListItem] )
  listItem: ListItem[]

}
