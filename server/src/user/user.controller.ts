import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model, ObjectId } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { Conversation } from 'src/conversations/conversation.schema';
import { Message } from 'src/messages/messages.schema';

@Controller('api/user')
export class UserController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Message.name) private readonly messagesModel: Model<Message>,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  @Post('create')
  async create(@Body() credentials: { name: string; avatar: string }) {
    let user = await this.userModel.findOne({ name: credentials.name }).exec();
    if (!user) {
      user = await this.userModel.create({
        name: credentials.name,
        avatar: credentials.avatar,
      });
    }

    return {
      code: 0,
      data: {
        user,
        token: sign(
          { _id: user._id, name: user.name },
          process.env.JWT_SECRET_PASSWORD,
          {
            expiresIn: '1d',
            algorithm: 'HS256',
          },
        ),
      },
    };
  }

  @Post('getUser')
  async getUser(@Body() credentials: { name: string }) {
    const user = await this.userModel
      .findOne({ name: credentials.name })
      .exec();
    if (!user) {
      throw new UnauthorizedException('The user is not found.');
    }
    return {
      code: 0,
      data: user,
    };
  }

  @Post('getUserList')
  async getUserList() {
    const users = await this.userModel.find();
    return {
      code: 0,
      data: users,
    };
  }

  @Post('getConversations')
  async getConversations(@Body() credentials: { userID: string }) {
    const user = await this.userModel
      .findOne({ _id: credentials.userID })
      .exec();
    if (!user) {
      throw new UnauthorizedException('The user is not found.');
    }
    const conversations = [];
    for await (const conversation of user.conversations) {
      const data = await this.conversationModel.findOne(conversation);
      const result: any = {
        _id: data._id,
        type: data.type,
      };
      if (data.type === 'User') {
        const friendId = data.users.filter((u) => !u._id.equals(user._id));
        const friendData = await this.userModel.findOne({ _id: friendId });
        result.userProfile = friendData;
      }
      if (data.messages.length) {
        const lastMessage = await this.messagesModel.findOne(
          data.messages[data.messages.length - 1],
        );
        const user = await this.userModel.findOne({ _id: lastMessage.sender });
        result.lastMessage = {
          messageForShow: (lastMessage.payload as any).text,
          name: user.name,
          lastTime: lastMessage.time,
        };
      }
      conversations.push(result);
    }
    return {
      code: 0,
      data: conversations,
    };
  }
}
