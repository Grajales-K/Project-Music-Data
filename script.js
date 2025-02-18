import { getUserIDs, getListenEvents, getSong } from "./data.js";

function createContent() {
  const container = document.querySelector(".container");

  const userSection = document.createElement("section");
  userSection.id = "userSection";

  const userSelector = document.createElement("select");


  //--------------------- style in the dropdown section ------------
  Object.assign(userSection.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "yellow",
    marginBottom: "10px",
  });

  
  userSection.appendChild(userSelector);
  container.appendChild(userSection);
}


window.onload = function () {
  const users = getUserIDs();
 
  createContent();
};




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