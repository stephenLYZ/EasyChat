import react, { useLayoutEffect, useState } from "react";
import "./conversation.scss";
import { Button, Input } from "antd";
import { PlusSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { Conversation as IConversation, Profile } from "../../types";
import { ConversationItem } from "./conversation-item";
import { getConversationList } from "../../api/data-provider";
import { ConversationCreate } from "./conversation-create";
import { useGlobalContext } from "../../context/global-context";

export function Conversation() {
  const { socket, myProfile } = useGlobalContext();
  const [conversationList, setConversationList] = useState<IConversation[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(conversationList);
  const [conversationCreated, setConversationCreated] = useState(false);

  useLayoutEffect(() => {
    const handleConversationList = async () => {
      const res = await getConversationList(myProfile!._id);
      if (res.data.code === 0) {
        setConversationList(res.data.data);
        res.data.data.forEach((conversation) => {
          socket.emit("join", conversation._id);
        });
      }
    };
    handleConversationList();
  }, [myProfile, socket]);

  useLayoutEffect(() => {
    const handleUpdateConversationList = (
      data: IConversation & { users: Profile[] }
    ) => {
      const user = data.users.find((user) => user._id === myProfile?._id);
      if (user) {
        const newConversationList = conversationList.slice();
        const index = conversationList.findIndex((c) => c._id === data._id);
        if (index > -1) {
          const newData = newConversationList.splice(index, 1)[0];
          newConversationList.unshift(newData);
        } else {
          const newData = {
            _id: data._id,
            type: data.type,
            lastMessage: data.lastMessage,
            userProfile: data.users.filter(
              (user) => user._id !== myProfile?._id
            )[0],
            messages: data.messages,
          };
          newConversationList.unshift(newData);
        }
        newConversationList.unshift();
        setConversationList(newConversationList);
      }
    };
    socket.on("updateConversationList", handleUpdateConversationList);
    return () =>
      socket.off("updateConversationList", handleUpdateConversationList);
  }, [conversationList, myProfile?._id, socket]);

  const handleSearchChange = (e: any) => {
    setSearchValue(e.target?.value);
  };

  const renderConversationList = () => (
    <>
      <div className="conversation-header">
        <Input
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search"
          prefix={<SearchOutlined />}
          className="conversation-header-input"
        />
        <Button
          icon={<PlusSquareOutlined />}
          className="conversation-header-btn"
          onClick={() => setConversationCreated(true)}
        />
      </div>

      <div className="conversation-list">
        {conversationList.map((item) => (
          <ConversationItem conversation={item} />
        ))}
      </div>
    </>
  );

  const renderConversationCreate = () => (
    <ConversationCreate
      setConversationCreated={setConversationCreated}
      setConversationList={setConversationList}
    />
  );

  return (
    <div className="conversation">
      {conversationCreated
        ? renderConversationCreate()
        : renderConversationList()}
    </div>
  );
}
