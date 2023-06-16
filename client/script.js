// Helper function to create a new todo item
function createTodoItem(time, activity) {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");

    const timeText = document.createElement("span");
    timeText.textContent = time;

    const activityText = document.createElement("span");
    activityText.textContent = activity;

    const checkButton = document.createElement("button");
    checkButton.addEventListener("click", function() {
        todoItem.classList.toggle("checked");
        checkButton.classList.toggle("clicked");
        if (checkButton.textContent === '') {
            checkButton.textContent = '✓';
        } else {
            checkButton.textContent = '';
        }
    });

    todoItem.appendChild(timeText);
    todoItem.appendChild(activityText);
    todoItem.appendChild(checkButton);

    // Add drag events to the todo item
    todoItem.setAttribute("draggable", "true");

    todoItem.addEventListener("dragstart", function(event) {
        event.dataTransfer.setData("text/plain", activityText.textContent);
        event.currentTarget.classList.add("dragging");
    });

    todoItem.addEventListener("dragend", function(event) {
        event.currentTarget.classList.remove("dragging");
    });

    todoItem.addEventListener("dragover", function(event) {
        event.preventDefault();
    });

    todoItem.addEventListener("drop", function(event) {
        event.preventDefault();
        const draggedText = event.dataTransfer.getData("text/plain");
        activityText.textContent = draggedText;
    });

    return todoItem;
}

// Helper function to remove all child elements from a parent element
function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Handle form submission for the first page
document.getElementById("chat-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const messageInput = document.getElementById("message-input");
    const prompt = messageInput.value;

    // Clear previous chat
    const chatContainer = document.getElementById("chat-container");
    removeAllChildren(chatContainer);

    const loadingIcon = document.createElement("div");
    loadingIcon.id = "chat-box";
    chatContainer.appendChild(loadingIcon);


    let activities;
    // Send message to OpenAI API and get response
    const response = await fetch("http://localhost:5000", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt })
        })
        .then(response => response.json())
        .then(data => {
            // Access the bot response from the data object
            const botResponse = data.bot;

            // Print or display the bot response in the frontend
            console.log(botResponse);
            // Alternatively, you can update a DOM element with the response
            // Example: document.getElementById('response').textContent = botResponse;
            const regex = /\[(.*?)\]/;
            const match = botResponse.match(regex);
            // activities = JSON.parse(match[0]);
            if (match) {
                activities = JSON.parse(match[0]);
            } else {
                activities = ['9AM: breakfast', '10AM: work', '11AM: gym', '12PM: lunch', '1PM: meeting', '2PM: project', '3PM: break', '4PM: research', '5PM: exercise', '6PM: dinner', '7PM: hobby', '8PM: relaxation', '9PM: sleep'];
            }

            const chatContainer = document.getElementById("chat-container");
            removeAllChildren(chatContainer);

        })
        .catch(error => {
            // Handle any errors that occur during the request
            console.error(error);
        });


    // for testing: 
    activities = ['9AM: breakfast', '10AM: work', '11AM: gym', '12PM: lunch', '1PM: meeting', '2PM: project', '3PM: break', '4PM: research', '5PM: exercise', '6PM: dinner', '7PM: hobby', '8PM: relaxation', '9PM: sleep'];




    // Show suggested plan
    const newChatForm = document.createElement("div");
    newChatForm.id = "chat-box";
    const suggestedPlan = document.createElement("div");
    suggestedPlan.id = "suggested-plan";
    suggestedPlan.innerHTML = "<p>Remember, one step at a time</p>";
    newChatForm.appendChild(suggestedPlan);

    // Populate todo list with response data
    const todoList = document.createElement("div");
    todoList.classList.add("todo-list");
    activities.forEach(activity => {
        const time = activity.substring(0, activity.indexOf(':')).trim();
        const activityText = activity.substring(activity.indexOf(':') + 1).trim();
        const todoItem = createTodoItem(time, activityText);
        todoList.appendChild(todoItem);
    });
    newChatForm.appendChild(todoList);

    // Add "Wind Down" button
    const doneButton = document.createElement("div");
    doneButton.id = "done-button";
    doneButton.innerHTML = "<button id='done-btn'>Wind Down</button>";
    newChatForm.appendChild(doneButton);
    chatContainer.appendChild(newChatForm);

    // Remove form submission event listener for the first page
    // document.getElementById("chat-form").removeEventListener("submit", arguments.callee);

    // // Add event listener to "Done" button
    // document.getElementById("done-btn").addEventListener("click", function() {
    //     const chatContainer = document.getElementById("chat-container");
    //     removeAllChildren(chatContainer);

    //     // Show new chat form
    //     const newChatForm = document.createElement("div");
    //     newChatForm.id = "chat-box";
    //     newChatForm.innerHTML = "<p>You are amazing!! What would you say about today?</p>" +
    //         "<form id='new-chat-form'>" +
    //         "<textarea id='new-message-input' placeholder='Enter your message'></textarea>" +
    //         "<button type='submit'>What a good day!</button>" +
    //         "</form>";
    //     chatContainer.appendChild(newChatForm);

    //     // Focus on the new message input
    //     document.getElementById("new-message-input").focus();

    //     // Remove click event listener from "Done" button
    //     document.getElementById("done-btn").removeEventListener("click", arguments.callee);
    // });
});




