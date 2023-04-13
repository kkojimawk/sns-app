import { Router } from "express";
import Post from "../models/Post";
import User from "../models/User";

const router = Router();

//投稿を作成する
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//投稿を更新する
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post?.userId === req.body.userId) {
      await post?.updateOne({ $set: req.body });
      return res.status(200).json("投稿を更新しました");
    } else {
      return res.status(403).json("投稿を編集する権限がありません");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//投稿を削除する
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post?.userId === req.body.userId) {
      await post?.deleteOne();
      return res.status(200).json("投稿を削除しました");
    } else {
      return res.status(403).json("投稿を削除する権限がありません");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//特定の投稿を取得する
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//特定の投稿にいいねをする
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post?.likes.includes(req.body.userId)) {
      await post?.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json("いいねしました");
    } else {
      await post?.updateOne({ $pull: { likes: req.body.userId } });
      return res.status(200).json("いいねを取り消しました");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//タイムラインを取得する
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId).exec();
    const userPosts = await Post.find({ userId: currentUser?._id }).exec();
    //自分のフォローしているユーザーの投稿を取得する
    const friendPosts = await Promise.all(
      currentUser?.followings.map((friendId) => {
        return Post.find({ userId: friendId }).exec();
      }) ?? []
    );
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
