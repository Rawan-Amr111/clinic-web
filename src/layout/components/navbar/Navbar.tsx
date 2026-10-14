import { UserOutlined } from "@ant-design/icons";
import { Avatar, message } from "antd";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/connect";

import classes from "./index.module.css";

export const Navbar = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      message.error("Could not sign out. Please try again.");
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <header className={classes.navbar}>
      <div className={classes.actions}>
        <Avatar className={classes.avatar} icon={<UserOutlined />} />
        <button type="button" className={classes.signOut} onClick={handleSignOut} aria-label="Sign out" title="Sign out">
          <LogOut size={17} />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
};
