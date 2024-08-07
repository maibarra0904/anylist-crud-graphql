import { InputType,  Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional,IsString, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {

  @Field( () => Number, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @Field( () => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @Field( () => ID )
  @IsString() //@IsUUID()
  listId: string;

  @Field( () => ID )
  @IsString()
  itemId: string;


}
