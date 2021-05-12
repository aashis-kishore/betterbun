const mongoose = require('mongoose');
const { scryptSync, randomBytes } = require('crypto');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    minLength: 3,
    maxLength: 24,
    required: 'First name is required'
  },
  lastName: {
    type: String,
    minLength: 3,
    maxLength: 24
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    index: {
      unique: true
    },
    required: 'E-mail address is required'
  },
  password: {
    type: String,
    required: 'Password is required'
  },
  salt: {
    type: String
  }
}, { timestamps: true });

// Hash all passwords on save
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    console.log('User is not modified, skipping');
    return next();
  }

  this.salt = randomBytes(16).toString('hex');
  this.password = scryptSync(this.password, this.salt, 32).toString('hex');

  next();
});

// Compare passwords
UserSchema.methods.comparePassword = function (candidatePassword) {
  const cPassHash = scryptSync(candidatePassword, this.salt, 32)
    .toString('hex');

  return cPassHash === this.password;
};

module.exports = mongoose.model('User', UserSchema, 'users');
