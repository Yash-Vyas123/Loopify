import { UsersIcon } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="card bg-base-200/50 backdrop-blur-sm border-2 border-dashed border-base-300 p-12 text-center max-w-2xl mx-auto flex flex-col items-center gap-4 transition-all hover:bg-base-200">
      <div className="bg-primary/10 p-4 rounded-full">
        <UsersIcon className="size-12 text-primary opacity-80" />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2">No friends yet</h3>
        <p className="text-base-content opacity-70">
          Your friend list is empty. Connect with language partners below to start practicing together and build your community!
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <span className="badge badge-primary badge-outline py-3 px-4 h-auto whitespace-nowrap font-semibold tracking-wide">
          Native Practice
        </span>
        <span className="badge badge-secondary badge-outline py-3 px-4 h-auto whitespace-nowrap font-semibold tracking-wide">
          Video Calls
        </span>
        <span className="badge badge-accent badge-outline py-3 px-4 h-auto whitespace-nowrap font-semibold tracking-wide">
          Chat
        </span>
      </div>

    </div>
  );
};

export default NoFriendsFound;