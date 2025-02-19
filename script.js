import { getUserIDs, getListenEvents, getSong } from "./data.js";


//--------------------- Generating Html ---------------------
function createContent() {
  const container = document.querySelector(".container");

  const userSection = document.createElement("section");
  userSection.id = "userSection";

  const userSelector = document.createElement("select");
  userSelector.id = "userDropdown";

  //--------------------- appending each var to the container ---------------------
  userSection.appendChild(userSelector);
  container.appendChild(userSection);

  const users = getUserIDs();
  users.forEach((userID) => {
    const option = document.createElement("option");
    option.value = userID;
    option.textContent = `User ${userID} 🎧`;
    userSelector.appendChild(option);
  });

  //------------------------ style in the dropdown section -------------------------
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

  //------------------------ style in the dropdown select -------------------------
  Object.assign(userDropdown.style, {
    padding: "12px 20px",
    fontSize: "16px", 
    border: "2px solid #007BFF", 
    borderRadius: "8px", 
    backgroundColor: "#f8f8f8", 
    color: "#333", 
    cursor: "pointer",
    width: "140px",
    transition: "all 0.3s ease", 
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