import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt5NgZ4zm9lYsEj7HQo3AT-8opP0ccd6q6BLI8U3Z68Kf1w6bHypVdsFzOzXnsRCfcU4k&usqp=CAU'
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userActivation = mongoose.model('User', userSchema);

export default userActivation;
