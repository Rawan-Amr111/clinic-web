import React, { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import classes from "./SwapRequests.module.css";

type SwapRequest = {
  id: number;
  text: string;
  time: string;
};

const initialRequests: SwapRequest[] = [
  {
    id: 1,
    text: "#18 requests #15",
    time: "5m ago",
  },
  {
    id: 2,
    text: "#22 requests #20",
    time: "12m ago",
  },
];

const SwapRequests: React.FC = () => {
  const [requests, setRequests] = useState(initialRequests);

  const removeRequest = (id: number) => {
    setRequests((currentRequests) =>
      currentRequests.filter((request) => request.id !== id),
    );
  };

  return (
    <section className={classes.card}>
      <header className={classes.header}>
        <div className={classes.title}>
          <ArrowLeftRight size={20} strokeWidth={2.4} />
          <h2>Swap Requests</h2>
        </div>

        <span className={classes.newBadge}>{requests.length} NEW</span>
      </header>

      <div className={classes.requests}>
        {requests.length === 0 ? (
          <p className={classes.emptyState}>No pending swap requests.</p>
        ) : (
          requests.map((request) => (
            <article className={classes.request} key={request.id}>
              <div className={classes.requestInfo}>
                <strong>{request.text}</strong>
                <time>{request.time}</time>
              </div>

              <div className={classes.actions}>
                <button
                  type="button"
                  className={classes.approve}
                  onClick={() => removeRequest(request.id)}
                >
                  Approve
                </button>

                <button
                  type="button"
                  className={classes.deny}
                  onClick={() => removeRequest(request.id)}
                >
                  Deny
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default SwapRequests;