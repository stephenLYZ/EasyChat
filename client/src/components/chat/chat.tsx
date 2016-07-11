import react, { useLayoutEffect } from "react";
import "./chat.scss";
import { Conversation } from "../conversation";
import { Message } from "../message";
import { getMyProfile } from "../../utils";
import { useNavigate } from "react-router-dom";

export function Chat() {
  const navigate = useNavigate();
  useLayoutEffect(() => {
    if (!getMyProfile()) {
      navigate("/");
    }
  }, []);

  return (
    <div className="chat">
      <Conversation />
      <Message />
    </div>
  );
}
