import { getUserIDs, getListenEvents, getSong } from "./data.js";



//------------------------------- Generating Html ------------------------------
function createContent() {
  const container = document.querySelector(".container");
  container.innerHTML = ""; // Clear previous content

  const userSection = document.createElement("section");
  userSection.id = "userSection";

  const userLabel = document.createElement("label");
  userLabel.setAttribute("for", "userDropdown");
  userLabel.textContent = " Select User:";
  const userSelector = document.createElement("select");
  userSelector.id = "userDropdown";

  //---------------------------- fetching userIDs -------------------------------
  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = "Choose a User";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;

  const users = getUserIDs();
  users.forEach((userID) => {
    const option = document.createElement("option");
    option.value = userID;
    option.textContent = `User ${userID} 🎧`;
    userSelector.appendChild(option);
  });

  //--------------------- appending each var to the container -------------------
  container.appendChild(userSection);
  userSection.appendChild(userLabel);
  userSection.appendChild(userSelector);
  userSelector.appendChild(placeholderOption);



  //------------------------ style userSection section -------------------------
  Object.assign(userSection.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "lightblue",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  });

  //--------------------------- Dropdown select style -------------------------
  Object.assign(userSelector.style, {
    padding: "12px 20px",
    fontSize: "16px",
    border: "2px solid #007BFF",
    borderRadius: "8px",
    backgroundColor: "#f8f8f8",
    color: "#333",
    cursor: "pointer",
    width: "200px",
    transition: "all 0.3s ease",
    marginLeft: "1rem",
  });
}



window.onload = function () {
  createContent();

};


export { createContent };





// -------------- testing what user listen in their history -----------------
// const users = getUserIDs();
// console.log(`There are ${users.length} users`);

// const userID = "4";
// const events = getListenEvents(userID);

// events.forEach((event) => {
//   const song = getSong(event.song_id);
//   console.log(
//     `the user ${userID} listen "${song.title}" of ${song.artist} on ${event.timestamp}`
//   );
// });



// window.onload = function () {
//   const users = getUserIDs();
//   document.querySelector("body").innerText = `There are ${
//     getListenEvents().length
//   } users`;
//   createContent();
// };