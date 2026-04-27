import { useState } from 'react';
import AvatarPlaceholder from "./AvatarPlaceholder";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  alt?: string;
}

export default function UserAvatar({ src, name, size = 40, className = "", alt }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt ?? name ?? "avatar"}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size }}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  return <AvatarPlaceholder name={name ?? "U"} size={size} className={className} />;
}
