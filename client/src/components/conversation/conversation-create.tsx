import { LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useLayoutEffect, useState } from "react";
import { getUserList } from "../../api/data-provider";
import { useGlobalContext } from "../../context/global-context";
import { Conversation, Profile } from "../../types";
import { ConversationCreateUserSelect } from "./conversation-create-user-select";

export interface IConversationCreateProps {
  setConversationCreated: React.Dispatch<React.SetStateAction<boolean>>;
  setConversationList: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

export enum PageStateTypes {
  USER_SELECT = "UserSelect",
  GROUP_SELECT = "GroupSelect",
  GROUP_CREATE = "GroupCreate",
}

export function ConversationCreate({
  setConversationCreated,
  setConversationList,
}: IConversationCreateProps) {
  const { myProfile } = useGlobalContext();
  const [pageState, setPageState] = useState<PageStateTypes>(
    PageStateTypes.USER_SELECT
  );
  const [selectList, setSelectList] = useState([]);
  const [userList, setUserList] = useState<Profile[]>([]);
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const back = () => {
    if (isCreateGroup) {
      switch (pageState) {
        case PageStateTypes.USER_SELECT:
          setIsCreateGroup(false);
          break;
        case PageStateTypes.GROUP_SELECT:
          setPageState(PageStateTypes.USER_SELECT);
          setSelectList([]);
          break;
        case PageStateTypes.GROUP_CREATE:
          setPageState(PageStateTypes.GROUP_SELECT);
          break;
        default:
      }
    } else {
      setConversationCreated(false);
    }
  };

  useLayoutEffect(() => {
    const handleUserList = async () => {
      const res = await getUserList();
      if (res.data.code === 0) {
        setUserList(
          res.data.data.filter((user) => user._id !== myProfile?._id)
        );
      }
    };
    handleUserList();
  }, []);

  return (
    <div className="conversation-create">
      <div className="conversation-header">
        <Button
          icon={<LeftOutlined />}
          className="conversation-back-btn"
          onClick={back}
        />
        <p>{!isCreateGroup ? "New Chat" : "Add User"}</p>
      </div>
      <ConversationCreateUserSelect
        isCreateGroup={isCreateGroup}
        setConversationList={setConversationList}
        setConversationCreated={setConversationCreated}
        setIsCreateGroup={setIsCreateGroup}
        userList={userList}
      />
    </div>
  );
}
