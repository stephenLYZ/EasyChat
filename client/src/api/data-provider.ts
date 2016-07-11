import axios from "axios";
import { config } from "../config";
import { Conversation, ConversationType, Message, Profile } from "../types";
import { getToken } from "../utils";

let instance = axios.create({
  timeout: 7000,
  baseURL: config.apiUrl,
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    Promise.reject(err);
  }
);

export const createUser = async (
  name: string,
  avatar: string
): Promise<{
  data: { code: number; data: { token: string; user: Profile } };
}> => {
  return instance.post("/user/create", {
    name,
    avatar,
  });
};

export const getUser = async (
  name: string
): Promise<{ data: { code: number; data: { user: Profile } } }> => {
  return instance.post("/user/getUser", {
    name,
  });
};

export const getUserList = async (): Promise<{
  data: {
    code: number;
    data: Profile[];
  };
}> => {
  return instance.post("/user/getUserList");
};

export const createConversation = async ({
  type,
  userIds,
}: {
  type: ConversationType;
  userIds: string[];
}): Promise<{
  data: {
    code: number;
    data: any;
  };
}> => {
  return instance.post("/conversations/create", { type, userIds });
};

export const getConversationList = async (
  userID: string
): Promise<{
  data: {
    code: number;
    data: Conversation[];
  };
}> => {
  return instance.post("/user/getConversations", { userID });
};

export const getMessages = async (
  conversationID: string
): Promise<{ data: { code: number; data: Message[] } }> => {
  return instance.post("/conversations/getMessages", { conversationID });
};
