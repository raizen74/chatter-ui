import { CreateUserInput } from './create-user.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {  // PartialType extends CreateUserInput to make all fields optional, inherits validation decorators
  // @Field()
  // _id: string;  // This field is required to identify the user being updated
}
