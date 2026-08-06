function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p className="no-comments">No comments yet.</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((c) => (
        <div className="comment-item" key={c._id}>
            <strong>{c.author.username}</strong>{" "}
            <span className="comment-text">{c.text}</span>
        </div>
      ))}
    </div>
  );
}

export default CommentList;