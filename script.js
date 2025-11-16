async function sendMessage() {
  const message = document.getElementById("userInput").value;
  const responseBox = document.getElementById("response");

  responseBox.innerHTML = "Loading...";

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    responseBox.innerHTML = data.reply || "Error";
  } catch (err) {
    responseBox.innerHTML = "Server error";
  }
}

