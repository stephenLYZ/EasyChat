import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesGateway } from './messages/messages.gateway';
import { Message, MessageSchema } from './messages/messages.schema';
import {
  Conversation,
  ConversationSchema,
} from './conversations/conversation.schema';
import { User, UserSchema } from './user/user.schema';
import { ConversationsController } from './conversations/conversations.controller';
import { UserController } from './user/user.controller';
import { UserMiddleware } from './user/user.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/easy-chat'),
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AppController, UserController, ConversationsController],
  providers: [AppService, MessagesGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('/api');
  }
}
