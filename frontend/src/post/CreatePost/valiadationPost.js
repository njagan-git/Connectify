const validationPost = {
  caption: {
    maxLength: {
      value: 1000,
      message: "Caption can't exceed 1000 characters"
    }
  },

  images: {
    required: "Image URL is required",

  },

  // hashtags is validated manually via Controller (see HashtagInput),
  // since it's an array built from chips, not a raw text input
  hashtagsArray: {
    validate: (value) =>
      (value && value.length > 0) || "Add at least one hashtag"
  }
};

export default validationPost;