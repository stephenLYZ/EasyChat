import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { ObjectID } from 'bson';
import { Message } from 'src/messages/messages.schema';
import { User } from 'src/user/user.schema';

@Schema()
export class Conversation {
  _id: ObjectID;

  @Prop({ required: true })
  type: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }], default: [] })
  messages: Message[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  users: User[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
