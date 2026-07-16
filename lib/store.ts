"use client";

import { useEffect, useMemo, useState } from "react";
import { seedData } from "@/lib/seed";
import type { AppData, Category, Comment, Conversation, Message, MissionUpdate, Outcome, Pool, Post, Profile } from "@/lib/types";

const STORAGE_KEY = "mission-pool-mvp";

const cloneSeed = (): AppData => JSON.parse(JSON.stringify(seedData)) as AppData;

export function loadData(): AppData {
  if (typeof window === "undefined") return cloneSeed();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = cloneSeed();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as AppData;
  } catch {
    const seed = cloneSeed();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

export function saveData(data: AppData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function uniqueSlug(title: string, pools: Pool[]) {
  const base = slugify(title);
  let slug = base;
  let index = 2;
  while (pools.some((pool) => pool.slug === slug)) {
    slug = `${base}-${index}`;
    index += 1;
  }
  return slug;
}

export function useMissionData() {
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    const onUpdate = () => setData(loadData());
    window.addEventListener("mission-pool-updated", onUpdate);
    return () => window.removeEventListener("mission-pool-updated", onUpdate);
  }, []);

  const persist = (next: AppData) => {
    saveData(next);
    setData(next);
    window.dispatchEvent(new Event("mission-pool-updated"));
  };

  return useMemo(() => ({
    data,
    currentUser: data.profiles.find((profile) => profile.id === data.currentUserId) ?? data.profiles[0],
    joinPool(poolId: string) {
      if (data.members.some((member) => member.poolId === poolId && member.profileId === data.currentUserId)) return;
      const next = {
        ...data,
        members: [...data.members, { poolId, profileId: data.currentUserId, role: "member" as const, joinedAt: new Date().toISOString() }]
      };
      persist(next);
    },
    leavePool(poolId: string) {
      const next = { ...data, members: data.members.filter((member) => !(member.poolId === poolId && member.profileId === data.currentUserId && member.role !== "steward")) };
      persist(next);
    },
    createPool(input: Omit<Pool, "id" | "createdAt" | "recentActivityAt" | "stewardId">) {
      const pool: Pool = {
        ...input,
        id: `pool-${crypto.randomUUID()}`,
        stewardId: data.currentUserId,
        createdAt: new Date().toISOString(),
        recentActivityAt: new Date().toISOString()
      };
      persist({
        ...data,
        pools: [pool, ...data.pools],
        members: [{ poolId: pool.id, profileId: data.currentUserId, role: "steward", joinedAt: new Date().toISOString() }, ...data.members]
      });
      return pool;
    },
    updateProfile(profile: Profile) {
      persist({ ...data, profiles: data.profiles.map((item) => (item.id === profile.id ? profile : item)) });
    },
    addPost(poolId: string, body: string, imageUrl?: string) {
      const post: Post = { id: `post-${crypto.randomUUID()}`, poolId, authorId: data.currentUserId, body, imageUrl, createdAt: new Date().toISOString() };
      persist({ ...data, posts: [post, ...data.posts], pools: data.pools.map((pool) => (pool.id === poolId ? { ...pool, recentActivityAt: post.createdAt } : pool)) });
    },
    deletePost(postId: string) {
      persist({ ...data, posts: data.posts.filter((post) => post.id !== postId), comments: data.comments.filter((comment) => comment.postId !== postId) });
    },
    addComment(postId: string, body: string) {
      const comment: Comment = { id: `comment-${crypto.randomUUID()}`, postId, authorId: data.currentUserId, body, createdAt: new Date().toISOString() };
      persist({ ...data, comments: [...data.comments, comment] });
    },
    addUpdate(poolId: string, title: string, body: string) {
      const update: MissionUpdate = { id: `update-${crypto.randomUUID()}`, poolId, authorId: data.currentUserId, title, body, createdAt: new Date().toISOString() };
      persist({ ...data, updates: [update, ...data.updates] });
    },
    submitOutcome(poolId: string, values: Pick<Outcome, "title" | "description" | "category" | "date" | "externalLink">) {
      const outcome: Outcome = {
        ...values,
        id: `outcome-${crypto.randomUUID()}`,
        poolId,
        submitterId: data.currentUserId,
        memberIds: [data.currentUserId],
        status: "pending",
        createdAt: new Date().toISOString()
      };
      persist({ ...data, outcomes: [outcome, ...data.outcomes] });
    },
    setOutcomeStatus(outcomeId: string, status: Outcome["status"]) {
      persist({ ...data, outcomes: data.outcomes.map((outcome) => (outcome.id === outcomeId ? { ...outcome, status } : outcome)) });
    },
    removeMember(poolId: string, profileId: string) {
      persist({ ...data, members: data.members.filter((member) => !(member.poolId === poolId && member.profileId === profileId && member.role !== "steward")) });
    },
    makeModerator(poolId: string, profileId: string) {
      persist({ ...data, members: data.members.map((member) => (member.poolId === poolId && member.profileId === profileId ? { ...member, role: "moderator" } : member)) });
    },
    sendMessage(conversationId: string, body: string) {
      const message: Message = { id: `message-${crypto.randomUUID()}`, conversationId, senderId: data.currentUserId, body, createdAt: new Date().toISOString() };
      persist({
        ...data,
        messages: [...data.messages, message],
        conversations: data.conversations.map((conversation) => (conversation.id === conversationId ? { ...conversation, updatedAt: message.createdAt } : conversation))
      });
    },
    startConversation(profileId: string) {
      const existing = data.conversations.find((conversation) => conversation.memberIds.includes(profileId) && conversation.memberIds.includes(data.currentUserId));
      if (existing) return existing;
      const conversation: Conversation = { id: `conversation-${crypto.randomUUID()}`, memberIds: [data.currentUserId, profileId], updatedAt: new Date().toISOString() };
      persist({ ...data, conversations: [conversation, ...data.conversations] });
      return conversation;
    }
  }), [data]);
}

export const categories: Array<Category | "All"> = ["All", "Technology", "Education", "Environment", "Health", "Finance", "Community", "Culture"];
