import { Avatar, Badge } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../context/global-context";
import { Conversation } from "../../types";
import {
  getDisplayImage,
  getDisplayTitle,
  getDisplayMessage,
  getDisplayTime,
} from "./utils";

interface IConversationItemProps {
  conversation: Conversation;
}

export function ConversationItem({ conversation }: IConversationItemProps) {
  const { activeConversation, setActiveConversation, myProfile } =
    useGlobalContext();
  const [displayImage, setDisplayImage] = useState(
    getDisplayImage(conversation)
  );
  const [displayTitle, setDisplayTitle] = useState(
    getDisplayTitle(conversation)
  );
  const [displayMessage, setDisplayMessage] = useState(
    getDisplayMessage(conversation, myProfile)
  );
  const [displayTime, setDisplayTime] = useState(getDisplayTime(conversation));
  const [unread, setUnread] = useState(conversation.unreadCount);
  const isActive = activeConversation?._id === conversation?._id;

  useEffect(() => {
    setDisplayTitle(getDisplayTitle(conversation));
    setDisplayMessage(getDisplayMessage(conversation, myProfile));
    setDisplayImage(getDisplayImage(conversation));
    setDisplayTime(getDisplayTime(conversation));
    setUnread(conversation.unreadCount);
  }, [JSON.stringify(conversation), myProfile]);

  const conversationItemButton = useRef<HTMLButtonElement | null>(null);

  const handleSelectConversation = () => {
    if (setActiveConversation) {
      setActiveConversation(conversation);
    }
    if (conversationItemButton?.current) {
      conversationItemButton.current.blur();
    }
  };

  const activeClass = isActive ? "conversation-item-active" : "";
  return (
    <button
      type="button"
      aria-selected={isActive}
      role="option"
      className={`conversation-item ${activeClass}`}
      onClick={handleSelectConversation}
      ref={conversationItemButton}
    >
      <Badge className="avatar" size="small" overflowCount={99} count={unread}>
        <Avatar src={displayImage} size={40} />
      </Badge>
      <div className="content">
        <div className="title">
          {displayTitle}
          <div className="time">{displayTime}</div>
        </div>
        <div className="last-message">{displayMessage}</div>
      </div>
    </button>
  );
}
