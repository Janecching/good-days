// Helper function to create a new todo item
function createTodoItem(time, activity) {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");

    const timeText = document.createElement("span");
    timeText.textContent = time;

    const activityText = document.createElement("span");
    activityText.textContent = activity;

    const checkButton = document.createElement("button");
    checkButton.textContent = "Check";
    checkButton.addEventListener("click", function() {
        todoItem.classList.toggle("checked");
        checkButton.classList.toggle("clicked");
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
            activities = JSON.parse(match[0]);

            const chatContainer = document.getElementById("chat-container");
            removeAllChildren(chatContainer);

        })
        .catch(error => {
            // Handle any errors that occur during the request
            console.error(error);
        });

    // activities = ['9AM: surf']

    const newChatForm = document.createElement("div");
    newChatForm.id = "chat-box";

    // Show suggested plan

    const suggestedPlan = document.createElement("div");
    suggestedPlan.id = "suggested-plan";
    suggestedPlan.innerHTML = "<p>Here’s your suggested plan for the day!<br>Feel free to drag to edit it</p>";
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


    // Add "Done" button
    const doneButton = document.createElement("div");
    doneButton.id = "done-button";
    doneButton.innerHTML = "<button id='done-btn'>Wind Down</button>";
    newChatForm.appendChild(doneButton);

    chatContainer.appendChild(newChatForm);

    // Remove form submission event listener for the first page
    document.getElementById("chat-form").removeEventListener("submit", arguments.callee);

    // Add event listener to "Done" button
    document.getElementById("done-btn").addEventListener("click", function() {
        const chatContainer = document.getElementById("chat-container");
        removeAllChildren(chatContainer);

        // Show new chat form
        const newChatForm = document.createElement("div");
        newChatForm.id = "chat-box";
        newChatForm.innerHTML = "<p>You are amazing!! What would you say about today?</p>" +
            "<form id='new-chat-form'>" +
            "<textarea id='new-message-input' placeholder='Enter your message'></textarea>" +
            "<button type='submit'>What a good day!</button>" +
            "</form>";
        chatContainer.appendChild(newChatForm);

        // Focus on the new message input
        document.getElementById("new-message-input").focus();

        // Remove click event listener from "Done" button
        document.getElementById("done-btn").removeEventListener("click", arguments.callee);
    });
});

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
        newChatForm.innerHTML = "<p>You are amazing!! What would you say about today?</p>" +
            "<form id='new-chat-form'>" +
            "<textarea id='new-message-input' placeholder='Enter your message'></textarea>" +
            "<button type='submit'>End the day!</button>" +
            "</form>";
        chatContainer.appendChild(newChatForm);

        // Focus on the new message input
        document.getElementById("new-message-input").focus();
    }
});