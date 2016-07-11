import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Layout } from "antd";
import io from "socket.io-client";
import "./App.scss";
import { Header } from "../header";
import { Sider } from "../sider";
import { Outlet, useNavigate } from "react-router-dom";
import { GlobalContextProvider } from "../../context/global-context";
import { Conversation } from "../../types";
import { config } from "../../config";
import { getMyProfile } from "../../utils";
import { getUser } from "../../api/data-provider";

const socket = io(config.socketUrl);

export function App() {
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation>();
  const myProfile = JSON.parse(getMyProfile() || "{}");

  useLayoutEffect(() => {
    if (!Object.keys(myProfile).length) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const handleMyProfile = async () => {
      try {
        const res = await getUser(myProfile.name);
        if (res.data.code !== 0) {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    };
    handleMyProfile();
  }, []);

  const setActiveConversation = useCallback((conversation?: Conversation) => {
    setConversation(conversation);
  }, []);

  const globalContextValue = useMemo(
    () => ({
      socket,
      activeConversation: conversation,
      setActiveConversation,
      myProfile,
    }),
    [conversation, setActiveConversation]
  );

  return (
    <GlobalContextProvider value={globalContextValue}>
      <Layout>
        <Layout.Header className="app-header">
          <Header />
        </Layout.Header>
        <Layout className="app-main">
          <Layout.Sider theme="dark">
            <Sider />
          </Layout.Sider>
          <Layout.Content className="app-content">
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
    </GlobalContextProvider>
  );
}
