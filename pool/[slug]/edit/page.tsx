"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "@/components/forms";
import { saveData, useMissionData } from "@/lib/store";
import { ButtonLink, Card, PageContainer, PrimaryButton, SectionHeader, Select, TextArea, TextInput } from "@/components/ui";

export default function EditPoolPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const { data } = useMissionData();
  const pool = data.pools.find((item) => item.slug === slug);
  const [error, setError] = useState("");
  if (!pool) return notFound();
  const poolId = pool.id;
  const currentSlug = pool.slug;
  if (pool.stewardId !== data.currentUserId) {
    return (
      <PageContainer size="narrow">
        <Card className="p-8">
          <h1 className="text-3xl font-black text-navy">Steward controls only</h1>
          <p className="mt-2 text-muted">Only the pool steward can edit pool information.</p>
        </Card>
      </PageContainer>
    );
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextSlug = String(form.get("slug") || currentSlug).trim();
    if (data.pools.some((item) => item.id !== poolId && item.slug === nextSlug)) {
      setError("That slug is already in use.");
      return;
    }
    const next = {
      ...data,
      pools: data.pools.map((item) => item.id === poolId ? {
        ...item,
        title: String(form.get("title") || item.title),
        slug: nextSlug,
        coverUrl: String(form.get("coverUrl") || item.coverUrl),
        summary: String(form.get("summary") || item.summary),
        description: String(form.get("description") || item.description),
        location: String(form.get("location") || item.location),
        rules: String(form.get("rules") || item.rules),
        isPrivate: form.get("visibility") === "private"
      } : item)
    };
    saveData(next);
    window.dispatchEvent(new Event("mission-pool-updated"));
    router.push(`/pool/${nextSlug}`);
  }

  return (
    <PageContainer size="narrow">
      <SectionHeader eyebrow="Steward controls" title="Edit pool details." text="Keep the mission clear, trustworthy, and easy for the right people to understand." action={<ButtonLink href={`/pool/${pool.slug}`} variant="secondary">Back to pool</ButtonLink>} />
      <Card className="mt-8 p-6 md:p-7">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={submit}>
          <Field label="Mission title"><TextInput name="title" defaultValue={pool.title} /></Field>
          <Field label="URL slug"><TextInput name="slug" defaultValue={pool.slug} /></Field>
          <Field label="Cover image URL" className="md:col-span-2"><TextInput name="coverUrl" defaultValue={pool.coverUrl} /></Field>
          <Field label="Short summary" className="md:col-span-2"><TextInput name="summary" defaultValue={pool.summary} /></Field>
          <Field label="Description" className="md:col-span-2"><TextArea name="description" defaultValue={pool.description} /></Field>
          <Field label="Location"><TextInput name="location" defaultValue={pool.location} /></Field>
          <Field label="Visibility"><Select name="visibility" defaultValue={pool.isPrivate ? "private" : "public"}><option value="public">Public</option><option value="private">Private</option></Select></Field>
          <Field label="Rules" className="md:col-span-2"><TextArea name="rules" defaultValue={pool.rules} /></Field>
          {error ? <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-red-700 md:col-span-2">{error}</p> : null}
          <div className="flex justify-end md:col-span-2">
            <PrimaryButton type="submit">Save Changes</PrimaryButton>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
