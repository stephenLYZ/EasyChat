import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectID } from 'bson';
import { User } from 'src/user/user.schema';

@Schema()
export class Message {
  _id: ObjectID | string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: Types.Map })
  payload: object;

  @Prop({ required: true })
  time: number;

  @Prop({ required: true })
  conversationID: string;

  @Prop({ required: true })
  conversationType: string;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  sender: User;

  @Prop()
  replyMessageID?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
