import {
  BulbFilled,
  ContactsFilled,
  GithubFilled,
  LikeFilled,
  WechatFilled,
} from "@ant-design/icons";
import { Avatar, Menu } from "antd";
import react from "react";
import { Link, useLocation } from "react-router-dom";
import "./sider.scss";

const { ItemGroup, Item, Divider } = Menu;

export function Sider() {
  const location = useLocation();
  return (
    <div className="sider">
      <Menu theme="dark" defaultSelectedKeys={[location.pathname.substring(4)]}>
        <ItemGroup title="Engage">
          <Item key="/forum">
            <Link to="/app/forum">
              <Avatar
                icon={<BulbFilled />}
                size={40}
                className="avatar"
              ></Avatar>{" "}
              Forum
            </Link>
          </Item>
          <Item key="/chat">
            <Link to="/app/chat">
              <Avatar
                icon={<WechatFilled />}
                size={40}
                className="avatar"
              ></Avatar>
              Chat
            </Link>
          </Item>
          <Item key="/matches">
            <Link to="/app/matches">
              <Avatar
                icon={<LikeFilled />}
                size={40}
                className="avatar"
              ></Avatar>
              Matches
            </Link>
          </Item>
        </ItemGroup>
        <Divider />
        <ItemGroup title="People">
          <Item key="/members">
            <Link to="/app/members">
              <Avatar
                icon={<ContactsFilled />}
                size={40}
                className="avatar"
              ></Avatar>
              Members
            </Link>
          </Item>
          <Item key="/contributors">
            <Link to="/app/contributors">
              <Avatar
                icon={<GithubFilled />}
                size={40}
                className="avatar"
              ></Avatar>
              Contributors
            </Link>
          </Item>
        </ItemGroup>
      </Menu>
    </div>
  );
}
