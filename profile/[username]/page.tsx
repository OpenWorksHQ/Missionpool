"use client";

import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import { MessageCircle, MapPin } from "lucide-react";
import { useMissionData } from "@/lib/store";
import { ButtonLink, Card, PageContainer, PrimaryButton, StatusPill } from "@/components/ui";

export default function PublicProfilePage() {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const store = useMissionData();
  const { data } = store;
  const profile = data.profiles.find((item) => item.username === username);
  if (!profile) notFound();
  const joinedPools = data.pools.filter((pool) => data.members.some((member) => member.profileId === profile.id && member.poolId === pool.id));

  return (
    <PageContainer>
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Card className="h-max p-6">
          <Image className="aspect-square w-full rounded-[26px] object-cover shadow-[0_18px_50px_rgba(7,17,31,0.12)]" src={profile.avatarUrl} alt={profile.name} width={320} height={320} />
          <div className="mt-6">
            <StatusPill tone="green">Mission member</StatusPill>
            <h1 className="mt-4 text-4xl font-black leading-tight text-navy">{profile.name}</h1>
            <p className="mt-1 text-sm font-bold text-muted">@{profile.username}</p>
            <p className="mt-4 flex items-center gap-2 text-sm font-bold text-muted"><MapPin size={16} />{profile.location}</p>
            <p className="mt-4 leading-7 text-muted">{profile.bio}</p>
          </div>
          <PrimaryButton className="mt-6 w-full" onClick={() => {
            store.startConversation(profile.id);
            router.push("/messages");
          }}>
            <MessageCircle size={17} /> Message
          </PrimaryButton>
        </Card>

        <div className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["What I can do", profile.canDo],
              ["What I want to build", profile.wantsToBuild],
              ["What I am looking for", profile.lookingFor],
              ["Availability", profile.availability],
              ["Preferred commitment", profile.commitment],
              ["Previous work", profile.links.join(", ")]
            ].map(([label, value]) => (
              <Card key={label} className="p-6">
                <h2 className="text-xs font-black uppercase tracking-[0.12em] text-muted">{label}</h2>
                <p className="mt-3 leading-7 text-navy">{value}</p>
              </Card>
            ))}
          </div>
          <Card className="p-6">
            <h2 className="text-xl font-black text-navy">Joined pools</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {joinedPools.map((pool) => <ButtonLink key={pool.id} href={`/pool/${pool.slug}`} variant="secondary" className="h-10 px-4">{pool.title}</ButtonLink>)}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
