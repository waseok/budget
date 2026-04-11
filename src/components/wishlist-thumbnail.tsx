"use client";

import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

function isNextImageHost(hostname: string) {
  return ["images.unsplash.com", "www.gimkit.com", "gimkit.com"].includes(hostname);
}

function isLikelyImageUrl(raw: string) {
  try {
    const u = new URL(raw.trim());
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

type Props = {
  imageUrl: string | null;
  title: string;
  sizes?: string;
};

export function WishlistThumbnail({ imageUrl, title, sizes = "(max-width: 768px) 50vw, 200px" }: Props) {
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  const trimmed = imageUrl?.trim() ?? "";
  const url = trimmed && isLikelyImageUrl(trimmed) && !usePlaceholder ? trimmed : null;

  if (!url) {
    return (
      <Image src={PLACEHOLDER} alt={title} fill className="object-cover" sizes={sizes} />
    );
  }

  try {
    const host = new URL(url).hostname;
    if (isNextImageHost(host)) {
      return <Image src={url} alt={title} fill className="object-cover" sizes={sizes} />;
    }
  } catch {
    return <Image src={PLACEHOLDER} alt={title} fill className="object-cover" sizes={sizes} />;
  }

  return (
    <img
      src={url}
      alt={title}
      className="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setUsePlaceholder(true)}
    />
  );
}
