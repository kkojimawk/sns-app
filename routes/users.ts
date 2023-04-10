import { Router } from "express";
import User from "../models/User";

const router = Router();

//CRUD
//ユーザー情報の更新
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json("アカウント情報を更新しました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分のアカウントのみ編集できます");
  }
});

//ユーザー情報の削除
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("アカウントを削除しました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分のアカウントのみ削除できます");
  }
});

//ユーザー情報の取得
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const userObject = user.toObject();
      const { password, updatedAt, ...other } = userObject;
      res.status(200).json(other);
    } else {
      res.status(404).json("ユーザーが見つかりません");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //フォローしていない場合
      if (!user?.followers.includes(req.body.userId)) {
        await user?.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser?.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("ユーザーをフォローしました");
      } else {
        return res.status(403).json("すでにフォローしています");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分をフォローすることはできません");
  }
});

//ユーザーのフォロー解除
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //フォロワーに存在したらフォローを外す
      if (user?.followers.includes(req.body.userId)) {
        await user?.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        await currentUser?.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォロー解除しました");
      } else {
        return res.status(403).json("このユーザーはフォロー解除できません");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分をフォロー解除することはできません");
  }
});

export default router;
