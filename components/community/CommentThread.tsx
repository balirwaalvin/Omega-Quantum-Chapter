import { addComment } from "@/lib/actions/community";
import type { Comment, CommentTarget, UserProfile } from "@/types";

export function CommentThread({
  comments,
  users,
  targetType,
  targetId,
  currentUserId,
  staff,
}: {
  comments: Comment[];
  users: UserProfile[];
  targetType: CommentTarget;
  targetId: string;
  currentUserId: string;
  staff: boolean;
}) {
  const names = new Map(users.map((user) => [user.id, user.name]));
  const visible = comments.filter(
    (comment) =>
      comment.status === "approved" || comment.userId === currentUserId || staff,
  );

  return (
    <section className="mt-8" aria-labelledby="discussion-heading">
      <h2 id="discussion-heading" className="text-lg font-semibold text-ucu-blue">
        Discussion
      </h2>
      <p className="mt-1 text-sm text-muted">
        New comments wait for an officer to approve them.
      </p>
      <ul className="mt-4 space-y-3">
        {visible.length === 0 ? <li className="text-sm text-muted">No comments yet.</li> : null}
        {visible.map((comment) => (
          <li key={comment.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-sm font-semibold text-ink">{names.get(comment.userId) ?? "Member"}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm">{comment.body}</p>
            {comment.status !== "approved" ? (
              <p className="mt-2 text-xs uppercase tracking-wide text-magenta">{comment.status}</p>
            ) : null}
          </li>
        ))}
      </ul>
      <form action={addComment} className="mt-4 grid gap-2">
        <input type="hidden" name="targetType" value={targetType} />
        <input type="hidden" name="targetId" value={targetId} />
        <label className="grid gap-1 text-sm font-medium" htmlFor={`comment-${targetId}`}>
          Add a comment
          <textarea id={`comment-${targetId}`} name="body" required rows={3} className="field" />
        </label>
        <button type="submit" className="btn w-fit">
          Submit for review
        </button>
      </form>
    </section>
  );
}
