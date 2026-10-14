import { supabase } from "../lib/connect";

export type QueueSwapRequest = {
  id: string;
  status: "Pending" | "Approved" | "Denied";
  created_at: string;
  requester: { id: string; queue_number: number; patients: { full_name: string } | null } | null;
  target: { id: string; queue_number: number; patients: { full_name: string } | null } | null;
};

export const getQueueSwapRequests = async (): Promise<QueueSwapRequest[]> => {
  const { data, error } = await supabase
    .from("queue_swap_requests")
    .select(`id,status,created_at,
      requester:queue_entries!queue_swap_requests_requester_queue_entry_id_fkey(id,queue_number,patients(full_name)),
      target:queue_entries!queue_swap_requests_target_queue_entry_id_fkey(id,queue_number,patients(full_name))`)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data ?? []) as unknown as QueueSwapRequest[];
};

export const createQueueSwapRequest = async (requesterId: string, targetId: string) => {
  const { error } = await supabase.rpc("create_queue_swap_request", {
    p_requester_queue_entry_id: requesterId,
    p_target_queue_entry_id: targetId,
  });
  if (error) throw error;
};

export const respondToQueueSwapRequest = async (requestId: string, approve: boolean) => {
  const { data, error } = await supabase.rpc("respond_to_queue_swap_request", {
    p_request_id: requestId,
    p_approve: approve,
  });
  if (error) throw error;
  return data as "Approved" | "Denied";
};