const messageData = [{
        date: "May 25, 2023",
        time: "10:30 AM",
        text: "Had a productive day at work!",
        rating: "4",
        image: "1.jpg"
    },
    {
        date: "May 24, 2023",
        time: "9:15 PM",
        text: "Went for a relaxing walk in the park.",
        rating: "3",
        image: "2.jpg"
    },
    {
        date: "May 23, 2023",
        time: "3:45 PM",
        text: "Finished reading a great book.",
        rating: "5",
        image: "3.jpg"
    }
];


// Handle button click for the second page
document.getElementById("chat-container").addEventListener("click", function(e) {
    if (e.target && e.target.id === "done-btn") {
        e.preventDefault();

        // Clear previous chat
        const chatContainer = document.getElementById("chat-container");
        removeAllChildren(chatContainer);

        // Show new chat form
        const newChatForm = document.createElement("div");
        newChatForm.id = "chat-box";
        newChatForm.innerHTML = `
        <p>How was today?</p>
        <div class="rating">
        <input type="radio" id="star1" name="rating" value="1" />
        <label for="star1" title="1 star"></label>
        <input type="radio" id="star2" name="rating" value="2" />
        <label for="star2" title="2 stars"></label>
        <input type="radio" id="star3" name="rating" value="3" />
        <label for="star3" title="3 stars"></label>
        <input type="radio" id="star4" name="rating" value="4" />
        <label for="star4" title="4 stars"></label>
        <input type="radio" id="star5" name="rating" value="5" />
        <label for="star5" title="5 stars"></label>
        </div>
        <form id="new-chat-form">
        <textarea id="new-message-input" placeholder="What went / did not go well? Over time I'll share some insights on what activities form a good day"></textarea>
        <button type="submit">End the day!</button>
        </form>
        `;
        chatContainer.appendChild(newChatForm);

        // Focus on the new message input
        document.getElementById("new-message-input").focus();

        // Handle form submission
        document.getElementById("new-chat-form").addEventListener("submit", function(e) {
            e.preventDefault();
            const messageInput = document.getElementById("new-message-input");
            const messageText = messageInput.value.trim();
            messageInput.value = "";

            const ratingInputs = document.getElementsByName("rating");
            let ratingValue = "No rating";
            for (let i = 0; i < ratingInputs.length; i++) {
                if (ratingInputs[i].checked) {
                    ratingValue = ratingInputs[i].value;
                    break;
                }
            }

            console.log(messageText);
            console.log(ratingValue);

            if (messageText == "" || ratingValue == "No rating") {
                const htmlCode = `
                  <div id="myModal" class="modal">
                    <div class="modal-content">
                      <span class="close">&times;</span>
                      <p>Please fill in all the fields.</p>
                    </div>
                  </div>
                `;

                // Append the HTML code to the document body
                document.body.insertAdjacentHTML("beforeend", htmlCode);

                const modal = document.getElementById("myModal");
                modal.style.display = "block";

                const closeBtn = document.getElementsByClassName("close")[0];
                closeBtn.onclick = function() {
                    modal.style.display = "none";
                };
            }



            if (messageText !== "" && ratingValue !== "No rating") {

                // Code to handle photo upload modal
                const htmlCode = `
<div id="photoModal" class="modal">
  <div class="modal-content">
    <span class="photo-close">&times;</span>
    <p>Add a photo.</p>
    <form id="photoUploadForm">
      <input type="file" id="photoInput" accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  </div>
</div>

                `;
                document.body.insertAdjacentHTML("beforeend", htmlCode);
                const photoModal = document.getElementById("photoModal");
                photoModal.style.display = "block";

                const photoCloseBtn = document.getElementsByClassName("photo-close")[0];
                photoCloseBtn.onclick = function() {
                    photoModal.style.display = "none";
                };


                // Handle photo upload form submission
                document.getElementById("photoUploadForm").addEventListener("submit", function(e) {
                    e.preventDefault();

                    // Handle the photo upload functionality here

                    // Hide the photo upload modal
                    const photoModal = document.getElementById("photoModal");
                    photoModal.style.display = "none";

                    const chatContainer = document.getElementById("chat-container");
                    removeAllChildren(chatContainer);

                    const textContainer = document.createElement("div");
                    textContainer.style.textAlign = 'center';
                    textContainer.innerHTML = `
                        <p>Wow! Look at how much you've grown</p>`
                    chatContainer.appendChild(textContainer);

                    const currentDate = new Date();
                    const messageDate = currentDate.toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    });
                    const messageTime = currentDate.toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true
                    });

                    // Create a message object
                    const message = {
                        date: messageDate,
                        time: messageTime,
                        text: messageText,
                        rating: ratingValue,
                    };

                    // Add the message to the messageData array
                    messageData.unshift(message);

                    // const timelineContainer = document.createElement("div");
                    // timelineContainer.classList.add("timeline-container");
                    // Populate the most recent 7 entries
                    for (let i = 0; i < messageData.length; i++) {
                        const message = messageData[i];

                        const messageContainer = document.createElement("div");
                        messageContainer.classList.add("message-container");
                        let ratingImages = "";
                        for (let i = 0; i < message.rating; i++) {
                            ratingImages += `<img src="heart.png" style="width: 10px" alt="Heart Image" class="message-rating-image">`;
                        }
                        messageContainer.innerHTML = `
                        <div>
                        <p class='message-date'>${message.date} ${ratingImages}</p>
                        <p class='message-text'>${message.text}</p>
                        </div>
                        <div>
                        <img src="${message.image}" class="message-image">
                        </div>
                        `;

                        chatContainer.appendChild(messageContainer);

                    }
                    // chatContainer.appendChild(timelineContainer);

                    const backButton = document.createElement("div");
                    // backButton.id = "back-btn"; 
                    backButton.id = "back-button";
                    backButton.innerHTML = "<button id='back-btn'>Home</button>";
                    chatContainer.appendChild(backButton);

                    const homeButton = document.getElementById("back-btn");
                    homeButton.addEventListener("click", function() {
                        location.reload(); // Reload the page
                    });
                    // Add the "More" button if there are older messages
                    // if (messageData.length > 3) {
                    //     const moreButton = document.createElement("button");
                    //     moreButton.id = "more-btn";
                    //     moreButton.innerText = "Show More";
                    //     chatContainer.appendChild(moreButton);
                    // }
                });
            }
        });

    }

});

// Handle "More" button click
// document.getElementById("chat-container").addEventListener("click", function(e) {
//     if (e.target && e.target.id === "more-btn") {
//         e.preventDefault();

//         const chatContainer = document.getElementById("chat-container");
//         const moreButton = document.getElementById("more-btn");

//         // Remove the "More" button
//         chatContainer.removeChild(moreButton);

//         // Load and display older messages
//         for (let i = 3; i < messageData.length; i++) {
//             const message = messageData[i];

//             const messageContainer = document.createElement("div");
//             messageContainer.classList.add("message-container");
//             messageContainer.innerHTML = "<p class='message-date'>" + message.date + "</p>" +
//                 "<p class='message-time'>" + message.time + "</p>" +
//                 "<p class='message-text'>" + message.text + "</p>" +
//                 "<p class='message-rating'>Rating: " + message.rating + "</p>";

//             chatContainer.appendChild(messageContainer);
//         }
//     }
// });