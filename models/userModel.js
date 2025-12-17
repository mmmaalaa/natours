import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userRoles = {
  user: 'user',
  guide: 'guide',
  leadGuide: 'lead-guide',
  admin: 'admin',
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'Please provide an email'],
    unique: true,
    validate: {
      validator: function (v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: 'Email format is invalid (example: name@example.com)',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select:false,
    validate: {
      validator: function (v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          v
        );
      },
      message:
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@ $ ! % * ? &)',
    },
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: Object.values(userRoles),
    default: userRoles.user,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, +process.env.HASHING_SALT);
});
userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000;
});
userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.createJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  console.log(resetToken);
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
const User = mongoose.model('User', userSchema);

export default User;
