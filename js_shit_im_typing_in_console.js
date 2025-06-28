// fyi this code works lmao
// TODO: since im using ts so incorrectly please add a check to see if the voting stuff exits
const divOfThingy = document.body
const [ldemo, rdemo] = Array.from(divOfThingy.querySelectorAll('[data-analytics-link="demo"]')).map(d=>d.href)
const [lrepo, rrepo] = Array.from(divOfThingy.querySelectorAll('[data-analytics-link="repo"]')).map(d=>d.href)
const [lname, rname] = Array.from(divOfThingy.querySelectorAll('[class="text-xl sm:text-3xl mb-1 sm:mb-2 truncate"]')).map(e=>e.innerText)
const [lproject, tieButton, rproject ] = Array.from(divOfThingy.querySelectorAll('[name="vote[winning_project_id]"]'))

const submitButton = divOfThingy.querySelector('[data-disable-with="Submit Vote"]')
const voteTextbox = divOfThingy.querySelector('[name="vote[explanation]"')

let voteValue = "";
let WinningStatus = "N/A"
voteTextbox.oninput = (e) => voteValue = e.target.value

lproject.onclick = () => WinningStatus = "LEFT"
rproject.onclick = () => WinningStatus = "RIGHT"
tieButton.onclick = () => WinningStatus = "TIE"

submitButton.onclick = () => {
    alert(`You voted for ${WinningStatus} project: ${WinningStatus === "LEFT" ? lname : WinningStatus === "RIGHT" ? rname : "TIE"}\n\n`  + voteValue)
    debugger;
}