import React from "react";
import "./header.scss";
import { Avatar, Input, Tooltip } from "antd";
import {
  BellOutlined,
  GlobalOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useGlobalContext } from "../../context/global-context";

export function Header() {
  const { myProfile } = useGlobalContext();
  return (
    <div className="header">
      <div className="header-left">
        <span>Gradual Community</span>
      </div>
      <div className="header-right">
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          className="header-input"
        />
        <div className="header-time">
          <GlobalOutlined className="global" />
          UTC -{moment.utc().format("hh:mm")}
        </div>
        <BellOutlined className="bell" />
        <QuestionCircleOutlined className="questionCircle" />
        <Tooltip placement="bottom" title={myProfile?.name}>
          <Avatar
            className="avatar"
            size={32}
            icon={<UserOutlined />}
            src={myProfile?.avatar || null}
          />
        </Tooltip>
      </div>
    </div>
  );
}
