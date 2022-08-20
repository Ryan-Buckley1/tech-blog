const User = require("./User");
const Comment = require("./Comment");
const Post = require("./Post");

//associations

//User-Post

User.hasMany(Post);

Post.belongsTo(User);

//User-Comment

User.hasMany(Comment);

Comment.belongsTo(User);

//Post-Comment

Post.hasMany(Comment);

Comment.belongsTo(Post);

module.exports = { User, Comment, Post };
