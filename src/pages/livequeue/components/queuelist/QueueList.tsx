import React from "react";
import { Clock3, Hourglass } from "lucide-react";
import { message, Select } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classes from "./QueueList.module.css";
import type { LiveQueue } from "../../../../domain/liveQueue";
import {
  getLiveQueue,
  updateLiveQueueStatus,
} from "../../../../services/liveQueue";

type QueueListProps = {
  doctorId?: string;
};

const QueueList: React.FC<QueueListProps> = ({ doctorId }) => {
  const queryClient = useQueryClient();
  const statusMutation = useMutation({
    mutationFn: ({
      queueEntryId,
      status,
    }: {
      queueEntryId: string;
      status: "In Consultation" | "Completed" | "Cancelled";
    }) => updateLiveQueueStatus(queueEntryId, status),
    onSuccess: (_data, variables) => {
      message.success(`Appointment marked ${variables.status}.`);
      queryClient.setQueriesData<LiveQueue[]>(
        { queryKey: ["live-queue"] },
        (currentQueue) => {
          if (!currentQueue) return currentQueue;
          if (
            variables.status === "Completed" ||
            variables.status === "Cancelled"
          ) {
            return currentQueue.filter(
              (patient) => patient.id !== variables.queueEntryId,
            );
          }

          return currentQueue.map((patient) =>
            patient.id === variables.queueEntryId
              ? { ...patient, status: variables.status }
              : patient,
          );
        },
      );
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["live-queue"] }),
        queryClient.invalidateQueries({ queryKey: ["appointments"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["patient-visits"] }),
        queryClient.invalidateQueries({ queryKey: ["recent-visits"] }),
      ]);
    },
    onError: (error: Error) => message.error(error.message),
  });
  const {
    data: queue = [],
    isLoading,
    isError,
  } = useQuery<LiveQueue[]>({
    queryKey: ["live-queue", doctorId || "all"],
    queryFn: () => getLiveQueue({ doctorId }),
    staleTime: 60 * 1000,
  });

  const nextPatient = doctorId
    ? queue.find((patient) => patient.status === "Waiting")
    : undefined;

  if (isLoading) {
    return <p>Loading queue...</p>;
  }

  if (isError) {
    return <p>Error loading queue. Please try again later.</p>;
  }

  if (queue.length === 0) {
    return <p>No patients are currently in this doctor&apos;s queue.</p>;
  }

  return (
    <section className={classes.list}>
      {queue.map((patient, index) => {
        const previousPatient = queue[index - 1];

        const isNewDoctor =
          index === 0 || previousPatient.doctor_id !== patient.doctor_id;
        const isCurrent = patient.status === "In Consultation";
        const isNext = doctorId ? patient.id === nextPatient?.id : false;
        const isHold = patient.status === "On Hold";
        const isUpdating =
          statusMutation.isPending &&
          statusMutation.variables?.queueEntryId === patient.id;

        const appointmentTime = new Date(
          patient.appointment_at,
        ).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <React.Fragment key={patient.id}>
            {isNewDoctor && (
              <div className={classes.doctorQueueHeader}>
                <div>
                  <strong>{patient.doctor_name}</strong>
                  <span>{patient.specialty}</span>
                </div>

                <span>Live Queue</span>
              </div>
            )}
            <article
              className={`${classes.patientCard} ${
                isCurrent ? classes.current : ""
              } ${isHold ? classes.hold : ""}`}
            >
              <div
                className={`${classes.queueNumber} ${
                  isCurrent ? classes.currentNumber : ""
                }`}
              >
                {isCurrent && <span>NOW</span>}
                {isNext && !isCurrent && <span>NEXT</span>}

                <strong>#{patient.queue_number}</strong>
              </div>

              <div className={classes.patientInfo}>
                <h2>{patient.patient_name}</h2>

                <div className={classes.meta}>
                  <span>
                    <Clock3 size={14} />
                    {appointmentTime}
                  </span>

                  {isCurrent && (
                    <>
                      <i />
                      <span>In Consultation</span>
                    </>
                  )}

                  {isNext && !isCurrent && (
                    <span className={classes.waitTime}>
                      <Hourglass size={14} />
                      Next in queue
                    </span>
                  )}

                  {!isCurrent && !isNext && (
                    <span className={classes.status}>{patient.status}</span>
                  )}
                </div>
              </div>

              <div className={classes.queueActions}>
                <Select
                  aria-label={`Change status for ${patient.patient_name}`}
                  className={classes.statusSelect}
                  placeholder="Change status"
                  value={isCurrent ? "In Consultation" : undefined}
                  loading={isUpdating}
                  disabled={isUpdating}
                  onChange={(status: "In Consultation" | "Completed" | "Cancelled") =>
                    statusMutation.mutate({
                      queueEntryId: patient.id,
                      status,
                    })
                  }
                  options={[
                    { value: "In Consultation", label: "In Consultation" },
                    { value: "Completed", label: "Completed" },
                    { value: "Cancelled", label: "Cancelled" },
                  ]}
                />
              </div>
            </article>
          </React.Fragment>
        );
      })}
    </section>
  );
};

export default QueueList;
