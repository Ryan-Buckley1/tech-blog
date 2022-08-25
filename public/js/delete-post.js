async function deleteFormHandler(event) {
  event.preventDefault();

  const post_Id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];
  console.log(postId);
  await fetch(`/api/posts/${post_Id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

document
  .querySelector(".delete-post-btn")
  .addEventListener("click", deleteFormHandler);
