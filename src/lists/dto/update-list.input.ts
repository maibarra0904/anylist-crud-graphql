import { CreateListInput } from './create-list.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsString} from 'class-validator';

@InputType()
export class UpdateListInput extends PartialType(CreateListInput) {

  @Field(() => String)
  @IsString() //@IsUUID()
  id: string;

}