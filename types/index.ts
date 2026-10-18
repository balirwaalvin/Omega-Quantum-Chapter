export type Role = "member" | "officer" | "admin";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  program: string;
  yearOfStudy: number;
  interests: string[];
  bio: string;
  role: Role;
  deactivated: boolean;
  /** Seeded directory fixtures. Role changes apply only to Clerk users. */
  sample: boolean;
  createdAt: string;
};

export type EventKind = "workshop" | "talk" | "meeting";

export type ChapterEvent = {
  id: string;
  title: string;
  description: string;
  kind: EventKind;
  startsAt: string;
  endsAt: string;
  location: string;
  published: boolean;
  createdBy: string;
};

export type RsvpStatus = "going" | "maybe";

export type Rsvp = {
  eventId: string;
  userId: string;
  status: RsvpStatus;
  createdAt: string;
};

export type AnnouncementPriority = "normal" | "high" | "urgent";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  priority: AnnouncementPriority;
  published: boolean;
  authorId: string;
  createdAt: string;
};

export type ResourceTopic =
  | "Fundamentals"
  | "Algorithms"
  | "Hardware"
  | "Applications";

export type ResourceKind = "article" | "video" | "link" | "pdf";

export type Resource = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  topic: ResourceTopic;
  kind: ResourceKind;
  url: string;
  body: string;
  published: boolean;
  views: number;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

export type Quiz = {
  id: string;
  title: string;
  topic: ResourceTopic;
  description: string;
  questions: QuizQuestion[];
  published: boolean;
};

export type PublicQuizQuestion = Omit<QuizQuestion, "correctIndex" | "explanation">;

export type PublicQuiz = Omit<Quiz, "questions"> & {
  questions: PublicQuizQuestion[];
};

export type QuizAttempt = {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  total: number;
  completedAt: string;
};

export type CommentTarget = "event" | "resource" | "project";
export type CommentStatus = "pending" | "approved" | "flagged";

export type Comment = {
  id: string;
  targetType: CommentTarget;
  targetId: string;
  userId: string;
  body: string;
  status: CommentStatus;
  createdAt: string;
};

export type ProjectStatus = "idea" | "active" | "done";

export type Project = {
  id: string;
  title: string;
  body: string;
  status: ProjectStatus;
  memberIds: string[];
  updatedAt: string;
};

export type Spotlight = {
  id: string;
  title: string;
  summary: string;
  href: string;
  active: boolean;
};

export type Database = {
  users: UserProfile[];
  events: ChapterEvent[];
  rsvps: Rsvp[];
  announcements: Announcement[];
  resources: Resource[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  comments: Comment[];
  projects: Project[];
  spotlights: Spotlight[];
};

export type ActivityLog = {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail?: string;
  actorRole: Role;
  action: string;
  category: "auth" | "event" | "quiz" | "resource" | "member" | "moderation" | "system";
  details: string;
};

export type Analytics = {
  totalMembers: number;
  activeMembers: number;
  rsvpCount: number;
  circuitSimulations: number;
  totalAnnouncements: number;
  pendingComments: number;
  departmentBreakdown: { department: string; count: number; percentage: number }[];
  popularResources: { id: string; title: string; views: number }[];
  quizCompletion: {
    quizId: string;
    title: string;
    completions: number;
    rate: number;
  }[];
};

export type AppSession = {
  userId: string;
  email: string;
  name: string;
  imageUrl: string;
  role: Role;
  deactivated: boolean;
  /** Clerk external-account providers, such as oauth_github. */
  providers: string[];
};
