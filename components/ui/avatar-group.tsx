import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ src, alt = "", fallback, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div className={cn("rounded-full overflow-hidden flex-shrink-0 bg-gray-200", sizeClasses[size])}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size === "sm" ? 24 : size === "md" ? 32 : 40}
          height={size === "sm" ? 24 : size === "md" ? 32 : 40}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
          {fallback || alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt: string;
    fallback?: string;
  }>;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function AvatarGroup({ avatars, max = 5, size = "md" }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className="border-2 border-white rounded-full"
        >
          <Avatar
            src={avatar.src}
            alt={avatar.alt}
            fallback={avatar.fallback}
            size={size}
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div className={cn(
          "flex items-center justify-center rounded-full bg-gray-100 border-2 border-white text-xs font-medium",
          size === "sm" ? "w-6 h-6 text-[10px]" : 
          size === "md" ? "w-8 h-8 text-xs" : 
          "w-10 h-10 text-sm"
        )}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
} 