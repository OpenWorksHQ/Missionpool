"use client";

import Link from "next/link";
import Image from "next/image";
import type { Pool, Profile } from "@/lib/types";
import { AvatarStack, StatusPill } from "@/components/ui";

const displayCounts: Record<string, number> = {
  "build-the-next-apple": 1243,
  "decentralize-education": 892,
  "reinvent-urban-transportation": 756,
  "clean-energy-everywhere": 643,
  "open-source-hardware": 512,
  "restore-a-community-recreation-center": 318
};

const cardImages: Record<string, string> = {
  "build-the-next-apple": "/images/mission-next-apple.png",
  "decentralize-education": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "reinvent-urban-transportation": "https://images.unsplash.com/photo-1641029293180-7f89918b09ad?auto=format&fit=crop&w=1200&q=80",
  "clean-energy-everywhere": "https://images.unsplash.com/photo-1675116731363-c17d957f3444?auto=format&fit=crop&w=1200&q=80",
  "open-source-hardware": "https://images.unsplash.com/photo-1672385503236-b265b253268e?auto=format&fit=crop&w=1200&q=80"
};

export function MissionCard({ pool, members, featured = false }: { pool: Pool; members: Profile[]; featured?: boolean }) {
  const count = displayCounts[pool.slug] ?? members.length;
  const imageUrl = cardImages[pool.slug] ?? pool.coverUrl;

  return (
    <Link className={`mp-mission-card ${featured ? "mp-mission-card-featured" : ""}`} href={`/pool/${pool.slug}`}>
      <Image className="mp-mission-card-image" src={imageUrl} alt="" fill sizes={featured ? "(min-width: 1024px) 520px, 100vw" : "(min-width: 768px) 360px, 100vw"} priority={featured} />
      <div className="mp-mission-card-overlay" />
      <div className="mp-mission-card-content">
        <div className="mp-mission-card-top">
          <StatusPill tone="green">{pool.category}</StatusPill>
        </div>
        <div>
          <h3>{pool.title}</h3>
          <p>{pool.summary}</p>
          <div className="mp-mission-card-meta">
            <div>
              <strong>{count.toLocaleString()} members</strong>
              <span>{pool.location}{pool.isPrivate ? " · Private" : ""}</span>
            </div>
            <AvatarStack profiles={members} size={30} />
          </div>
        </div>
      </div>
    </Link>
  );
}
