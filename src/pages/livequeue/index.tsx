import React from "react";
import QueueHeader from "./components/queueheader/QueueHeader";
import QueueList from "./components/queuelist/QueueList";
import classes from "./index.module.css";
import SwapRequests from "./components/swaprequests/SwapRequests";

const LiveQueuePage: React.FC = () => {
  return (
    <main className={classes.container}>
      <QueueHeader />

      <div className={classes.pageContent}>
        <section className={classes.queueSection}>
          <QueueList />
        </section>

        <aside className={classes.sideContent}>
          <SwapRequests />
        </aside>
      </div>
    </main>
  );
};

export default LiveQueuePage;
