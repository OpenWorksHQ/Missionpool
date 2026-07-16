"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { Award, MessageCircle, Milestone, ShieldCheck, Trash2, UserMinus, UserPlus } from "lucide-react";
import { Field } from "@/components/forms";
import { useMissionData } from "@/lib/store";
import type { Outcome, Profile } from "@/lib/types";
import { AvatarStack, ButtonLink, Card, EmptyState, GhostButton, IconButton, PageContainer, PrimaryButton, SearchInput, SecondaryButton, Select, StatusPill, TabBar, TextArea, TextInput } from "@/components/ui";

const tabs = ["Live Pool", "Members", "Mission Updates", "From This Pool", "About and Rules"] as const;
const outcomeCategories: Outcome["category"][] = ["Team formed", "Company created", "Product launched", "Funding raised", "Research published", "Event completed", "Goal reached", "Other"];

const heroImages: Record<string, string> = {
  "build-the-next-apple": "/images/mission-next-apple.png"
};

export default function PoolPage() {
  const { slug } = useParams<{ slug: string }>();
  const store = useMissionData();
  const { data } = store;
  const [tab, setTab] = useState<(typeof tabs)[number]>("Live Pool");
  const [memberQuery, setMemberQuery] = useState("");
  const pool = data.pools.find((item) => item.slug === slug);
  if (!pool) return notFound();
  const poolId = pool.id;

  const poolMembers = data.members.filter((member) => member.poolId === poolId);
  const memberProfiles = poolMembers.map((member) => data.profiles.find((profile) => profile.id === member.profileId)!).filter(Boolean);
  const currentMembership = poolMembers.find((member) => member.profileId === data.currentUserId);
  const isSteward = pool.stewardId === data.currentUserId;
  const canModerate = isSteward || currentMembership?.role === "moderator";
  const canReadPrivate = !pool.isPrivate || Boolean(currentMembership);
  const posts = data.posts.filter((post) => post.poolId === poolId).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const updates = data.updates.filter((update) => update.poolId === poolId);
  const outcomes = data.outcomes.filter((outcome) => outcome.poolId === poolId);
  const approvedOutcomes = outcomes.filter((outcome) => outcome.status === "approved");
  const normalizedMemberQuery = memberQuery.toLowerCase();
  const filteredMembers = memberProfiles.filter((profile) => [profile.name, profile.canDo, profile.wantsToBuild, profile.lookingFor, profile.location, profile.availability].join(" ").toLowerCase().includes(normalizedMemberQuery));
  const steward = data.profiles.find((profile) => profile.id === pool.stewardId)!;

  function addPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = String(form.get("body") || "").trim();
    const imageUrl = String(form.get("imageUrl") || "").trim();
    if (!body || !currentMembership) return;
    store.addPost(poolId, body, imageUrl || undefined);
    event.currentTarget.reset();
  }

  function addUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const body = String(form.get("body") || "").trim();
    if (!title || !body || !canModerate) return;
    store.addUpdate(poolId, title, body);
    event.currentTarget.reset();
  }

  function submitOutcome(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.submitOutcome(poolId, {
      title: String(form.get("title") || ""),
      description: String(form.get("description") || ""),
      category: String(form.get("category")) as Outcome["category"],
      date: String(form.get("date") || new Date().toISOString().slice(0, 10)),
      externalLink: String(form.get("externalLink") || "")
    });
    event.currentTarget.reset();
  }

  return (
    <PageContainer>
      <div className="pool-hero">
        <Image className="pool-hero-image" src={heroImages[pool.slug] ?? pool.coverUrl} alt="" fill priority sizes="100vw" />
        <div className="pool-hero-overlay" />
        <div className="pool-hero-content">
          <div className="pool-hero-copy">
            <div className="pool-pill-row">
              <StatusPill tone="green">{pool.category}</StatusPill>
              <StatusPill>{pool.location}</StatusPill>
              {pool.isPrivate ? <StatusPill tone="amber">Private</StatusPill> : <StatusPill tone="blue">Open mission</StatusPill>}
            </div>
            <h1>{pool.title}</h1>
            <p>{pool.summary}</p>
            <div className="pool-action-row">
              {isSteward ? (
                <span className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-black text-navy">Steward</span>
              ) : currentMembership ? (
                <SecondaryButton onClick={() => store.leavePool(pool.id)}>Leave Pool</SecondaryButton>
              ) : pool.isPrivate ? (
                <PrimaryButton>Request Access</PrimaryButton>
              ) : (
                <PrimaryButton onClick={() => store.joinPool(pool.id)}>Join Pool</PrimaryButton>
              )}
              {isSteward ? <ButtonLink href={`/pool/${pool.slug}/edit`} variant="secondary">Edit Pool</ButtonLink> : null}
              <div className="pool-member-count">
                <AvatarStack profiles={memberProfiles} size={30} />
                <span className="text-sm font-black">{poolMembers.length.toLocaleString()} members</span>
              </div>
            </div>
          </div>
          <Card className="pool-steward-card">
            <p className="pool-card-eyebrow">Steward</p>
            <ProfileMini profile={steward} light />
            <div className="pool-status-box">
              <p className="pool-card-eyebrow">Your status</p>
              <p className="pool-status-value">{currentMembership ? currentMembership.role : "Not joined"}</p>
              <p className="pool-status-copy">Members own their independent collaborations. Stewards keep the pool focused and verify outcomes.</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="pool-body-grid">
        <main className="min-w-0">
          <TabBar tabs={tabs} active={tab} onChange={setTab} />
          {!canReadPrivate ? (
            <EmptyState title="Private pool" text="Request access to view member activity." />
          ) : tab === "Live Pool" ? (
            <LivePool data={data} posts={posts} canModerate={canModerate} currentMembership={Boolean(currentMembership)} addPost={addPost} addComment={(postId, body) => store.addComment(postId, body)} deletePost={(postId) => store.deletePost(postId)} />
          ) : tab === "Members" ? (
            <MembersPanel profiles={filteredMembers} poolMembers={poolMembers} memberQuery={memberQuery} setMemberQuery={setMemberQuery} canModerate={canModerate} makeModerator={(profileId) => store.makeModerator(poolId, profileId)} removeMember={(profileId) => store.removeMember(poolId, profileId)} />
          ) : tab === "Mission Updates" ? (
            <UpdatesPanel updates={updates} profiles={data.profiles} canModerate={canModerate} addUpdate={addUpdate} />
          ) : tab === "From This Pool" ? (
            <OutcomesPanel outcomes={outcomes} approvedOutcomes={approvedOutcomes} canModerate={canModerate} currentMembership={Boolean(currentMembership)} submitOutcome={submitOutcome} setOutcomeStatus={(id, status) => store.setOutcomeStatus(id, status)} profiles={data.profiles} />
          ) : (
            <AboutPanel description={pool.description} rules={pool.rules} />
          )}
        </main>

        <aside className="grid h-max gap-5">
          <Card className="p-5">
            <h2 className="text-lg font-black text-navy">Pool snapshot</h2>
            <div className="pool-snapshot-list">
              <Snapshot label="Members" value={poolMembers.length.toLocaleString()} />
              <Snapshot label="Posts" value={posts.length.toLocaleString()} />
              <Snapshot label="Updates" value={updates.length.toLocaleString()} />
              <Snapshot label="Verified outcomes" value={approvedOutcomes.length.toLocaleString()} />
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="text-lg font-black text-navy">Mission norms</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{pool.rules}</p>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}

