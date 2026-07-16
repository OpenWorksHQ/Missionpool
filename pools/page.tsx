"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MissionCard } from "@/components/mission-card";
import { categories, useMissionData } from "@/lib/store";
import type { Category, Pool } from "@/lib/types";
import { EmptyState, LoadingState, PageContainer, SearchInput, SectionHeader, Select, StatusPill } from "@/components/ui";

type SortMode = "active" | "newest" | "largest";

export default function PoolsPage() {
  return (
    <Suspense fallback={<PageContainer><LoadingState label="Loading pools..." /></PageContainer>}>
      <PoolsContent />
    </Suspense>
  );
}

function PoolsContent() {
  const params = useSearchParams();
  const { data } = useMissionData();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<Category | "All">((params.get("category") as Category | null) ?? "All");
  const [sort, setSort] = useState<SortMode>("active");

  const memberProfiles = (poolId: string) =>
    data.members.filter((member) => member.poolId === poolId).map((member) => data.profiles.find((profile) => profile.id === member.profileId)!).filter(Boolean);

  const pools = useMemo(() => {
    const normalized = query.toLowerCase();
    const count = (pool: Pool) => data.members.filter((member) => member.poolId === pool.id).length;
    return data.pools
      .filter((pool) => !pool.isPrivate)
      .filter((pool) => category === "All" || pool.category === category)
      .filter((pool) => [pool.title, pool.summary, pool.description, pool.category, pool.location].join(" ").toLowerCase().includes(normalized))
      .sort((a, b) => {
        if (sort === "largest") return count(b) - count(a);
        if (sort === "newest") return Date.parse(b.createdAt) - Date.parse(a.createdAt);
        return Date.parse(b.recentActivityAt) - Date.parse(a.recentActivityAt);
      });
  }, [category, data.members, data.pools, query, sort]);

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Explore pools"
        title="Find a mission worth joining."
        text="Browse public mission environments by category, skills, location, and recent activity. Each pool is a place to meet aligned builders and contribute toward a shared goal."
        action={<StatusPill tone="dark">{pools.length} open missions</StatusPill>}
      />

      <div className="browse-controls">
        <div className="browse-search-row">
          <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, description, location..." />
          <label className="mp-field">
            Sort
            <Select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
              <option value="active">Most active</option>
              <option value="newest">Newest</option>
              <option value="largest">Largest</option>
            </Select>
          </label>
        </div>
        <div className="browse-filter-row">
          {categories.map((item) => (
            <button key={item} className={`focus-ring browse-pill ${category === item ? "browse-pill-active" : ""}`} type="button" onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {pools.length ? (
        <div className="mission-grid">
          {pools.map((pool) => <MissionCard key={pool.id} pool={pool} members={memberProfiles(pool.id)} />)}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState title="No pools found" text="Try a different search, category, or sort option. The mission you want may simply need to be created." />
        </div>
      )}
    </PageContainer>
  );
}
