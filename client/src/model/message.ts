import { v4 as uuidv4 } from "uuid";
import {
  ConversationType,
  Message as IMessage,
  MessageType,
  Profile,
} from "../types";

export interface MessageOptions {
  type: MessageType;
  payload: any;
  conversationID?: string;
  conversationType?: ConversationType;
  time?: number;
  flow?: string;
  sender: Profile;
  replyMessageID?: string;
}

export class MessageModel implements IMessage {
  _id: string;
  type: MessageType;
  payload: any;
  conversationID: string;
  conversationType: ConversationType;
  time: number;
  flow: string;
  sender: Profile;
  replyMessageID: string;
  constructor(options: MessageOptions) {
    this._id = uuidv4();
    this.type = options.type || MessageType.Text;
    this.payload = options.payload || {};
    this.conversationID = options.conversationID || "";
    this.conversationType = options.conversationType || ConversationType.User;
    this.time = options.time || Date.now();
    this.flow = options.flow || "";
    this.sender = options.sender;
    this.replyMessageID = options.replyMessageID || "";
  }
}
