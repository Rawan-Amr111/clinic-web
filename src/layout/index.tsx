import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/sidebar/Sidebar";
import classes from "./index.module.css";
import { Navbar } from "./components/navbar/Navbar";

const Layout = () => {
  return (
    <div className={classes.layout}>
      <Sidebar />

      <div className={classes.pageContainer}>
        <Navbar />

        <main className={classes.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
