const mongoose = require("mongoose");
const posts = new mongoose.Schema(
    {
        name: String,
        id: String,
        timestamp: String,
        title: String,
        content: String,
        filter: Number,
        likes: {
            type: Map,
            of: String,
            default: new Map()
        },
        dislikes: {
            type: Map,
            of: String,
            default: new Map()
        },
        comments: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        }
    },
    {
        collection: "posts_data",
    }
);

mongoose.model("posts_data", posts)