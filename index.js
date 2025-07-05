/**
 * @typedef {Object} VoteBody
 * @property {string} message - The message to vote on
 * @property {boolean} send_it_to_user
 * @property {boolean} anon
 * @property {string} repo_url
 * @property {string} demo_url
 * @property {string} title
 * @property {string} author
 * @property {string} a_repo_url
 * @property {string} a_demo_url
 * @property {string} a_title
 * @property {string} a_author
 * @property {boolean} is_tie
 *
 */
let do_not_event_bother_running = false;
async function sendEventVote({
  winner_project,
  loser_project,
  explanation,
  send_to_user,
  is_tie = false,
  anon,
}) {
  fetch("https://api.saahild.com/api/som/vote", {
    method: "POST",
    headers: {
      Authorization: await chrome.storage.sync
        .get("xoxp")
        .then((d) => d.xoxp || "xoxp-null"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: explanation,
      title: winner_project.title,
      a_title: loser_project.title,
      is_tie: is_tie,
      anon,
      send_it_to_user: send_to_user,
    }),
  });
}

async function main() {
  const anon =
    (await chrome.storage.sync.get("anon").then((d) => d.anon)) || false;
  const send_to_user = await chrome.storage.sync
    .get("send_to_user")
    .then((d) => d.send_to_user || false);
  const divOfThingy = document.body;
  const [ldemo, rdemo] = Array.from(
    divOfThingy.querySelectorAll('[data-analytics-link="demo"]'),
  ).map((d) => d.href);
  const [lrepo, rrepo] = Array.from(
    divOfThingy.querySelectorAll('[data-analytics-link="repo"]'),
  ).map((d) => d.href);
  const [lname, rname] = Array.from(
    divOfThingy.querySelectorAll(
      '[class="text-xl sm:text-3xl mb-1 sm:mb-2 truncate"]',
    ),
  ).map((e) => e.innerText);
  const [lproject, tieButton, rproject] = Array.from(
    divOfThingy.querySelectorAll('[name="vote[winning_project_id]"]'),
  );

  const submitButton = divOfThingy.querySelector(
    '[data-disable-with="Submit Vote"]',
  );
  const voteTextbox = divOfThingy.querySelector('[name="vote[explanation]"');

  let voteValue = "";
  let WinningStatus = "N/A";
  voteTextbox.oninput = (e) => {
    voteValue = e.target.value;
    console.debug("boop");
  };
  lproject.onclick = () => (WinningStatus = "LEFT");
  rproject.onclick = () => (WinningStatus = "RIGHT");
  tieButton.onclick = () => (WinningStatus = "TIE");

  submitButton.onclick = () => {
    window.hasRunVotingScript = false;
    localStorage.setItem("waitUntil", Date.now() + 5000);
    // alert(`You voted for ${WinningStatus} project: ${WinningStatus === "LEFT" ? lname : WinningStatus === "RIGHT" ? rname : "TIE"}\n\n`  + voteValue)
    sendEventVote({
      explanation: voteValue,
      anon,
      send_to_user,
      winner_project: {
        title:
          WinningStatus === "LEFT"
            ? lname
            : WinningStatus === "RIGHT"
              ? rname
              : rname,
      },
      loser_project: {
        title:
          WinningStatus === "LEFT"
            ? rname
            : WinningStatus === "RIGHT"
              ? lname
              : lname,
      },
      is_tie: WinningStatus === "TIE",
    });
  };
}

setInterval(async () => {
  if (do_not_event_bother_running) return; // If not authed, do not run the script
  if (
    localStorage.getItem("waitUntil") &&
    Date.now() < parseInt(localStorage.getItem("waitUntil"))
  ) {
    console.log("Waiting for the voting script to reset...");
    return;
  } else {
    localStorage.removeItem("waitUntil");
  }
  if (location.href.startsWith("https://summer.hackclub.com/votes/new")) {
    // Only runs if we're on the voting page
    if (!window.hasRunVotingScript) {
      window.hasRunVotingScript = true; // prevent running more than once
      await main();
    }
  }
  if (
    !document.body.querySelector('[name="vote[explanation]"') &&
    window.hasRunVotingScript
  ) {
    // If the input box is not found, reset the script
    window.hasRunVotingScript = false;
    console.log("Resetting voting script due to missing input box.");
  }
}, 50);
window.onload = async () => {
  const isAuthed = await chrome.storage.sync
    .get("xoxp")
    .then((d) => Boolean(d.xoxp));
  if (!isAuthed) {
    alert(
      `You are not authed! please go to the options page for the chrome extension "Som Share Votes"`,
    );
    do_not_event_bother_running = true;
  }
};
