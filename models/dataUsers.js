const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true}
})

userSchema.pre('save', async function (next){
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.comparePassword = async function (passwordIngresado) {
    return await bcrypt.compare(passwordIngresado, this.password);
} 

module.exports = mongoose.model('user', userSchema);
