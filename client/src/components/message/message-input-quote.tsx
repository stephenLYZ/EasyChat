import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Message } from "../../types";
import { MessageElement } from "./message-element";

export function MessageInputQuote({
  replyMessage,
  onClose,
}: {
  replyMessage: Message | null;
  onClose: () => void;
}) {
  if (!replyMessage) return null;
  return (
    <div className="message-input-quote">
      <div className="message-input-quote-main">
        <header className="title">{replyMessage.sender.name}:</header>
        <MessageElement message={replyMessage} />
      </div>
      <Button
        className="message-input-quote-close"
        icon={<CloseCircleOutlined />}
        onClick={onClose}
      />
    </div>
  );
}
