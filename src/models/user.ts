import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "new",
  },
  posts: [{ type: Types.ObjectId, ref: "Post" }],
});

export default mongoose.model("User", userSchema);
