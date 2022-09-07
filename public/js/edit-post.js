//ALLOWS USER TO EDIT THEIR POST WITH THE INFORMATION THEY PROVIDED

async function editFormHandler(event) {
  event.preventDefault();
  const title = document.querySelector("#post-title").value.trim();
  const postText = document.querySelector("#post-text").value.trim();
  const postId = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];
  await fetch(`/api/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      postText,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

document
  .querySelector(".edit-post-form")
  .addEventListener("submit", editFormHandler);
