export enum ConversationType {
  User = "User",
  Group = "Group",
}

export interface Conversation {
  _id: string;
  type: ConversationType;
  unreadCount?: number;
  lastMessage: any;
  groupProfile?: Group;
  userProfile?: Profile;
  messages?: Message[];
}

export interface Profile {
  _id: string;
  name: string;
  avatar: string;
}

export interface Group {
  _id: string;
  name: string;
  avatar: string;
  memberCount: number;
}

export enum MessageType {
  Text = "Text",
}

export interface Message {
  _id: string;
  type: MessageType;
  payload: any;
  conversationID: string;
  conversationType: ConversationType;
  time: number;
  flow: string;
  sender: Profile;
  replyMessageID?: string;
}

export enum FlowType {
  in = "in",
  out = "out",
}
