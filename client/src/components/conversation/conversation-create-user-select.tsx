import { PlusOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { createConversation } from "../../api/data-provider";
import { useGlobalContext } from "../../context/global-context";
import { Conversation, ConversationType, Profile } from "../../types";

export interface IConversationCreateUserSelectProps {
  isCreateGroup: boolean;
  setIsCreateGroup: React.Dispatch<React.SetStateAction<boolean>>;
  setConversationCreated: React.Dispatch<React.SetStateAction<boolean>>;
  setConversationList: React.Dispatch<React.SetStateAction<Conversation[]>>;
  userList: Profile[];
}

export function ConversationCreateUserSelect({
  isCreateGroup,
  setIsCreateGroup,
  setConversationCreated,
  setConversationList,
  userList,
}: IConversationCreateUserSelectProps) {
  const { myProfile, setActiveConversation } = useGlobalContext();
  const handleCreateConversation = async (user: Profile) => {
    if (!myProfile) return;
    const res = await createConversation({
      type: ConversationType.User,
      userIds: [myProfile._id, user._id],
    });
    if (res.data.code === 0) {
      setActiveConversation(res.data.data);
      setConversationCreated(false);
    }
  };

  return (
    <div className="conversation-create-user-select">
      {/* <Button className="create-group-btn" icon={<PlusOutlined />}>
        Create Group
      </Button> */}
      <div className="user-container">
        {userList.map((user, key) => (
          <label
            role="presentation"
            htmlFor={`userChecked-${key}-${user._id}`}
            key={user._id}
            onClick={() => handleCreateConversation(user)}
          >
            <Avatar size={40} src={user.avatar} />
            <div className="user-name">{user.name}</div>
            {/* {isCreateGroup && (
                      <input
                        onChange={(e) => {
                          userSelectListChange(e, profile, userCheckedList.current.get(userID));
                        }}
                        type="checkbox"
                        ref={(dom) => {
                          getUserChecked(userID, dom);
                        }}
                        id={`userChecked-${key}-${userID}`}
                        className="tui-user-checkbox"
                      />
                    )} */}
          </label>
        ))}
      </div>
    </div>
  );
}
