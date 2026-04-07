"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoriteButton({
  productId,
  size = 16,
  className = "",
}: {
  productId: string;
  size?: number;
  className?: string;
}) {
  const { toggle, isFavorite } = useFavorites();
  const active = isFavorite(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 ${
        active
          ? "text-[#e85a7a] hover:text-[#d44a6a] scale-110"
          : "text-white/40 hover:text-white/70"
      } ${className}`}
      aria-label={active ? "お気に入りから削除" : "お気に入りに追加"}
    >
      {active ? <FaHeart size={size} /> : <FaRegHeart size={size} />}
    </button>
  );
}
