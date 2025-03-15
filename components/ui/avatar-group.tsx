import React, { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(max);
  
  // 计算每个头像的宽度（包括负margin）
  const getAvatarWidth = () => {
    switch (size) {
      case "sm": return 20; // 24px - 4px overlap
      case "md": return 28; // 32px - 4px overlap
      case "lg": return 36; // 40px - 4px overlap
      default: return 28;
    }
  };

  // 监听容器宽度变化，调整可见头像数量
  useEffect(() => {
    const calculateVisibleAvatars = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const avatarWidth = getAvatarWidth();
      const counterWidth = avatarWidth; // +n 计数器的宽度
      
      // 计算容器能容纳的最大头像数量（留出计数器的空间）
      let maxVisible = Math.floor((containerWidth - counterWidth) / avatarWidth) + 1;
      
      // 如果所有头像都能显示，就不需要计数器
      if (maxVisible >= avatars.length) {
        maxVisible = avatars.length;
      } else {
        // 确保至少显示1个头像
        maxVisible = Math.max(1, maxVisible - 1);
      }
      
      // 不超过传入的max值
      maxVisible = Math.min(maxVisible, max);
      
      setVisibleCount(maxVisible);
    };

    // 初始计算
    calculateVisibleAvatars();
    
    // 监听窗口大小变化
    const handleResize = () => calculateVisibleAvatars();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [avatars.length, max, size]);

  const visibleAvatars = avatars.slice(0, visibleCount);
  const remainingCount = avatars.length - visibleCount;

  return (
    <div ref={containerRef} className="flex -space-x-2 overflow-hidden">
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