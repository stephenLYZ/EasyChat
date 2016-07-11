import { MessageOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useLayoutEffect, useState } from "react";
import { Message } from "../../types";
import { MessageElement } from "./message-element";

export function MessageBubble({
  message,
  messageList,
  onSetReplyMessage,
}: {
  message: Message;
  messageList: Message[];
  onSetReplyMessage: (message: Message) => void;
}) {
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useLayoutEffect(() => {
    const handleReplyMessage = async () => {
      const replayData = messageList.filter(
        (item) => item._id === message.replyMessageID
      );
      setReplyMessage(replayData[0]);
    };
    handleReplyMessage();
  }, [message, messageList]);

  const handleMouseEnter = () => {
    setShowMoreMenu(true);
  };
  const handleMouseLeave = () => {
    setShowMoreMenu(false);
  };
  return (
    <div className="message-bubble">
      <div
        className={`message-bubble-context ${message?.flow}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`message-context`}>
          <MessageElement message={message} />
        </div>
        {showMoreMenu && (
          <div className="message-more-menu">
            <Button icon={<MessageOutlined />} onClick={() => onSetReplyMessage(message)} />
          </div>
        )}
      </div>
      {replyMessage && (
        <div className={`message-bubble-reply ${message?.flow}`}>
          <header className="title">{replyMessage.sender.name}:</header>
          <MessageElement message={replyMessage} />
        </div>
      )}
    </div>
  );
}
