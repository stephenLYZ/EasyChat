import { Body, Controller, Inject, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessagesGateway } from 'src/messages/messages.gateway';
import { Message } from 'src/messages/messages.schema';
import { User } from 'src/user/user.schema';
import { Conversation } from './conversation.schema';

@Controller('api/conversations')
export class ConversationsController {
  constructor(
    @InjectModel(Conversation.name) private readonly model: Model<Conversation>,
    @InjectModel(Message.name) private readonly messagesModel: Model<Message>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(MessagesGateway) private messageGateway: MessagesGateway,
  ) {}

  @Post('create')
  async createConversation(
    @Body()
    data: {
      type: string;
      userIds: string[];
    },
  ) {
    const users = [];
    for await (const user of data.userIds) {
      const userData = await this.userModel.findOne({ _id: user }).exec();
      users.push(userData);
    }
    let conversation = await this.model.findOne({ users });
    if (!conversation) {
      console.log(users);
      conversation = await this.model.create({
        type: data.type,
      });
      for await (const user of data.userIds) {
        const userData = await this.userModel.findOne({ _id: user }).exec();
        conversation.users.push(userData);
        userData.conversations.unshift(conversation);
        await conversation.save();
        await userData.save();
      }
    }
    this.messageGateway.server.emit('updateConversationList', {
      ...conversation.toJSON(),
      users,
    });
    return {
      code: 0,
      data: conversation,
    };
  }

  @Post('getMessages')
  async getMessages(@Body() { conversationID }: { conversationID: string }) {
    const conversation = await this.model.findOne({ _id: conversationID });
    if (!conversation) {
      throw Error('Conversation is not found');
    }
    const messages = [];
    for await (const message of conversation.messages) {
      const messageData = await this.messagesModel.findOne({
        _id: message._id,
      });
      const user = await this.userModel.findOne({
        _id: messageData.sender._id,
      });
      messages.push({
        _id: messageData._id,
        conversationID: messageData.conversationID,
        conversationType: messageData.conversationType,
        payload: messageData.payload,
        time: messageData.time,
        type: messageData.type,
        sender: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
        },
        replyMessageID: messageData.replyMessageID,
      });
    }
    return {
      code: 0,
      data: messages,
    };
  }
}
