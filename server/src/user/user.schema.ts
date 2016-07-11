import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectID } from 'bson';
import { Conversation } from 'src/conversations/conversation.schema';

@Schema()
export class User {
  _id: ObjectID;

  @Prop({
    required: true,
    maxlength: 20,
    minlength: 1,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  avatar: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Conversation' }] })
  conversations?: Conversation[];
}

export const UserSchema = SchemaFactory.createForClass(User);
