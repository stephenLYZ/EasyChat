import { UsergroupAddOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import react, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { getMessages } from "../../api/data-provider";
import { useGlobalContext } from "../../context/global-context";
import { MessageModel } from "../../model/message";
import {
  ConversationType,
  Message as IMessage,
  MessageType,
} from "../../types";
import { getTimeStamp } from "../conversation/utils";
import { InfiniteScroll } from "../infinite-scroll";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { MessageInputQuote } from "./message-input-quote";
import "./message.scss";

export function Message() {
  const { socket, activeConversation, myProfile } = useGlobalContext();
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const [ulElement, setUlElement] = useState<HTMLUListElement | null>(null);

  useLayoutEffect(() => {
    const handleMessageList = async () => {
      if (activeConversation) {
        const res = await getMessages(activeConversation._id);
        if (res.data.code === 0) {
          setMessageList(
            res.data.data.map((message) => {
              const flow = message.sender._id === myProfile?._id ? "out" : "in";
              const newMessage = { ...message, flow };
              return newMessage;
            })
          );
        }
      }
    };
    handleMessageList();
  }, [activeConversation, myProfile?._id]);

  useLayoutEffect(() => {
    const handleMessageRecevied = (message: IMessage) => {
      const copyMessageList = messageList.slice();
      const flow = message.sender._id === myProfile?._id ? "out" : "in";
      const newMessage = { ...message, flow };
      const index = messageList.findIndex((m) => m.time === newMessage.time);
      if (index > -1) {
        copyMessageList.splice(index, 1, newMessage);
      } else {
        copyMessageList.push(newMessage);
      }
      setMessageList(copyMessageList);
    };
    socket.on("receiveMessage", handleMessageRecevied);
    return () => socket.off("receiveMessage", handleMessageRecevied);
  }, [messageList, myProfile?._id, socket]);

  const loadMore = async () => {};

  const getTitle = () => {
    switch (activeConversation?.type) {
      case ConversationType.User:
        return (
          activeConversation.userProfile?.name ||
          activeConversation.userProfile?._id
        );
      case ConversationType.Group:
        return (
          activeConversation.groupProfile?.name ||
          activeConversation.groupProfile?._id
        );
      default:
        return "";
    }
  };

  const handleSubmit = async (value: string) => {
    const textMessage = new MessageModel({
      type: MessageType.Text,
      payload: {
        text: value,
      },
      conversationID: activeConversation?._id,
      conversationType: activeConversation?.type,
      flow: "out",
      sender: myProfile!,
      replyMessageID: replyMessage?._id,
    });
    setMessageList((list) => [...list, textMessage]);
    setReplyMessage(null);
    socket.emit("sendMessage", textMessage);
  };

  const messageListElements = useMemo(
    () =>
      messageList.map((item, index) => {
        const key = `${JSON.stringify(item)}${index}`;
        const preMessageTimer = index > 0 ? messageList[index - 1]?.time : -1;
        const currrentTimer = item?.time || 0;
        const isShowIntervalsTimer =
          preMessageTimer !== -1
            ? currrentTimer - preMessageTimer >= 1800000
            : false;
        return (
          <>
            {isShowIntervalsTimer && (
              <div
                className="message-list-time"
                key={`${currrentTimer + index}`}
              >
                {currrentTimer ? getTimeStamp(currrentTimer) : 0}
              </div>
            )}
            <li className="message-list-item" key={key}>
              <div
                className={`${item?.flow}`}
                key={item?._id}
                data-message-id={item?._id}
              >
                <Avatar
                  src={
                    item?.sender.avatar || "https://joeschmoe.io/api/v1/random"
                  }
                  size={40}
                />
                <div className="content">
                  <div className="title">
                    <div className="name">{item?.sender.name}</div>
                    <div className="time">
                      {item?.time ? getTimeStamp(item.time) : 0}
                    </div>
                  </div>
                  <MessageBubble
                    message={item}
                    messageList={messageList}
                    onSetReplyMessage={setReplyMessage}
                  />
                </div>
              </div>
            </li>
          </>
        );
      }),
    [messageList]
  );

  useEffect(() => {
    if (ulElement?.children) {
      const HTMLCollection = ulElement?.children || [];
      const element = HTMLCollection[HTMLCollection.length - 1];
      const timer = setTimeout(() => {
        element?.scrollIntoView({ block: "end" });
        clearTimeout(timer);
      }, 100);
    }
  }, [messageListElements]);

  return (
    <div className="message">
      {activeConversation ? (
        <>
          <div className="message-header">
            <div className="message-header-title">{getTitle()}</div>
            {activeConversation?.type === ConversationType.Group && (
              <Button
                className="message-header-member-count"
                icon={<UsergroupAddOutlined />}
              >
                {activeConversation.groupProfile?.memberCount}
              </Button>
            )}
          </div>
          <div className="message-list">
            <InfiniteScroll
              className="message-list-infinite-scroll"
              hasMore
              loadMore={loadMore}
              threshold={1}
            >
              <ul ref={setUlElement}>
                {messageListElements?.length > 0 ? messageListElements : null}
              </ul>
            </InfiniteScroll>
          </div>
          <div className="message-input">
            <MessageInput onSubmit={handleSubmit} />
            <MessageInputQuote
              replyMessage={replyMessage}
              onClose={() => setReplyMessage(null)}
            />
          </div>
        </>
      ) : (
        <div className="welcome">
          <h3>Welcome to EasyChat!</h3>
          <p>You can start a one-to-one chat or group chat. Let's chat!</p>
        </div>
      )}
    </div>
  );
}
