import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function () {
            return !this.githubId; // Password not required for GitHub OAuth
        }
    },
    avatar: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        maxlength: 500
    },
    skills: [{
        type: String,
        trim: true
    }],
    githubId: {
        type: String,
        sparse: true
    },
    githubURL: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    followers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    following: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    socialLinks: {
        twitter: String,
        linkedin: String,
        portfolio: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for follower count
userSchema.virtual('followerCount').get(function () {
    return this.followers.length;
});

// Virtual for following count
userSchema.virtual('followingCount').get(function () {
    return this.following.length;
});

export default mongoose.model('User', userSchema);