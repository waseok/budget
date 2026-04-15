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

function getHostname(raw: string): string | null {
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
}

type Props = {
  imageUrl: string | null;
  title: string;
  sizes?: string;
  priority?: boolean;
};

export function WishlistThumbnail({
  imageUrl,
  title,
  sizes = "(max-width: 768px) 50vw, 200px",
  priority = false,
}: Props) {
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  const trimmed = imageUrl?.trim() ?? "";
  const url = trimmed && isLikelyImageUrl(trimmed) && !usePlaceholder ? trimmed : null;
  const hostname = url ? getHostname(url) : null;
  const canUseNextImage = hostname ? isNextImageHost(hostname) : false;

  if (!url) {
    return (
      <Image src={PLACEHOLDER} alt={title} fill className="object-cover" sizes={sizes} priority={priority} />
    );
  }

  if (!hostname) {
    return (
      <Image src={PLACEHOLDER} alt={title} fill className="object-cover" sizes={sizes} priority={priority} />
    );
  }

  if (canUseNextImage) {
    return <Image src={url} alt={title} fill className="object-cover" sizes={sizes} priority={priority} />;
  }

  return (
    <img
      src={url}
      alt={title}
      className="absolute inset-0 h-full w-full object-cover"
      loading={priority ? "eager" : "lazy"}
      referrerPolicy="no-referrer"
      onError={() => setUsePlaceholder(true)}
    />
  );
}
