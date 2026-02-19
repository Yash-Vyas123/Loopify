import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import toast from "react-hot-toast";
import { capitalize } from "../lib/utils";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading, isError } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Refresh recommendations too
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    }

  });

  const incomingRequests = (friendRequests?.incomingReqs || []).filter(req => req?.sender?._id);
  const acceptedRequests = (friendRequests?.acceptedReqs || []).filter(req => req?.recipient?.fullName);


  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-4">
        <XCircleIcon className="size-16 text-error opacity-50" />
        <h2 className="text-2xl font-bold">Oops! Failed to load notifications</h2>
        <p className="opacity-70">Please check your connection and try again.</p>
        <button onClick={() => queryClient.invalidateQueries({ queryKey: ["friendRequests"] })} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <BellIcon className="size-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Activity Center</h1>
          <p className="opacity-60 font-medium">Manage your connections and incoming requests</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm font-bold uppercase tracking-widest opacity-40">Loading your alerts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* INCOMING REQUESTS SECTION */}
          {(incomingRequests.length > 0) && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Request Queue
                  <span className="badge badge-primary font-mono">{incomingRequests.length}</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {incomingRequests.map((request) => (
                  <div
                    key={request?._id}
                    className="group relative bg-base-200/50 backdrop-blur-sm border border-base-300 rounded-3xl p-5 transition-all hover:bg-base-200 hover:shadow-xl hover:shadow-primary/5 border-l-4 border-l-primary"
                  >
                    <div className="flex items-start gap-4">
                      <div className="avatar online">
                        <div className="w-14 h-14 rounded-2xl ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100 overflow-hidden">
                          <img src={request?.sender?.profilePic} alt={request?.sender?.fullName} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{request?.sender?.fullName}</h3>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="badge badge-sm bg-primary/10 text-primary border-none font-bold py-2.5">
                            {capitalize(request?.sender?.nativeLanguage || "N/A")}
                          </span>
                          <span className="badge badge-sm badge-outline opacity-60 font-bold py-2.5">
                            Learning {capitalize(request?.sender?.learningLanguage || "N/A")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-5">
                      <button
                        className="btn btn-primary flex-1 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all rounded-2xl"
                        onClick={() => acceptRequestMutation(request?._id)}
                        disabled={isPending}
                      >
                        {isPending ? <span className="loading loading-spinner loading-xs" /> : <CheckCircle2Icon className="size-4 mr-2" />}
                        Accept
                      </button>
                      <button className="btn btn-ghost btn-square rounded-2xl hover:bg-error/10 hover:text-error transition-colors">
                        <XCircleIcon className="size-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ACCEPTED NOTIFICATIONS SECTION */}
          {acceptedRequests.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Recent Successes
              </h2>

              <div className="space-y-3">
                {acceptedRequests.map((notification) => (
                  <div key={notification?._id} className="bg-base-200/30 border border-base-300 rounded-2xl p-4 flex items-center gap-4 group hover:bg-base-200/50 transition-colors">
                    <div className="avatar size-12">
                      <div className="rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                        <img
                          src={notification?.recipient?.profilePic}
                          alt={notification?.recipient?.fullName}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-relaxed">
                        <span className="font-black text-primary">{notification?.recipient?.fullName}</span> is now a learner in your circle!
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 flex items-center gap-1">
                          <ClockIcon className="size-3" /> Just Now
                        </span>
                        <div className="badge badge-success badge-xs badge-outline animate-pulse">Connected</div>
                      </div>
                    </div>

                    <div className="bg-success/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <MessageSquareIcon className="size-4 text-success" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
            <div className="py-12 flex justify-center w-full">
              <NoNotificationsFound />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;