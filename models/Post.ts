import mongoose, { Schema, Document } from "mongoose";

interface IPost extends Document {
  userId: string;
  desc: string;
  img: string;
  likes: string[];
}

const PostSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
