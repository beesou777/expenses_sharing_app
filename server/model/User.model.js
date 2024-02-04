import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique Username!"],
        unique: [true, "Username exists!"]
    },
    password : {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false
    },
    email: {
        type: String,
        required: [true, "Please provide a unique email!"],
        unique: false
    },
    icon: {
        type: String
    },
    groupname: {
        type: String
    },
    members: [{
        memberid: {type: mongoose.ObjectId},
        membername: {type: String, required: true},
        membericon: {type: String}
    }],
    expenses: [{
        expenseid: {type: mongoose.ObjectId},
        category: {type: String, required: true},
        amount:{type: Number, required: true},
        date: {type: Date, required: true},
        description: {type: String, required: true},
        member: {type: String, required: true},
        isShared: {type: Boolean, require: true, default: false}
    }]
});

// export default mongoose.model('User', userSchema);
export default mongoose.model.Users || mongoose.model('User', userSchema);