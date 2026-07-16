"use client";

import Image from "next/image";
import { useState } from "react";
import { Field } from "@/components/forms";
import { useMissionData } from "@/lib/store";
import { ButtonLink, Card, PageContainer, PrimaryButton, TextArea, TextInput, Toast } from "@/components/ui";

export default function ProfilePage() {
  const { currentUser, updateProfile, data } = useMissionData();
  const [saved, setSaved] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateProfile({
      ...currentUser,
      name: String(form.get("name") || currentUser.name),
      username: String(form.get("username") || currentUser.username),
      avatarUrl: String(form.get("avatarUrl") || currentUser.avatarUrl),
      bio: String(form.get("bio") || ""),
      canDo: String(form.get("canDo") || ""),
      wantsToBuild: String(form.get("wantsToBuild") || ""),
      lookingFor: String(form.get("lookingFor") || ""),
      availability: String(form.get("availability") || ""),
      commitment: String(form.get("commitment") || ""),
      location: String(form.get("location") || ""),
      links: String(form.get("links") || "").split(",").map((link) => link.trim()).filter(Boolean)
    });
    setSaved(true);
  }

  const joinedPools = data.pools.filter((pool) => data.members.some((member) => member.profileId === currentUser.id && member.poolId === pool.id));

  return (
    <PageContainer size="narrow">
      <Card className="overflow-hidden p-0">
        <div className="bg-[#f7fafc] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <Image className="h-24 w-24 rounded-[24px] object-cover shadow-[0_16px_40px_rgba(7,17,31,0.12)]" src={currentUser.avatarUrl} alt={currentUser.name} width={96} height={96} />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">Your profile</p>
                <h1 className="mt-1 text-4xl font-black text-navy">{currentUser.name}</h1>
                <p className="mt-1 text-sm font-bold text-muted">@{currentUser.username} · {currentUser.location}</p>
              </div>
            </div>
            <ButtonLink href={`/profile/${currentUser.username}`} variant="secondary">View public profile</ButtonLink>
          </div>
        </div>

        <form className="grid gap-6 p-6 md:p-8" onSubmit={submit}>
          {saved ? <Toast onClose={() => setSaved(false)}>Profile saved.</Toast> : null}
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name"><TextInput name="name" defaultValue={currentUser.name} /></Field>
            <Field label="Username"><TextInput name="username" defaultValue={currentUser.username} /></Field>
            <Field label="Profile photo URL" className="md:col-span-2"><TextInput name="avatarUrl" defaultValue={currentUser.avatarUrl} /></Field>
            <Field label="Short biography" className="md:col-span-2"><TextArea name="bio" defaultValue={currentUser.bio} /></Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="What I can do"><TextArea name="canDo" defaultValue={currentUser.canDo} /></Field>
            <Field label="What I want to build"><TextArea name="wantsToBuild" defaultValue={currentUser.wantsToBuild} /></Field>
            <Field label="Who or what I am looking for"><TextArea name="lookingFor" defaultValue={currentUser.lookingFor} /></Field>
            <div className="grid gap-5">
              <Field label="Availability"><TextInput name="availability" defaultValue={currentUser.availability} /></Field>
              <Field label="Preferred commitment"><TextInput name="commitment" defaultValue={currentUser.commitment} /></Field>
              <Field label="Location"><TextInput name="location" defaultValue={currentUser.location} /></Field>
            </div>
            <Field label="Links to previous work" className="md:col-span-2"><TextInput name="links" defaultValue={currentUser.links.join(", ")} /></Field>
          </div>

          <div className="rounded-[22px] border border-line bg-[#fbfcfd] p-5">
            <h2 className="text-xl font-black text-navy">Joined pools</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {joinedPools.map((pool) => <ButtonLink key={pool.id} href={`/pool/${pool.slug}`} variant="secondary" className="h-10 px-4">{pool.title}</ButtonLink>)}
            </div>
          </div>

          <div className="flex justify-end">
            <PrimaryButton type="submit">Save Profile</PrimaryButton>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
