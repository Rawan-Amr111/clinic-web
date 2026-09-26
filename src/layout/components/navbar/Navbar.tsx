import {
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";

import classes from "./index.module.css";

export const Navbar = () => {
  return (
    <header className={classes.navbar}>
      <div className={classes.actions}>
        <button className={classes.iconButton} type="button">
          <BellOutlined />
        </button>
        <Avatar className={classes.avatar} icon={<UserOutlined />} />
      </div>
    </header>
  );
};
