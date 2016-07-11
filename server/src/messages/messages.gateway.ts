import { InjectModel } from '@nestjs/mongoose';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ObjectID } from 'bson';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { Conversation } from 'src/conversations/conversation.schema';
import { User } from 'src/user/user.schema';
import { Message } from './messages.schema';

@WebSocketGateway({ cors: '*:*', namespace: '/chat' })
export class MessagesGateway {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Message.name) private readonly messagesModel: Model<Message>,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  async join(client: Socket, conversationID: string) {
    client.join(conversationID);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, message: Message) {
    const user = await this.userModel
      .findOne({ _id: message.sender._id })
      .exec();
    delete message._id;
    console.log(message);
    const messageData = await this.messagesModel.create({
      type: message.type,
      payload: message.payload,
      time: message.time,
      conversationID: message.conversationID,
      conversationType: message.conversationType,
      sender: user,
      replyMessageID: message.replyMessageID,
    });
    const conversation = await this.conversationModel.findById(
      message.conversationID,
    );
    if (conversation) {
      conversation.messages.push(messageData);
      await conversation.save();
    }
    console.log(messageData);
    this.server.in(message.conversationID).emit('receiveMessage', messageData);
  }
}