function LivePool({ data, posts, canModerate, currentMembership, addPost, addComment, deletePost }: { data: ReturnType<typeof useMissionData>["data"]; posts: ReturnType<typeof useMissionData>["data"]["posts"]; canModerate: boolean; currentMembership: boolean; addPost: (event: React.FormEvent<HTMLFormElement>) => void; addComment: (postId: string, body: string) => void; deletePost: (postId: string) => void }) {
  return (
    <div className="mt-6 grid gap-5">
      {currentMembership ? (
        <Card className="p-5">
          <form onSubmit={addPost}>
            <Field label="Post to the pool">
              <TextArea name="body" placeholder="Share progress, a question, or an idea for this mission." />
            </Field>
            <Field label="Optional image URL" className="mt-4">
              <TextInput name="imageUrl" placeholder="https://images.unsplash.com/..." />
            </Field>
            <PrimaryButton className="mt-4" type="submit">Post to Pool</PrimaryButton>
          </form>
        </Card>
      ) : (
        <EmptyState title="Join to post" text="Public pool activity is visible, but posting is reserved for members." />
      )}
      {posts.length ? posts.map((post) => {
        const author = data.profiles.find((profile) => profile.id === post.authorId)!;
        const comments = data.comments.filter((comment) => comment.postId === post.id);
        return (
          <Card key={post.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <Link className="flex items-center gap-3" href={`/profile/${author.username}`}>
                <Image className="rounded-2xl object-cover" src={author.avatarUrl} alt={author.name} width={48} height={48} />
                <div>
                  <h3 className="font-black text-navy">{author.name}</h3>
                  <p className="text-xs font-bold text-muted">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </Link>
              {(post.authorId === data.currentUserId || canModerate) ? <IconButton label="Delete post" onClick={() => deletePost(post.id)}><Trash2 size={17} /></IconButton> : null}
            </div>
            <p className="mt-4 leading-7 text-navy/85">{post.body}</p>
            {post.imageUrl ? <Image className="mt-4 rounded-[20px] object-cover" src={post.imageUrl} alt="" width={850} height={360} /> : null}
            <div className="mt-5 grid gap-3 border-t border-line pt-4">
              {comments.map((comment) => {
                const commentAuthor = data.profiles.find((profile) => profile.id === comment.authorId)!;
                return <p key={comment.id} className="rounded-2xl bg-[#f7fafc] px-4 py-3 text-sm text-muted"><b className="text-navy">{commentAuthor.name}:</b> {comment.body}</p>;
              })}
              {currentMembership ? <CommentForm onSubmit={(body) => addComment(post.id, body)} /> : null}
            </div>
          </Card>
        );
      }) : <EmptyState title="No posts yet" text="Start the first conversation inside this pool." />}
    </div>
  );
}

function MembersPanel({ profiles, poolMembers, memberQuery, setMemberQuery, canModerate, makeModerator, removeMember }: { profiles: Profile[]; poolMembers: Array<{ profileId: string; role: string }>; memberQuery: string; setMemberQuery: (value: string) => void; canModerate: boolean; makeModerator: (profileId: string) => void; removeMember: (profileId: string) => void }) {
  return (
    <div className="mt-6">
      <SearchInput value={memberQuery} onChange={(event) => setMemberQuery(event.target.value)} placeholder="Search members by skills, goals, location..." />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {profiles.map((profile) => {
          const role = poolMembers.find((member) => member.profileId === profile.id)?.role;
          return (
            <Card key={profile.id} className="p-5">
              <div className="flex items-start gap-3">
                <Image className="rounded-2xl object-cover" src={profile.avatarUrl} alt={profile.name} width={56} height={56} />
                <div>
                  <Link className="font-black text-navy hover:underline" href={`/profile/${profile.username}`}>{profile.name}</Link>
                  <p className="mt-1 text-sm font-semibold text-muted">{profile.location} · {profile.availability}</p>
                  <div className="mt-2"><StatusPill tone={role === "steward" ? "dark" : role === "moderator" ? "blue" : "neutral"}>{role}</StatusPill></div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6"><b>Can do:</b> {profile.canDo}</p>
              <p className="mt-2 text-sm leading-6"><b>Wants:</b> {profile.wantsToBuild}</p>
              <p className="mt-2 text-sm leading-6"><b>Looking for:</b> {profile.lookingFor}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href="/messages" variant="secondary" className="h-10 px-4"><MessageCircle size={16} />Message</ButtonLink>
                {canModerate && role === "member" ? <SecondaryButton className="h-10 px-4" onClick={() => makeModerator(profile.id)}><ShieldCheck size={16} />Moderator</SecondaryButton> : null}
                {canModerate && role !== "steward" ? <GhostButton className="h-10 px-4" onClick={() => removeMember(profile.id)}><UserMinus size={16} />Remove</GhostButton> : null}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function UpdatesPanel({ updates, profiles, canModerate, addUpdate }: { updates: ReturnType<typeof useMissionData>["data"]["updates"]; profiles: Profile[]; canModerate: boolean; addUpdate: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="mt-6 grid gap-5">
      {canModerate ? (
        <Card className="p-5">
          <form onSubmit={addUpdate}>
            <Field label="Official update title"><TextInput name="title" /></Field>
            <Field label="Update body" className="mt-4"><TextArea name="body" /></Field>
            <PrimaryButton className="mt-4" type="submit">Publish Update</PrimaryButton>
          </form>
        </Card>
      ) : null}
      <div className="relative grid gap-4">
        {updates.map((update) => {
          const author = profiles.find((profile) => profile.id === update.authorId);
          return (
            <Card key={update.id} className="p-5">
              <div className="flex gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint text-navy"><Milestone size={20} /></div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill tone="blue">Official Mission Update</StatusPill>
                    <span className="text-xs font-bold text-muted">{new Date(update.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-black text-navy">{update.title}</h3>
                  <p className="mt-2 leading-7 text-muted">{update.body}</p>
                  {author ? <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-muted">Published by {author.name}</p> : null}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function OutcomesPanel({ outcomes, approvedOutcomes, canModerate, currentMembership, submitOutcome, setOutcomeStatus, profiles }: { outcomes: Outcome[]; approvedOutcomes: Outcome[]; canModerate: boolean; currentMembership: boolean; submitOutcome: (event: React.FormEvent<HTMLFormElement>) => void; setOutcomeStatus: (id: string, status: Outcome["status"]) => void; profiles: Profile[] }) {
  return (
    <div className="mt-6 grid gap-5">
      <div className="grid gap-3 md:grid-cols-4">
        {["Team formed", "Company created", "Product launched", "Funding raised"].map((item) => (
          <Card key={item} className="p-4">
            <p className="text-3xl font-black text-navy">{approvedOutcomes.filter((outcome) => outcome.category === item).length}</p>
            <p className="mt-1 text-sm font-black text-muted">{item}</p>
          </Card>
        ))}
      </div>
      {currentMembership ? (
        <Card className="p-5">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={submitOutcome}>
            <Field label="Outcome title"><TextInput name="title" /></Field>
            <Field label="Category"><Select name="category">{outcomeCategories.map((item) => <option key={item}>{item}</option>)}</Select></Field>
            <Field label="Date"><TextInput name="date" type="date" /></Field>
            <Field label="External link"><TextInput name="externalLink" /></Field>
            <Field label="Description" className="md:col-span-2"><TextArea name="description" /></Field>
            <PrimaryButton className="md:col-span-2" type="submit">Submit Outcome</PrimaryButton>
          </form>
        </Card>
      ) : null}
      {outcomes.map((outcome) => {
        const involved = profiles.filter((profile) => outcome.memberIds.includes(profile.id));
        return (
          <Card key={outcome.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone="green">{outcome.category}</StatusPill>
                  <StatusPill tone={outcome.status === "approved" ? "blue" : outcome.status === "pending" ? "amber" : "neutral"}>{outcome.status}</StatusPill>
                </div>
                <h3 className="mt-3 text-xl font-black text-navy">{outcome.title}</h3>
              </div>
              {canModerate && outcome.status === "pending" ? (
                <div className="flex gap-2">
                  <SecondaryButton className="h-10 px-4" onClick={() => setOutcomeStatus(outcome.id, "approved")}>Approve</SecondaryButton>
                  <GhostButton className="h-10 px-4" onClick={() => setOutcomeStatus(outcome.id, "rejected")}>Reject</GhostButton>
                </div>
              ) : null}
            </div>
            <p className="mt-3 leading-7 text-muted">{outcome.description}</p>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-4">
              <div className="flex items-center gap-3">
                <Award size={18} className="text-muted" />
                <span className="text-sm font-bold text-muted">{new Date(outcome.date).toLocaleDateString()}</span>
              </div>
              <AvatarStack profiles={involved} size={30} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function AboutPanel({ description, rules }: { description: string; rules: string }) {
  return (
    <div className="mt-6 grid gap-5">
      <Card className="p-6">
        <h2 className="text-xl font-black text-navy">Mission overview</h2>
        <p className="mt-3 leading-7 text-muted">{description}</p>
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-black text-navy">Rules</h2>
        <p className="mt-3 leading-7 text-muted">{rules}</p>
      </Card>
    </div>
  );
}

function CommentForm({ onSubmit }: { onSubmit: (body: string) => void }) {
  const [body, setBody] = useState("");
  return (
    <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(event) => {
      event.preventDefault();
      if (!body.trim()) return;
      onSubmit(body.trim());
      setBody("");
    }}>
      <TextInput value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write a comment..." />
      <PrimaryButton type="submit">Reply</PrimaryButton>
    </form>
  );
}

function ProfileMini({ profile, light = false }: { profile: { name: string; username: string; avatarUrl: string; bio: string }; light?: boolean }) {
  return (
    <Link className="mt-4 flex items-start gap-3" href={`/profile/${profile.username}`}>
      <Image className="rounded-2xl object-cover" src={profile.avatarUrl} alt={profile.name} width={50} height={50} />
      <div>
        <h3 className={`font-black ${light ? "text-white" : "text-navy"}`}>{profile.name}</h3>
        <p className={`text-sm leading-6 ${light ? "text-white/72" : "text-muted"}`}>{profile.bio}</p>
      </div>
    </Link>
  );
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return (
    <div className="pool-snapshot-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
