const User = require("./User");
const Comment = require("./Comment");
const Post = require("./Post");

//associations

//User-Post

User.hasMany(Post, {
  foreignKey: "userId",
});

Post.belongsTo(User, {
  foreignKey: "userId",
});

//User-Comment

User.hasMany(Comment, {
  foreignKey: "userId",
});

Comment.belongsTo(User, {
  foreignKey: "userId",
});

//Post-Comment

Post.hasMany(Comment);

Comment.belongsTo(Post);

module.exports = { User, Comment, Post };
