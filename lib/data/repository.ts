import type {
  Analytics,
  Announcement,
  ChapterEvent,
  Comment,
  CommentStatus,
  CommentTarget,
  Database,
  Project,
  Quiz,
  QuizAttempt,
  Resource,
  ResourceTopic,
  Rsvp,
  Spotlight,
  UserProfile,
} from "@/types";

export interface Repository {
  listUsers(): Promise<UserProfile[]>;
  getUser(id: string): Promise<UserProfile | null>;
  upsertUser(user: UserProfile): Promise<UserProfile>;
  updateUser(
    id: string,
    patch: Partial<UserProfile>,
  ): Promise<UserProfile | null>;

  listEvents(publishedOnly?: boolean): Promise<ChapterEvent[]>;
  getEvent(id: string): Promise<ChapterEvent | null>;
  saveEvent(event: ChapterEvent): Promise<ChapterEvent>;
  deleteEvent(id: string): Promise<void>;

  listRsvps(eventId?: string): Promise<Rsvp[]>;
  setRsvp(rsvp: Rsvp): Promise<void>;

  listAnnouncements(publishedOnly?: boolean): Promise<Announcement[]>;
  saveAnnouncement(item: Announcement): Promise<Announcement>;
  deleteAnnouncement(id: string): Promise<void>;

  listResources(opts?: {
    publishedOnly?: boolean;
    topic?: ResourceTopic;
  }): Promise<Resource[]>;
  getResourceBySlug(slug: string): Promise<Resource | null>;
  getResource(id: string): Promise<Resource | null>;
  saveResource(item: Resource): Promise<Resource>;
  deleteResource(id: string): Promise<void>;
  incrementResourceViews(id: string): Promise<void>;

  listQuizzes(publishedOnly?: boolean): Promise<Quiz[]>;
  getQuiz(id: string): Promise<Quiz | null>;
  saveQuiz(quiz: Quiz): Promise<Quiz>;
  deleteQuiz(id: string): Promise<void>;

  listAttempts(userId?: string): Promise<QuizAttempt[]>;
  saveAttempt(attempt: QuizAttempt): Promise<QuizAttempt>;

  listComments(filter?: {
    targetType?: CommentTarget;
    targetId?: string;
    status?: CommentStatus;
  }): Promise<Comment[]>;
  saveComment(comment: Comment): Promise<Comment>;
  setCommentStatus(id: string, status: CommentStatus): Promise<void>;
  deleteComment(id: string): Promise<void>;

  listProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;
  saveProject(project: Project): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  listSpotlights(): Promise<Spotlight[]>;
  getActiveSpotlight(): Promise<Spotlight | null>;
  saveSpotlight(item: Spotlight): Promise<Spotlight>;

  stats(): Promise<Analytics>;
}

export type { Database };
