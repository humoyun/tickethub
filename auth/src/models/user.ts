import mongoose from 'mongoose';
import { Password } from '../utils/password';
// because of mongoose and TS does not cooperate well, type checking
interface UserProps {
  email: string;
  password: string;
  username?: string;
}

// define properties User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  username?: string;
  // updatedAt: Date
}

// extend default mongoose.Model
// we creating User model using only `{email, password}`
interface UserModel extends mongoose.Model<any> {
  build(props: UserProps): UserDoc
}


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done();
})

userSchema.statics.build = (props: UserProps) => {
  return new User(props);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User };