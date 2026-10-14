import { useState, type FC } from "react";
import { ArrowLeftRight } from "lucide-react";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLiveQueue } from "../../../../services/liveQueue";
import {
  createQueueSwapRequest,
  getQueueSwapRequests,
  respondToQueueSwapRequest,
} from "../../../../services/queueSwapRequests";
import classes from "./SwapRequests.module.css";

const SwapRequests: FC = () => {
  const queryClient = useQueryClient();
  const [requesterId, setRequesterId] = useState("");
  const [targetId, setTargetId] = useState("");
  const { data: queue = [], isLoading: queueLoading, isError: queueError } = useQuery({
    queryKey: ["live-queue", "all"],
    queryFn: () => getLiveQueue(),
    staleTime: 60_000,
  });
  const { data: requests = [], isLoading, isError } = useQuery({
    queryKey: ["queue-swap-requests"],
    queryFn: getQueueSwapRequests,
  });
  const refresh = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ["queue-swap-requests"] }),
    queryClient.invalidateQueries({ queryKey: ["live-queue"] }),
  ]);
  const createMutation = useMutation({
    mutationFn: () => createQueueSwapRequest(requesterId, targetId),
    onSuccess: () => {
      message.success("Swap request created.");
      setRequesterId("");
      setTargetId("");
      void refresh();
    },
    onError: (error: Error) => message.error(error.message),
  });
  const responseMutation = useMutation({
    mutationFn: ({ id, approve }: { id: string; approve: boolean }) => respondToQueueSwapRequest(id, approve),
    onSuccess: (result) => {
      message.success(result === "Approved" ? "Queue positions swapped." : "Request denied because the queue changed or the request was denied.");
      void refresh();
    },
    onError: (error: Error) => message.error(error.message),
  });

  const waiting = queue.filter((entry) => entry.status === "Waiting");
  const requester = waiting.find((entry) => entry.id === requesterId);
  const possibleTargets = waiting.filter((entry) => entry.id !== requesterId && entry.doctor_id === requester?.doctor_id);
  const pending = requests.filter((request) => request.status === "Pending");

  return (
    <section className={classes.card}>
      <header className={classes.header}>
        <div className={classes.title}><ArrowLeftRight size={20} strokeWidth={2.4} /><h2>Swap Requests</h2></div>
        <span className={classes.newBadge}>{pending.length} NEW</span>
      </header>

      <form className={classes.createForm} onSubmit={(event) => { event.preventDefault(); createMutation.mutate(); }}>
        <p>Request a position swap between two waiting patients in the same doctor queue.</p>
        <label>Patient <select value={requesterId} onChange={(event) => { setRequesterId(event.target.value); setTargetId(""); }} disabled={queueLoading} required>
          <option value="">Choose patient</option>
          {waiting.map((entry) => <option key={entry.id} value={entry.id}>#{entry.queue_number} &middot; {entry.patient_name} &mdash; {entry.doctor_name}</option>)}
        </select></label>
        <label>Swap with <select value={targetId} onChange={(event) => setTargetId(event.target.value)} disabled={!requesterId} required>
          <option value="">Choose patient</option>
          {possibleTargets.map((entry) => <option key={entry.id} value={entry.id}>#{entry.queue_number} &middot; {entry.patient_name}</option>)}
        </select></label>
        <button className={classes.submit} type="submit" disabled={!requesterId || !targetId || createMutation.isPending}>Send request</button>
        {queueError && <p className={classes.error}>Could not load the live queue.</p>}
      </form>

      {isLoading ? <p className={classes.emptyState}>Loading requests...</p> : isError ? <p className={classes.error}>Could not load swap requests. Apply the Supabase migration and try again.</p> : requests.length === 0 ? <p className={classes.emptyState}>No swap requests yet.</p> : (
        <div className={classes.requests}>
          {requests.map((request) => <article className={classes.request} key={request.id}>
            <div className={classes.requestInfo}>
              <div><strong>#{request.requester?.queue_number ?? "-"} {request.requester?.patients?.full_name ?? "Patient"}</strong><span> &harr; </span><strong>#{request.target?.queue_number ?? "-"} {request.target?.patients?.full_name ?? "Patient"}</strong></div>
              <time>{new Date(request.created_at).toLocaleString()}</time>
            </div>
            {request.status === "Pending" ? <div className={classes.actions}>
              <button className={classes.approve} disabled={responseMutation.isPending} onClick={() => responseMutation.mutate({ id: request.id, approve: true })}>Approve swap</button>
              <button className={classes.deny} disabled={responseMutation.isPending} onClick={() => responseMutation.mutate({ id: request.id, approve: false })}>Deny</button>
            </div> : <span className={classes.status}>{request.status}</span>}
          </article>)}
        </div>
      )}
    </section>
  );
};

export default SwapRequests;
