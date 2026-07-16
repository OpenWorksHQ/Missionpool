"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CircleUserRound, Rocket, UsersRound, Zap } from "lucide-react";
import { categories, useMissionData } from "@/lib/store";
import type { Pool, Profile } from "@/lib/types";

const displayCounts: Record<string, number> = {
  "build-the-next-apple": 1243,
  "decentralize-education": 892,
  "reinvent-urban-transportation": 756,
  "clean-energy-everywhere": 643,
  "open-source-hardware": 512,
  "restore-a-community-recreation-center": 318
};

const titleOverrides: Record<string, string> = {
  "reinvent-urban-transportation": "Solve Global Transportation"
};

const homeImageOverrides: Record<string, string> = {
  "build-the-next-apple": "/images/mission-next-apple.png",
  "decentralize-education": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "reinvent-urban-transportation": "https://images.unsplash.com/photo-1641029293180-7f89918b09ad?auto=format&fit=crop&w=1200&q=80",
  "clean-energy-everywhere": "https://images.unsplash.com/photo-1675116731363-c17d957f3444?auto=format&fit=crop&w=1200&q=80",
  "open-source-hardware": "https://images.unsplash.com/photo-1672385503236-b265b253268e?auto=format&fit=crop&w=1200&q=80"
};

const isPool = (pool: Pool | undefined): pool is Pool => Boolean(pool);

export default function HomePage() {
  const { data } = useMissionData();
  const memberProfiles = (poolId: string) =>
    data.members
      .filter((member) => member.poolId === poolId)
      .map((member) => data.profiles.find((profile) => profile.id === member.profileId))
      .filter(Boolean) as Profile[];

  const featured = data.pools.find((pool) => pool.slug === "build-the-next-apple") ?? data.pools[0];
  const topSmall = [
    data.pools.find((pool) => pool.slug === "decentralize-education"),
    data.pools.find((pool) => pool.slug === "reinvent-urban-transportation")
  ].filter(isPool);
  const lowerCards = [
    data.pools.find((pool) => pool.slug === "clean-energy-everywhere"),
    data.pools.find((pool) => pool.slug === "open-source-hardware")
  ].filter(isPool);

  return (
    <div className="bg-white text-navy">
      <section className="home-hero">
        <div className="home-copy">
          <h1 className="home-headline">
            Join missions.
            <br />
            Find your people.
            <br />
            Build the future.
          </h1>
          <p className="home-subcopy">
            Mission Pool is where builders, creators, and problem solvers connect around shared goals. Join a mission. Contribute. Build something real.
          </p>
          <div className="home-actions">
            <Link className="home-button home-button-primary focus-ring" href="/pools">
              Explore Pools
            </Link>
            <Link className="home-button home-button-secondary focus-ring" href="/create">
              Create a Pool
            </Link>
          </div>
          <div className="home-members">
            <div className="flex -space-x-3">
              {data.profiles.slice(0, 5).map((profile) => (
                <Image key={profile.id} className="home-avatar" src={profile.avatarUrl} alt={profile.name} width={36} height={36} />
              ))}
            </div>
            <p className="home-member-count">12,847+ builders already inside</p>
          </div>
        </div>

        <div className="home-mosaic">
          <HomeMissionCard pool={featured} members={memberProfiles(featured.id)} featured className="min-h-[270px]" />
          <div className="home-mosaic-stack">
            {topSmall.map((pool) => (
              <HomeMissionCard key={pool.id} pool={pool} members={memberProfiles(pool.id)} className="min-h-[129px]" />
            ))}
          </div>
          <div className="home-mosaic-bottom">
            {lowerCards.map((pool) => (
              <HomeMissionCard key={pool.id} pool={pool} members={memberProfiles(pool.id)} className="min-h-[132px]" />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-[#edf0f3] bg-[#fbfcfd]">
        <div className="home-how-shell">
          <div>
            <h2 className="text-[22px] font-black tracking-normal text-navy">How Mission Pool works</h2>
            <div className="home-steps">
              {([
                [UsersRound, "1. Join a Mission", "Explore open missions and join the ones you care about."],
                [CircleUserRound, "2. Build Your Profile", "Show your skills, experience, interests, and what you need."],
                [UsersRound, "3. Find Your People", "Connect with builders, creators, and experts in the mission."],
                [Rocket, "4. Build Together", "Create projects, form teams, and turn ideas into impact."]
              ] as Array<[LucideIcon, string, string]>).map(([Icon, title, text], index) => (
                <div key={title} className="relative pr-5">
                  <Icon className="mb-5 text-[#07111f]" size={27} strokeWidth={2} />
                  <h3 className="text-sm font-black text-[#101722]">{title}</h3>
                  <p className="mt-2 max-w-[190px] text-[13px] leading-[1.55] text-[#5f6673]">{text}</p>
                  {index < 3 ? <ArrowRight className="home-step-arrow" size={18} strokeWidth={1.6} /> : null}
                </div>
              ))}
            </div>
          </div>
          <div className="home-create-card">
            <Zap size={29} strokeWidth={2} />
            <h3>Create Your Own Mission</h3>
            <p>Have a mission in mind? Create a pool, invite others, and start building.</p>
            <Link className="home-button home-button-primary focus-ring" href="/create">
              Create a Pool
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="home-active">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[22px] font-black text-navy">Active Missions</h2>
          <Link className="home-view-all" href="/pools">
            View all missions <ArrowRight size={17} />
          </Link>
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {categories.slice(0, 7).map((category, index) => (
            <Link key={category} className={`home-pill ${index === 0 ? "home-pill-active" : ""}`} href={`/pools${category === "All" ? "" : `?category=${category}`}`}>
              {category}
            </Link>
          ))}
        </div>
        <div className="home-active-grid">
          {data.pools.slice(0, 3).map((pool) => (
            <HomeMissionCard key={pool.id} pool={pool} members={memberProfiles(pool.id)} className="min-h-[150px]" />
          ))}
        </div>
      </section>
    </div>
  );
}

function HomeMissionCard({ pool, members, featured = false, className = "" }: { pool: Pool; members: Profile[]; featured?: boolean; className?: string }) {
  const count = displayCounts[pool.slug] ?? members.length;
  const title = titleOverrides[pool.slug] ?? pool.title;
  const imageUrl = homeImageOverrides[pool.slug] ?? pool.coverUrl;

  return (
    <Link className={`home-card ${featured ? "home-card-featured" : ""} ${className}`} href={`/pool/${pool.slug}`}>
      <Image
        className="home-card-image"
        src={imageUrl}
        alt=""
        fill
        priority={featured}
        sizes={featured ? "(min-width: 1024px) 460px, calc(100vw - 56px)" : "(min-width: 1024px) 356px, calc(100vw - 56px)"}
      />
      <div className="home-card-overlay" />
      <div className="home-card-content">
        {featured ? <span className="home-featured-badge">Featured mission</span> : null}
        <h3>{title}</h3>
        {featured ? <p>{pool.summary}</p> : null}
        <div className="home-card-meta">
          <span>{count.toLocaleString()} members</span>
          {featured ? (
            <div className="home-card-avatars">
              {members.slice(0, 5).map((member) => (
                <Image key={member.id} src={member.avatarUrl} alt={member.name} width={30} height={30} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
