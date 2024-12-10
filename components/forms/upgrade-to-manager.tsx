import { NextApiRequest, NextApiResponse } from "next";

import { User } from "../../models/User"; // Import User model

const updateUserGroup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { group } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.group = group;
    await user.save();

    res.status(200).json({ message: "User group updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default updateUserGroup;
