
import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200/50 backdrop-blur-sm border border-base-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
      <div className="card-body p-5">
        {/* USER INFO */}
        <div className="flex items-center gap-4 mb-4">
          <Link to={`/profile/${friend._id}`} className="avatar size-14 ring ring-primary/20 ring-offset-base-100 ring-offset-2 rounded-full overflow-hidden transition-transform hover:scale-105">
            <img src={friend.profilePic} alt={friend.fullName} className="object-cover" />
          </Link>
          <div className="min-w-0">
            <Link to={`/profile/${friend._id}`}>
              <h3 className="font-bold text-lg truncate hover:text-primary transition-colors">{friend.fullName}</h3>
            </Link>
            <p className="text-xs opacity-60 flex items-center gap-1">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              Online
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className="badge badge-secondary badge-sm py-3 px-3 gap-1.5 border-none">
            {getLanguageFlag(friend.nativeLanguage)}
            <span className="font-medium">{friend.nativeLanguage}</span>
          </span>
          <span className="badge badge-outline badge-sm py-3 px-3 gap-1.5 opacity-80">
            {getLanguageFlag(friend.learningLanguage)}
            <span className="font-medium">{friend.learningLanguage}</span>
          </span>
        </div>

        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 group-hover:translate-y-[-2px] transition-all"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
