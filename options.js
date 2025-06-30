(async () => {
  // Function to determine which storage API to use
  const storage =
    typeof chrome !== "undefined" && typeof chrome.storage !== "undefined"
      ? chrome.storage
      : typeof browser !== "undefined" && typeof browser.storage !== "undefined"
        ? browser.storage
        : null;

  if (!storage) {
    console.error("Neither Chrome nor Firefox storage APIs are available.");
  }

  // Elements
  const anon = document.getElementById("anon");

  // Event listeners for storing data
  anon.addEventListener("change", (e) => {
    storage.sync.set({ anon: e.target.checked });
  });

  // Retrieve and set the values for the checkboxes
  const loadStorageValues = async () => {
    try {
      const anonData = await storage.sync.get("anon");

      anon.checked = anonData.anon || false;
    } catch (error) {
      console.error("Error loading values from storage:", error);
    }
  };

  // Load the stored values
  loadStorageValues();

  // Check if the user is authorized
  const checkAuthStatus = async () => {
    try {
      const authData = await storage.sync.get("xoxp");
      if (!authData.xoxp) {
        const h1 = document.querySelector("h1");
        h1.innerText = `Authorize with slack to share your votes!`;

        const a = document.createElement("a");
        a.target = "_blank";
        a.href = "https://api.saahild.com/api/som/slack/oauth";
        a.innerText = "Authorize, then ";

        const btn = document.createElement("button");
        btn.innerText = "click here to give me ur xoxp token!";
        btn.addEventListener("click", async () => {
            const xoxp = prompt("Please enter ur xoxp here!")
          await storage.sync.set({ xoxp });
          document.querySelector("#noauth").remove();
        });

        const noAuthDiv = document.querySelector("#noauth");
        noAuthDiv.appendChild(h1);
        noAuthDiv.appendChild(a);
        noAuthDiv.appendChild(btn);
      } else {
        const noAuthDiv = document.querySelector("#noauth");
        noAuthDiv.innerHTML = `Your logged in and all setup!`
      }
    } catch (error) {
      console.error("Error checking authorization status:", error);
    }
  };

  // Check if the user is authorized
  checkAuthStatus();
})();