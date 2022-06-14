const nickForm = document.querySelector("#nickname");
const chatForm = document.querySelector("#chat");
const chatContent = document.querySelector("ul");

const ws = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  return JSON.stringify({ type, payload });
}

nickForm.querySelector("input").addEventListener("change", (e) => {
  e.preventDefault();
  ws.send(makeMessage("nickname", e.target.value));
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const content = chatForm.querySelector("input");
  ws.send(makeMessage("new_message", content.value));
  content.value = "";
});

ws.addEventListener("message", (message) => {
  const li = document.createElement("li");
  const parsed = JSON.parse(message.data);
  li.innerText = `${parsed.nick}: ${parsed.message}`;
  chatContent.append(li);
});
