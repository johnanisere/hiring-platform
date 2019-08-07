import User from '../models/User';

export default async function updatePassword(req: any, res: any) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send('User not found!!!');
    } else {
      user.password = req.body.newPassword;
      const updated = await user.save();
      return res.status(200).send({
        message: 'Password updated',
        updated: {
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
        },
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: 'Password update failed!!!',
    });
  }
}
