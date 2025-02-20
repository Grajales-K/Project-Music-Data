// import { getUserIDs, getListenEvents, getSong } from "./data.js";
// import { processUserData } from "./common.js";

// //------------------------------- Generating Html Selector ------------------------------
// function createContent() {
//   const container = document.querySelector(".container");
//   container.innerHTML = ""; // Clear previous content

//   const userSection = document.createElement("section");
//   userSection.id = "userSection";

//   const userLabel = document.createElement("label");
//   userLabel.setAttribute("for", "userDropdown");
//   userLabel.textContent = " Select User:";
//   const userSelector = document.createElement("select");
//   userSelector.id = "userDropdown";

//   //---------------------------- fetching and populate userIDs -------------------------------
//   const placeholderOption = document.createElement("option");
//   placeholderOption.value = "";
//   placeholderOption.textContent = "Choose a User";
//   placeholderOption.disabled = true;
//   placeholderOption.selected = true;

//   const users = getUserIDs();
//   users.forEach((userID) => {
//     const option = document.createElement("option");
//     option.value = userID;
//     option.textContent = `User ${userID} 🎧`;
//     userSelector.appendChild(option);
//   });

//   //--------------------- appending each var to the container -------------------
//   container.appendChild(userSection);
//   userSection.appendChild(userLabel);
//   userSection.appendChild(userSelector);
//   userSelector.appendChild(placeholderOption);

//   //------------------------ style userSection section -------------------------
//   Object.assign(userSection.style, {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "10px",
//     backgroundColor: "lightblue",
//     borderRadius: "8px",
//     marginBottom: "20px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//   });

//   //--------------------------- Dropdown select style -------------------------
//   Object.assign(userSelector.style, {
//     padding: "12px 20px",
//     fontSize: "16px",
//     border: "2px solid #007BFF",
//     borderRadius: "8px",
//     backgroundColor: "#f8f8f8",
//     color: "#333",
//     cursor: "pointer",
//     width: "200px",
//     transition: "all 0.3s ease",
//     marginLeft: "1rem",
//   });
// }

// //--------------------------- Create table for question ------------------------
// function createTable() {
//   const container = document.querySelector(".container");

//   const table = document.createElement("table");
//   table.id = "musicTable";
//   table.style.width = "100%";
//   table.style.border = "1px solid black";
//   table.style.borderCollapse = "collapse";
//   table.style.marginTop = "20px";

//   container.appendChild(table);

//   //-------------------------------- Create header ------------------------------
//   const thead = document.createElement("thead");
//   const headerRow = document.createElement("tr");

//   ["Question", "Answer"].forEach((text) => {
//     const th = document.createElement("th");
//     th.textContent = text;
//     th.style.border = "1px solid black";
//     th.style.padding = "8px";
//     th.style.textAlign = "left";
//     th.style.backgroundColor = "#007BFF";
//     th.style.color = "white";
//     headerRow.appendChild(th);
//   });

//   thead.appendChild(headerRow);
//   table.appendChild(thead);

//   //--------------------------- Create Table Body -------------------------
//   const tbody = document.createElement("tbody");
//   tbody.id = "musicTableBody";
//   table.appendChild(tbody);

//   container.appendChild(table);
// }

// // ---------------------- Event listener ----------------------
// function handleUserSelection(event) {
//   const userID = event.target.value;
//   if (userID) {
//     processUserData(userID);
//   }

//   setUpEvents(); 

// }


// function setUpEvents() {
//   userSelector.addEventListener("change", handleUserSelection);

// }



// window.onload = function () {
//   createContent();
//   createTable();


// };


// export { createContent, createTable, handleUserSelection };


import { getUserIDs } from "./data.js";
import { processUserData } from "./common.js";

//------------------------------- Generating Html Selector ------------------------------
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

  //---------------------------- fetching and populate userIDs -------------------------------
  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = "Choose a User";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;

  userSelector.appendChild(placeholderOption);

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

  //---------------------------- Event Listener --------------------------------
  userSelector.addEventListener("change", (event) => {
    const userID = event.target.value;
    if (userID) {
      processUserData(userID); 
    }
  });
}

//--------------------------- Create table for question ------------------------
function createTable() {
  const container = document.querySelector(".container");

  const table = document.createElement("table");
  table.id = "musicTable";
  table.style.width = "50%";
  table.style.border = "1px solid black";
  table.style.borderCollapse = "collapse";
  table.style.marginTop = "20px";

  container.appendChild(table);

  //-------------------------------- Create header ------------------------------
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  ["Question", "Answer"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    th.style.border = "1px solid black";
    th.style.padding = "8px";
    th.style.textAlign = "center";
    th.style.backgroundColor = "#007BFF";
    th.style.color = "white";
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  //--------------------------- Create Table Body -------------------------
  const tbody = document.createElement("tbody");
  tbody.id = "musicTableBody";
  table.appendChild(tbody);

  container.appendChild(table);
}

// ---------------------------- Event listener -----------------------------
function handleUserSelection(event) {
  const userID = event.target.value;
  if (userID) {
    processUserData(userID);
    showTable();
  }
}

// --------------------- Function to display table visible ---------------------- 
function showTable() {
  const table = document.getElementById("musicTable");
  if (table) {
    table.style.display = "table"; 
  }
}
// ------------------- Setting up event listeners only once ------------------------
function setUpEvents(userSelector) {
  userSelector.addEventListener("change", handleUserSelection);
}



window.onload = function () {
  const userSelector = createContent();
  createTable();
  setUpEvents(userSelector);
};




export { createContent, createTable, handleUserSelection };















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