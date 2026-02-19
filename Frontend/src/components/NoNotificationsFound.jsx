import { BellIcon } from "lucide-react";

function NoNotificationsFound() {
  return (
    <div className="card bg-base-200/50 backdrop-blur-sm border-2 border-dashed border-base-300 p-16 text-center max-w-2xl mx-auto flex flex-col items-center gap-6">
      <div className="relative">
        <div className="bg-primary/5 p-6 rounded-full">
          <BellIcon className="size-16 text-primary opacity-20" />
        </div>
        <div className="absolute -top-1 -right-1 size-4 bg-primary rounded-full animate-ping opacity-50" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold">All caught up!</h3>
        <p className="text-base-content opacity-70 max-w-sm">
          You don't have any new notifications at the moment. We'll let you know when someone sends you a friend request or joins a call.
        </p>
      </div>

      <button className="btn btn-ghost btn-outline btn-sm opacity-50 pointer-events-none">
        Mark all as read
      </button>
    </div>
  );
}

export default NoNotificationsFound;