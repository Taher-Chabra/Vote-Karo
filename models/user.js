const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   age: {
      type: Number,
      required: true
   },
   email: {
      type: String
   },
   mobile: {
      type: String
   },
   address: {
      type: String,
      required: true
   },
   aadharCardNumber: {
      type: Number,
      required: true,
      unique: true,
      validate: {
         validator: function(v) {
            return /^\d{12}$/.test(v);
         },
         message: props => `${props.value} is not a valid Aadhar card number!`
      }
   },
   password: {
      type: String,
      required: true
   },
   role: {
      type: String,
      enum: ['admin', 'voter'],
      default: 'voter'
   },
   isVoted: {
      type: Boolean,
      default: false
   }
})

userSchema.pre('save', async function(next) {
   const user = this;
   // If password is not modified, skip the hashing process
   if (!user.isModified('password')) return next();

   try {
      // Generate salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      // Replace the plain text password with the hashed password
      user.password = hashedPassword;
      next();
   } catch (error) {
      return next(error);
   }
});

//
userSchema.methods.comparePassword = async function(enteredPassword) {
   try {
      return await bcrypt.compare(enteredPassword, this.password);
   } catch (error) {
      throw error;
   }
}

const User = mongoose.model('User', userSchema);
module.exports = User;