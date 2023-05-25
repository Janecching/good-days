// import bot from './assets/bot.svg'
// import user from './assets/user.svg'

// const form = document.querySelector('form')
// const chatContainer = document.querySelector('#chat_container')

// let loadInterval



// // Display initial message
// window.addEventListener('load', () => {
//     const initialMessage = "Good morning, what's on your mind?";
//     chatContainer.innerHTML += chatStripe(true, initialMessage, generateUniqueId());
//     // chatContainer.scrollTop = chatContainer.scrollHeight;
// });


// function loader(element) {
//     element.textContent = 'Okay let me see';
//     let dots = '';
//     loadInterval = setInterval(() => {
//         dots += '.';
//         element.textContent = `Okay let me see${dots}`;
//         if (dots.length > 3) {
//             dots = '';
//         }
//     }, 300);
// }



// function typeText(element, text) {
//     let index = 0;
//     let interval = setInterval(() => {
//         if (index < text.length) {
//             element.innerHTML += text.charAt(index)
//             index++
//         } else {
//             clearInterval(interval)
//         }
//     }, 20)
// }

// function generateUniqueId() {
//     const timestamp = Date.now()
//     const randomNumber = Math.random()
//     const hexadecimalString = randomNumber.toString(16)
//     return `id-${timestamp}-${hexadecimalString}`
// }

// function chatStripe(isAi, value, uniqueId) {
//     return (
//         `
//       <div class="wrapper ${isAi && 'ai'}">
//         <div class="chat">
//           <div className="profile">
//             <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}" />
//           </div>
//           <div class="message" id=${uniqueId}>${value}</div>
//         </div>
//       </div>
//     `
//     )
// }

// const handleSubmit = async(e) => {
//     e.preventDefault()
//     const data = new FormData(form)
//     chatContainer.innerHTML += chatStripe(false, data.get('prompt'))
//     form.reset()
//     const uniqueId = generateUniqueId()
//     chatContainer.innerHTML += chatStripe(true, '', uniqueId)
//     chatContainer.scrollTop = chatContainer.scrollHeight
//     const messageDiv = document.getElementById(uniqueId)
//     loader(messageDiv)
//     const response = await fetch('http://localhost:5000', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt: data.get('prompt') })
//     })
//     clearInterval(loadInterval)
//     messageDiv.innerHTML = '';
//     if (response.ok) {
//         const data = await response.json()
//         const parsedData = data.bot.trim()
//         console.log(parsedData)
//         typeText(messageDiv, parsedData)
//     } else {
//         const err = await response.text()
//         messageDiv.innerHTML = "Something went wrong"
//         alert(err)
//     }
// }

// form.addEventListener('submit', handleSubmit)
// form.addEventListener('keyup', (e) => {
//     if (e.keyCode === 13) {
//         handleSubmit(e)
//     }
// })

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
    const message = messageInput.value;

    // Send message to OpenAI API and get response
    const response = await fetch("YOUR_OPENAI_API_ENDPOINT", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    });

    // Example response data
    const schedule = [
        { time: "7:00 AM", activity: "Morning Exercise" },
        { time: "8:00 AM", activity: "Breakfast" },
        { time: "9:00 AM", activity: "Meeting" },
        { time: "10:00 AM", activity: "" },
        { time: "11:00 AM", activity: "Coffee Break" },
        { time: "12:00 PM", activity: "Lunch" },
        { time: "1:00 PM", activity: "Work on Project" },
        { time: "2:00 PM", activity: "" },
        { time: "3:00 PM", activity: "" },
        { time: "4:00 PM", activity: "Task Review" },
        { time: "5:00 PM", activity: "Wrap Up Work" },
        { time: "6:00 PM", activity: "" },
        { time: "7:00 PM", activity: "Personal Time" },
        { time: "8:00 PM", activity: "" },
        { time: "9:00 PM", activity: "Watch TV Show" },
        { time: "10:00 PM", activity: "Bedtime" },
    ];

    // Clear previous chat
    const chatContainer = document.getElementById("chat-container");
    removeAllChildren(chatContainer);

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
    schedule.forEach(({ time, activity }) => {
        const todoItem = createTodoItem(time, activity);
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