export type Category =
  | "Technology"
  | "Education"
  | "Environment"
  | "Health"
  | "Finance"
  | "Community"
  | "Culture";

export type Profile = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  canDo: string;
  wantsToBuild: string;
  lookingFor: string;
  availability: string;
  commitment: string;
  location: string;
  links: string[];
  joinedPoolIds: string[];
};

export type Pool = {
  id: string;
  title: string;
  slug: string;
  coverUrl: string;
  summary: string;
  description: string;
  category: Category;
  location: string;
  isPrivate: boolean;
  rules: string;
  stewardId: string;
  createdAt: string;
  recentActivityAt: string;
};

export type PoolMember = {
  poolId: string;
  profileId: string;
  role: "member" | "moderator" | "steward";
  joinedAt: string;
};

export type Post = {
  id: string;
  poolId: string;
  authorId: string;
  body: string;
  imageUrl?: string;
  createdAt: string;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type MissionUpdate = {
  id: string;
  poolId: string;
  authorId: string;
  title: string;
  body: string;
  createdAt: string;
};

export type Outcome = {
  id: string;
  poolId: string;
  submitterId: string;
  title: string;
  description: string;
  category: "Team formed" | "Company created" | "Product launched" | "Funding raised" | "Research published" | "Event completed" | "Goal reached" | "Other";
  date: string;
  memberIds: string[];
  externalLink?: string;
  imageUrl?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type Conversation = {
  id: string;
  memberIds: string[];
  updatedAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export type AppData = {
  profiles: Profile[];
  pools: Pool[];
  members: PoolMember[];
  posts: Post[];
  comments: Comment[];
  updates: MissionUpdate[];
  outcomes: Outcome[];
  conversations: Conversation[];
  messages: Message[];
  currentUserId: string;
};
