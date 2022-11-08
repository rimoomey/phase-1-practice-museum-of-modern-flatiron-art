function displayExhibit() {
  fetch("http://localhost:3000/current-exhibits")
    .then((response) => response.json())
    .then((data) => {
      exhibit0 = data[0];
      console.log(exhibit0)
      const title = document.getElementById("exhibit-title");
      title.textContent = exhibit0.title;

      const image = document.getElementById("exhibit-image");
      image.src = exhibit0.image;

      const description = document.getElementById("exhibit-description");
      description.textContent = exhibit0.description;

      const ticketsBoughtContainer = document.querySelector("#tickets-bought");
      ticketsBoughtContainer.textContent = `${exhibit0["tickets_bought"]} Tickets Bought`;
    });
}

function allowComments() {
  const comments = [];
  const commentForm = document.querySelector("#comment-form");
  const commentZone = document.querySelector(".comments-container");

  //adding what's in the database
  fetch("http://localhost:3000/current-exhibits/1")
    .then((response) => response.json())
    .then((data) =>
      data.comments.forEach((comment) => {
        comments.push(comment);

        const newComment = document.createElement("p");
        newComment.textContent = comment;
        commentZone.appendChild(newComment);
      })
    );

  //adding new comment to database and displaying
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newCommentText = commentForm.querySelector("input").value;
    comments.push(newCommentText);

    fetch("http://localhost:3000/current-exhibits/1", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comments: comments }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newComment = document.createElement("p");
        newComment.textContent = newCommentText;
        commentZone.appendChild(newComment);
      });
  });
}

function allowTicketPurchasing() {
  const buyButton = document.querySelector("#buy-tickets-button");
  const ticketsBoughtContainer = document.querySelector("#tickets-bought");
  let ticketCount = parseInt(ticketsBoughtContainer.textContent.split(" ")[0]);

  buyButton.addEventListener("click", (e) => {
    fetch("http://localhost:3000/current-exhibits/1", {
      method: "PATCH",
      body: JSON.stringify({
        tickets_bought: ++ticketCount,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        ticketsBoughtContainer.textContent = `${ticketCount} Tickets Bought`;
      });
  });
}

displayExhibit();
allowComments();
allowTicketPurchasing();
