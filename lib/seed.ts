import type { AppData, Pool, Profile } from "@/lib/types";

const avatar = (seed: string) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=160&q=80`;

export const profiles: Profile[] = [
  {
    id: "user-maya",
    name: "Maya Chen",
    username: "maya",
    avatarUrl: avatar("photo-1494790108377-be9c29b29330"),
    bio: "Product designer and community builder focused on ambitious consumer tools.",
    canDo: "Product strategy, UX systems, early customer discovery",
    wantsToBuild: "Useful technology that feels personal and humane",
    lookingFor: "Engineers, hardware tinkerers, and sharp storytellers",
    availability: "Weeknights and Saturdays",
    commitment: "5-10 hours/week",
    location: "San Francisco, CA",
    links: ["https://maya.example", "https://dribbble.com"],
    joinedPoolIds: ["pool-apple", "pool-transport", "pool-hardware"]
  },
  {
    id: "user-jules",
    name: "Jules Martin",
    username: "jules",
    avatarUrl: avatar("photo-1500648767791-00dcc994a43e"),
    bio: "Full-stack engineer who likes building useful prototypes quickly.",
    canDo: "Next.js, Supabase, payments, data modeling",
    wantsToBuild: "Open infrastructure for independent builders",
    lookingFor: "Mission-driven designers and domain experts",
    availability: "Two evenings weekly",
    commitment: "Part-time collaborator",
    location: "Austin, TX",
    links: ["https://github.com"],
    joinedPoolIds: ["pool-apple", "pool-education", "pool-hardware"]
  },
  {
    id: "user-amara",
    name: "Amara Okafor",
    username: "amara",
    avatarUrl: avatar("photo-1531123897727-8f129e1688ce"),
    bio: "Climate organizer and operations lead.",
    canDo: "Partnerships, field programs, fundraising",
    wantsToBuild: "Local clean energy coalitions with measurable outcomes",
    lookingFor: "Policy people, engineers, and municipal partners",
    availability: "Flexible",
    commitment: "10+ hours/week",
    location: "Remote",
    links: ["https://linkedin.com"],
    joinedPoolIds: ["pool-clean-energy", "pool-community"]
  },
  {
    id: "user-noah",
    name: "Noah Rivera",
    username: "noah",
    avatarUrl: avatar("photo-1507003211169-0a1dd7228f2d"),
    bio: "Urban planner and transit researcher.",
    canDo: "Mobility research, maps, policy writing",
    wantsToBuild: "Cleaner streets and better short-distance transit",
    lookingFor: "City operators and civic hackers",
    availability: "Weekends",
    commitment: "Project sprints",
    location: "Brooklyn, NY",
    links: ["https://medium.com"],
    joinedPoolIds: ["pool-transport", "pool-community"]
  },
  {
    id: "user-eli",
    name: "Eli Foster",
    username: "eli",
    avatarUrl: avatar("photo-1519085360753-af0119f7cbe7"),
    bio: "Educator exploring learner-owned institutions.",
    canDo: "Curriculum, facilitation, research synthesis",
    wantsToBuild: "Decentralized learning communities",
    lookingFor: "Teachers, technologists, and policy experts",
    availability: "Afternoons",
    commitment: "Advisory plus workshops",
    location: "Chicago, IL",
    links: ["https://substack.com"],
    joinedPoolIds: ["pool-education"]
  }
];

export const pools: Pool[] = [
  {
    id: "pool-apple",
    title: "Build the Next Apple",
    slug: "build-the-next-apple",
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    summary: "Reimagine the future of consumer technology.",
    description: "A pool for builders exploring enduring consumer products: hardware, software, services, brand, retail, and the taste needed to make technology feel inevitable.",
    category: "Technology",
    location: "Remote",
    isPrivate: false,
    rules: "Build in public with respect. Share real progress. No recruiting spam or stealth fundraising pitches.",
    stewardId: "user-maya",
    createdAt: "2026-04-12T12:00:00Z",
    recentActivityAt: "2026-07-15T16:20:00Z"
  },
  {
    id: "pool-education",
    title: "Decentralize Education",
    slug: "decentralize-education",
    coverUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    summary: "Build learner-owned tools and institutions.",
    description: "Teachers, technologists, parents, researchers, and learners designing education that travels with the person instead of the institution.",
    category: "Education",
    location: "Remote",
    isPrivate: false,
    rules: "No credential scams. Cite claims. Keep student privacy sacred.",
    stewardId: "user-eli",
    createdAt: "2026-05-03T12:00:00Z",
    recentActivityAt: "2026-07-14T09:11:00Z"
  },
  {
    id: "pool-clean-energy",
    title: "Clean Energy Everywhere",
    slug: "clean-energy-everywhere",
    coverUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
    summary: "Turn clean energy ideas into local deployments.",
    description: "A practical pool for energy builders, organizers, installers, and policy experts moving from good ideas to visible adoption.",
    category: "Environment",
    location: "Remote",
    isPrivate: false,
    rules: "Share evidence, respect local context, and avoid greenwashing.",
    stewardId: "user-amara",
    createdAt: "2026-03-18T12:00:00Z",
    recentActivityAt: "2026-07-13T18:42:00Z"
  },
  {
    id: "pool-hardware",
    title: "Open Source Hardware",
    slug: "open-source-hardware",
    coverUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    summary: "Make physical technology easier to inspect, repair, and improve.",
    description: "Engineers, designers, and manufacturers collaborating around repairable devices, open tooling, and transparent supply chains.",
    category: "Technology",
    location: "Remote",
    isPrivate: false,
    rules: "Document generously. Respect licenses. No unsafe build instructions.",
    stewardId: "user-jules",
    createdAt: "2026-06-01T12:00:00Z",
    recentActivityAt: "2026-07-15T08:05:00Z"
  },
  {
    id: "pool-transport",
    title: "Reinvent Urban Transportation",
    slug: "reinvent-urban-transportation",
    coverUrl: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1200&q=80",
    summary: "Make city movement cleaner, safer, and easier.",
    description: "Transit riders, planners, operators, and product builders shaping better urban movement without pretending one tool fixes every city.",
    category: "Community",
    location: "New York, NY",
    isPrivate: false,
    rules: "No city-bashing. Bring data when possible. Center accessibility.",
    stewardId: "user-noah",
    createdAt: "2026-02-24T12:00:00Z",
    recentActivityAt: "2026-07-12T14:30:00Z"
  },
  {
    id: "pool-community",
    title: "Restore a Community Recreation Center",
    slug: "restore-a-community-recreation-center",
    coverUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    summary: "Help a neighborhood space reopen and thrive.",
    description: "Residents, builders, fundraisers, and program leaders coordinating around one community building and many independent efforts that support it.",
    category: "Community",
    location: "Detroit, MI",
    isPrivate: true,
    rules: "Respect residents first. No outside savior narratives. Publish budgets clearly.",
    stewardId: "user-amara",
    createdAt: "2026-04-29T12:00:00Z",
    recentActivityAt: "2026-07-11T11:22:00Z"
  }
];

export const seedData: AppData = {
  profiles,
  pools,
  members: [
    { poolId: "pool-apple", profileId: "user-maya", role: "steward", joinedAt: "2026-04-12T12:00:00Z" },
    { poolId: "pool-apple", profileId: "user-jules", role: "member", joinedAt: "2026-04-18T12:00:00Z" },
    { poolId: "pool-apple", profileId: "user-noah", role: "member", joinedAt: "2026-05-02T12:00:00Z" },
    { poolId: "pool-education", profileId: "user-eli", role: "steward", joinedAt: "2026-05-03T12:00:00Z" },
    { poolId: "pool-education", profileId: "user-jules", role: "member", joinedAt: "2026-05-09T12:00:00Z" },
    { poolId: "pool-clean-energy", profileId: "user-amara", role: "steward", joinedAt: "2026-03-18T12:00:00Z" },
    { poolId: "pool-hardware", profileId: "user-jules", role: "steward", joinedAt: "2026-06-01T12:00:00Z" },
    { poolId: "pool-hardware", profileId: "user-maya", role: "member", joinedAt: "2026-06-02T12:00:00Z" },
    { poolId: "pool-transport", profileId: "user-noah", role: "steward", joinedAt: "2026-02-24T12:00:00Z" },
    { poolId: "pool-transport", profileId: "user-maya", role: "member", joinedAt: "2026-03-04T12:00:00Z" },
    { poolId: "pool-community", profileId: "user-amara", role: "steward", joinedAt: "2026-04-29T12:00:00Z" },
    { poolId: "pool-community", profileId: "user-noah", role: "moderator", joinedAt: "2026-05-11T12:00:00Z" }
  ],
  posts: [
    { id: "post-1", poolId: "pool-apple", authorId: "user-maya", body: "Opening a thread for people exploring personal hardware plus AI. What would you build if the phone was not the center?", createdAt: "2026-07-15T16:20:00Z" },
    { id: "post-2", poolId: "pool-apple", authorId: "user-jules", body: "I can prototype a small companion app this weekend if someone wants to pair on interaction design.", createdAt: "2026-07-15T17:02:00Z" },
    { id: "post-3", poolId: "pool-clean-energy", authorId: "user-amara", body: "Collected three municipal grant templates. I added notes on which ones work for battery pilots.", createdAt: "2026-07-13T18:42:00Z" },
    { id: "post-4", poolId: "pool-transport", authorId: "user-noah", body: "Looking for people who have interviewed delivery cyclists about curb access.", createdAt: "2026-07-12T14:30:00Z" }
  ],
  comments: [
    { id: "comment-1", postId: "post-1", authorId: "user-noah", body: "A wearable that keeps the phone tucked away would be worth exploring.", createdAt: "2026-07-15T17:10:00Z" },
    { id: "comment-2", postId: "post-2", authorId: "user-maya", body: "I can sketch a two-screen flow tonight.", createdAt: "2026-07-15T17:18:00Z" }
  ],
  updates: [
    { id: "update-1", poolId: "pool-apple", authorId: "user-maya", title: "1,000 builders joined", body: "The pool crossed its first major member milestone and the directory is now active.", createdAt: "2026-07-08T12:00:00Z" },
    { id: "update-2", poolId: "pool-clean-energy", authorId: "user-amara", title: "Pilot meetup announced", body: "A remote working session for community solar deployment plans is scheduled for next Thursday.", createdAt: "2026-07-10T12:00:00Z" },
    { id: "update-3", poolId: "pool-education", authorId: "user-eli", title: "Research map published", body: "Members gathered 42 examples of learner-owned credential systems.", createdAt: "2026-07-06T12:00:00Z" }
  ],
  outcomes: [
    { id: "outcome-1", poolId: "pool-apple", submitterId: "user-jules", title: "Tiny Tools working group formed", description: "Five members started a research group on small, focused personal devices.", category: "Team formed", date: "2026-07-05", memberIds: ["user-maya", "user-jules"], status: "approved", createdAt: "2026-07-05T12:00:00Z" },
    { id: "outcome-2", poolId: "pool-clean-energy", submitterId: "user-amara", title: "Neighborhood battery pilot funded", description: "A local coalition secured initial funding for a resilience pilot.", category: "Funding raised", date: "2026-06-28", memberIds: ["user-amara"], externalLink: "https://example.com", status: "approved", createdAt: "2026-06-28T12:00:00Z" },
    { id: "outcome-3", poolId: "pool-hardware", submitterId: "user-maya", title: "Repairable keyboard prototype", description: "A member submitted a modular keyboard concept for verification.", category: "Product launched", date: "2026-07-13", memberIds: ["user-maya", "user-jules"], status: "pending", createdAt: "2026-07-13T12:00:00Z" }
  ],
  conversations: [
    { id: "conversation-1", memberIds: ["user-maya", "user-jules"], updatedAt: "2026-07-15T18:00:00Z" },
    { id: "conversation-2", memberIds: ["user-maya", "user-noah"], updatedAt: "2026-07-14T13:00:00Z" }
  ],
  messages: [
    { id: "message-1", conversationId: "conversation-1", senderId: "user-jules", body: "Want to co-host the first personal hardware salon?", createdAt: "2026-07-15T17:44:00Z" },
    { id: "message-2", conversationId: "conversation-1", senderId: "user-maya", body: "Yes. Let’s keep it small and invite people who have shipped physical products.", createdAt: "2026-07-15T18:00:00Z" },
    { id: "message-3", conversationId: "conversation-2", senderId: "user-noah", body: "The transit pool could use your onboarding pattern.", createdAt: "2026-07-14T13:00:00Z" }
  ],
  currentUserId: "user-maya"
};
