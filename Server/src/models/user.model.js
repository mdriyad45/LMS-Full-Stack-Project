const mongoose = require('mongoose');
const argon2 = require('argon2')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true, 
    },
    role: {
        type: String,
        default: 'student'
    }
},{
    timestamps: true
})

userSchema.pre('save', async(next)=>{
    if(this.isModified('password')){
        try {
            this.password = await argon2.hash(this.password);
        } catch (error) {
            return next(error.message);
        }
    }
})

userSchema.methods.comparePassword = async (cadidatePassword)=>{
    try {
        return await argon2.verify(this.password, cadidatePassword)
    } catch (error) {
        throw error.message
    }
}

userSchema.index({userName: 'text'});
module.exports = mongoose.model('User',userSchema);


