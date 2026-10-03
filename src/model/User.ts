import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },

    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "User name is required"],
        trim: true,
        lowercase: true,
        unique: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: true,
        match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,'Please use a valid email address']
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters long"]
    },
    verifyCode:{
        type: String,
        required: [true, "Verify Code is required"],
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, "Verify Code Expiry is required"],
    },
    isVerified:{
        type: Boolean,
        default: false 
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema) 

export default UserModel; 