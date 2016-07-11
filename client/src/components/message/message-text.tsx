import { Message } from "../../types";

export function MessageText({ message }: { message: Message }) {
  return <div className="message-text">{message.payload?.text}</div>;
}
