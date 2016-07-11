import {
  format,
  isToday,
  isYesterday,
  formatDistance,
  isThisYear,
  isThisWeek,
} from "date-fns";
import { Conversation, ConversationType, Group, Profile } from "../../types";

export const getDisplayTitle = (
  conversation: Conversation
): string | React.ReactElement => {
  const { name, _id } = getMessageProfile(conversation);
  return name || _id;
};

export const getDisplayImage = (conversation: Conversation) => {
  const { type } = conversation;
  const { avatar } = getMessageProfile(conversation);
  let displayImage = avatar;
  if (!avatar) {
    switch (type) {
      case ConversationType.User:
        displayImage = "https://source.boringavatars.com/";
        break;
      case ConversationType.Group:
        displayImage = "https://source.boringavatars.com/";
        break;
      default:
        displayImage = "https://source.boringavatars.com/";
    }
  }
  return displayImage;
};

export const getDisplayMessage = (
  conversation: Conversation,
  myProfile?: Profile
) => {
  const { lastMessage, type } = conversation;
  if (!lastMessage) return null;
  const { name, fromAccount, messageForShow } = lastMessage;
  let from = "";
  switch (type) {
    case ConversationType.User:
      from = "";
      break;
    case ConversationType.Group:
      from =
        lastMessage?.fromAccount === myProfile?._id
          ? "You: "
          : `${name || fromAccount}: `;
      break;
    default:
  }
  return (
    <div
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      <span>{from}</span>
      <span>{messageForShow}</span>
    </div>
  );
};
interface IProfile extends Profile, Group {}

export const getMessageProfile = (conversation: Conversation): IProfile => {
  let result: any = {};
  const { type, groupProfile, userProfile } = conversation;
  switch (type) {
    case ConversationType.User:
      result = userProfile;
      break;
    case ConversationType.Group:
      result = groupProfile;
      break;
    default:
  }
  return result as IProfile;
};

export const getDisplayTime = (conversation: Conversation) => {
  const { lastMessage } = conversation;
  if (!lastMessage) return;
  return getTimeStamp(lastMessage.lastTime);
};

export const getTimeStamp = (time: number) => {
  if (!time) {
    return "";
  }
  if (!isThisYear(time)) {
    return format(time, "yyyy MMM dd");
  }
  if (isToday(time)) {
    return format(time, "hh:mm");
  }
  if (isYesterday(time)) {
    return formatDistance(time, new Date());
  }
  if (isThisWeek(time)) {
    return format(time, "eeee");
  }
  return format(time, "MMM dd");
};
