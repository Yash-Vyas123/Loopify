import { LoaderIcon, ShipWheelIcon } from "lucide-react";

function ChatLoader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-base-100 gap-6">
      <div className="relative">
        <div className="bg-primary/10 p-6 rounded-3xl animate-pulse">
          <ShipWheelIcon className="size-16 text-primary animate-spin-slow" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <LoaderIcon className="size-8 text-secondary animate-spin" />
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-pulse">
          Loopify
        </h2>
        <p className="text-base-content/60 font-medium tracking-widest text-xs uppercase">Initializing secure connection...</p>
      </div>
    </div>
  );
}

export default ChatLoader;