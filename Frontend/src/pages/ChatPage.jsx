import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import toast from "react-hot-toast";

import { VideoIcon, ArrowLeftIcon } from "lucide-react";

import ChatLoader from "../components/ChatLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!tokenData?.token || !authUser || !targetUserId || !STREAM_API_KEY) return;

    const client = StreamChat.getInstance(STREAM_API_KEY);
    let isMounted = true;

    const initChat = async () => {
      try {
        // 1. If we are already connected as a DIFFERENT user, disconnect first
        if (client.userId && client.userId !== authUser._id) {
          await client.disconnectUser();
        }

        // 2. If NOT connected, then connect
        if (!client.userId) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        if (!isMounted) return;

        // 3. Setup channel
        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        if (isMounted) {
          setChatClient(client);
          setChannel(currChannel);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (isMounted) {
          toast.error("Could not connect to chat. Please try again.");
          setLoading(false);
        }
      }
    };

    initChat();

    return () => {
      isMounted = false;
    };
  }, [tokenData, authUser, targetUserId]);


  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  const targetUser = Object.values(channel.state.members).find(
    (m) => m.user.id !== authUser._id
  )?.user;

  return (
    <div className="h-[100dvh] flex flex-col bg-base-100 overflow-hidden safe-bottom">
      <style>{`
        .str-chat {
          --str-chat__primary-color: #8b5cf6;
          --str-chat__active-primary-color: #7c3aed;
          --str-chat__background-color: #0f172a;
          --str-chat__body-background-color: #0f172a;
          --str-chat__main-panel-background-color: #0f172a;
          --str-chat__secondary-background-color: #1d232a;
          --str-chat__message-send-button-color: #8b5cf6;
          --str-chat__own-message-background-color: #8b5cf6;
          --str-chat__own-message-text-color: #ffffff;
          --str-chat__other-message-background-color: #1d232a;
          --str-chat__other-message-text-color: #e5e7eb;
          --str-chat__message-bubble-border-radius: 20px;
        }

        .str-chat__message-list {
          background-color: #0f172a !important;
          padding: 1rem 0 !important;
        }

        /* Responsive Message Input */
        .str-chat__message-input {
          background-color: #1d232a !important;
          border-radius: 28px !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          margin: 0.5rem 0.75rem !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
        }

        .str-chat__message-input-creater {
          padding: 8px 12px !important;
          background-color: #1d232a !important;
          border-radius: 28px !important;
        }

        .str-chat__message-input textarea {
          font-size: 16px !important; /* Prevents auto-zoom on iOS */
          padding: 10px 14px !important;
        }

        @media (min-width: 640px) {
          .str-chat__message-input {
            margin: 1rem 1.5rem !important;
          }
        }

        .str-chat-channel {
            height: 100% !important;
        }

        .str-chat__main-panel {
            padding: 0 !important;
        }

        .str-chat__header {
          display: none !important;
        }

        /* Mobile specific message spacing */
        @media (max-width: 640px) {
          .str-chat__message-simple {
            padding: 4px 8px !important;
          }
          .str-chat__message-simple-avatar {
            margin-right: 8px !important;
          }
        }

        /* Scrollbar styling */
        .str-chat__message-list::-webkit-scrollbar {
          width: 4px;
        }
        .str-chat__message-list::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.4);
          border-radius: 10px;
        }
      `}</style>

      <Chat client={chatClient} theme="str-chat__theme-dark">
        <Channel channel={channel}>
          <div className="flex flex-col h-full w-full relative">
            {/* Optimized Header for Mobile */}
            <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-base-200/90 border-b border-base-300 backdrop-blur-lg z-20 sticky top-0 transition-all">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <Link to="/" className="btn btn-ghost btn-circle btn-xs sm:btn-md">
                  <ArrowLeftIcon className="size-4 sm:size-6" />
                </Link>
                <Link to={`/profile/${targetUserId}`} className="avatar online flex-shrink-0 hover:scale-105 transition-transform">
                  <div className="w-9 sm:w-12 rounded-xl ring ring-primary/40 ring-offset-base-100 ring-offset-1 overflow-hidden">
                    <img src={targetUser?.image} alt={targetUser?.name} />
                  </div>
                </Link>
                <div className="min-w-0">
                  <Link to={`/profile/${targetUserId}`}>
                    <h3 className="font-bold text-sm sm:text-lg leading-tight truncate hover:text-primary transition-colors pr-1">
                      {targetUser?.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="size-1.5 sm:size-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse" />
                    <span className="text-[9px] sm:text-xs text-success font-bold uppercase tracking-wider opacity-90">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 ml-2">
                <button
                  onClick={handleVideoCall}
                  className="btn btn-primary btn-xs sm:btn-md flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all text-white border-none rounded-full px-3 sm:px-6"
                >
                  <VideoIcon className="size-3 sm:size-5" />
                  <span className="hidden xs:inline sm:inline font-bold">Call</span>
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden h-full flex flex-col bg-[#0f172a]">
              <Window>
                <MessageList hideDeletedMessages />
                <div className="bg-[#0f172a] pb-safe">
                  <MessageInput focus grow />
                </div>
              </Window>
            </div>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
