import { Message, MessageType } from "../../types";
import { MessageText } from "./message-text";

const components = {
  [MessageType.Text]: MessageText,
};

export function MessageElement({ message }: { message: Message }) {
  const Elements: any = components[message.type];
  return <Elements message={message} />;
}
