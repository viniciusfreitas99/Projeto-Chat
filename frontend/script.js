// Elementos de login
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

// Elementos do chat
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const colors = [
    "cadetblue",
    "green",
    "gold",
    "lightpink",
    "lightgray",
    "lightblue",
    "lightgreen",
    "red",
    "purple",
    "teal",
    "yellow",
    "darkmagenta",
    "darkblue"
];

const user = { id: "", name: "", color: "" };
let websocket;

const createMessageElement = (content, self = false) => {
    const div = document.createElement("div");
    div.classList.add(self ? "message__self" : "message__other");
    div.textContent = content;
    return div;
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div");
    const span = document.createElement("div");

    div.classList.add("message__other");

    div.classList.add("message__self");
    span.classList.add("message__sender");
    span.style.color = senderColor;

    div.appendChild(span)

    span.innerHTML = sender;

    div.textContent += content;
    return div;
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data);

    const message = userId == user.id ? createMessageSelfElement(content) : createMessageElement(content, userId, userColor);


    chatMessages.appendChild(message);

    scrollScreen()
};

const handleLogin = (event) => {
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("ws://localhost:9844");
    websocket.onmessage = processMessage;

    websocket.onopen = () => {
        websocket.send(JSON.stringify({
            userId: user.id,
            userName: user.name,
            userColor: user.color,
            content: `Usuario ${user.name} entrou no chat`
        }));
    };

    websocket.onerror = (error) => {
        console.error(`Erro no WebSocket: ${error}`);
    };

    websocket.onclose = () => {
        console.log("Desconectado do WebSocket");
    };

    console.log(user);
};

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message));

    const selfMessageElement = createMessageElement(chatInput.value, true);
    chatMessages.appendChild(selfMessageElement);

    chatInput.value = "";
}

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
