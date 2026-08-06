import { useForm } from 'react-hook-form';
import validationPost from './valiadationPost';
import { useNavigate } from "react-router-dom";
import axios from "axios";


import "./CreatePost.css";

function CreatePost() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({});

  async function submitAction(data) {

    data.hashtags = data.hashtags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

    data.images = {
        url: data.images
    };
     const response = await axios.post(
            "http://localhost:3000/posts",
            data
        );
    console.log(data);
    reset()
    navigate("/posts")
}

  return (
    <div className="create-post-wrap">
      <div className="create-post-card">
        <h1 className="create-post-title">Create a New Post</h1>

        <form className="create-post-form" onSubmit={handleSubmit(submitAction)}>
          <div className="form-group">
            <label htmlFor="caption">Caption For Post :</label>
            <input
              type="text"
              id="caption"
              placeholder="Write a caption..."
              {...register("caption", validationPost.caption)}
            />
            {errors.caption && (
              <p className="field-error">{errors.caption.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="images">Images For Post :</label>
            <input
              type="text"
              id="images"
              placeholder="Image URL..."
              {...register("images", validationPost.images)}
            />
            {errors.images && (
              <p className="field-error">{errors.images.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="hashtags">Hashtags For Post :</label>
            <input
              type="text"
              id="hashtags"
              placeholder="#travel #food ..."
              {...register("hashtags", validationPost.hashtags)}
            />
            {errors.hashtags && (
              <p className="field-error">{errors.hashtags.message}</p>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;