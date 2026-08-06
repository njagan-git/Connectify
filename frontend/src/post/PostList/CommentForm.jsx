import { useState } from "react";
import axios from "axios";

function CommentForm({ postId, onCommentAdded }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const res = await axios.post(
  `http://localhost:3000/posts/${postId}/comments`,
  { text },
  {
    withCredentials: true
  }
);
      onCommentAdded(res.data); // updated comments array from server
      setText("");
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" disabled={submitting || !text.trim()}>
        Post
      </button>
    </form>
  );
}

export default CommentForm;