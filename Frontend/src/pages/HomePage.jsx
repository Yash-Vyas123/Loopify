import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import { capitalize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Discover Learners</h2>
                <p className="opacity-70">
                  Find the perfect language partners and grow your network
                </p>
              </div>
              <Link to="/friends" className="btn btn-outline btn-sm">
                <UsersIcon className="mr-2 size-4" />
                View My Friends
              </Link>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200/50 backdrop-blur-sm p-12 text-center border-2 border-dashed border-base-300">
              <h3 className="font-bold text-2xl mb-2 text-primary">No new matches today</h3>
              <p className="text-base-content opacity-70">
                You've connected with everyone available. Check back soon for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200/50 backdrop-blur-sm border border-base-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                  >
                    <div className="card-body p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="avatar size-16 ring ring-primary/20 ring-offset-2 ring-offset-base-100 rounded-full overflow-hidden transition-transform group-hover:scale-105">
                          <img src={user.profilePic} alt={user.fullName} className="object-cover" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-xl truncate group-hover:text-primary transition-colors">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-60 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-secondary badge-sm h-auto py-1.5 px-3 gap-1.5 border-none">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline badge-sm h-auto py-1.5 px-3 gap-1.5 opacity-80">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitalize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className="text-sm opacity-70 line-clamp-2 italic">"{user.bio}"</p>}

                      <button
                        className={`btn w-full mt-4 shadow-lg transition-all ${hasRequestBeenSent
                          ? "btn-disabled bg-base-300"
                          : "btn-primary shadow-primary/20 hover:shadow-primary/40 hover:translate-y-[-2px]"
                          } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;