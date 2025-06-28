// script.mjs
// This file serves as the main client-side JavaScript entry point for the "Music Data Project".
// It is responsible for setting up the initial HTML structure, managing user interactions,
// and updating the display of the data analysis results. It acts as the bridge between
// the raw data, the processing logic, and the user interface.

// Imports the `getUserIDs` function from `data.mjs`. This function provides a list of
// available user IDs that the application can analyze.
import { getUserIDs } from "./data.mjs";
// Imports the `processUserData` function from `common.mjs`. This is the core function
// that performs all the complex data analysis based on a selected user's listening history.
import { processUserData } from "./common.mjs";

// === UI Generation Function: createContent() ===
/**
 * @function createContent
 * @description Dynamically generates the initial content of the web page,
 * specifically the user selection dropdown. This includes creating the
 * necessary HTML elements, populating the dropdown with user IDs, and
 * attaching an event listener for user selection.
 */
function createContent() {
  // Selects the <div> element in `index.html` with the class "container".
  // This is where all the dynamic UI components will be appended.
  const container = document.querySelector(".container");
  // Clears any existing content inside the container. This is important to ensure
  // a clean slate, especially if the `createContent` function were to be called
  // multiple times or if there was any default HTML inside the container.
  container.innerHTML = "";

  // --- Create User Selection Section ---
  // Creates a <section> element to group the user dropdown and its label.
  const userSection = document.createElement("section");
  // Assigns an ID to the section for potential styling or JavaScript access.
  userSection.id = "userSection";

  // Creates a <label> element for the user dropdown.
  const userLabel = document.createElement("label");
  // Associates the label with the dropdown using the 'for' attribute, which points to
  // the 'id' of the input element it labels ('userDropdown'). This improves accessibility.
  userLabel.setAttribute("for", "userDropdown");
  userLabel.textContent = " Select User:"; // Sets the visible text of the label.

  // Creates the <select> (dropdown) element for user selection.
  const userSelector = document.createElement("select");
  userSelector.id = "userDropdown"; // Assigns an ID for JavaScript access and label association.

  // --- Populate User IDs into Dropdown ---
  // Creates a placeholder <option> that prompts the user to make a selection.
  const placeholderOption = document.createElement("option");
  placeholderOption.value = ""; // An empty value signifies no user selected.
  placeholderOption.textContent = "Choose a User"; // The text displayed.
  placeholderOption.disabled = true; // Makes this option unselectable by the user.
  placeholderOption.selected = true; // Makes this option the default selected one on page load.

  // Appends the placeholder option to the user dropdown.
  userSelector.appendChild(placeholderOption);

  // Retrieves the array of user IDs by calling `getUserIDs()` from `data.mjs`.
  const users = getUserIDs();
  // Iterates over each `userID` in the `users` array.
  users.forEach((userID) => {
    const option = document.createElement("option"); // Creates a new <option> element for each user.
    option.value = userID; // Sets the 'value' attribute of the option to the actual user ID.
    option.textContent = `User ${userID} 🎧`; // Sets the visible text for the option (e.g., "User 1 🎧").
    userSelector.appendChild(option); // Appends the user option to the dropdown.
  });

  // --- Append Elements to the Container ---
  // Appends the `userSection` (which contains the label and dropdown) to the main `container`.
  container.appendChild(userSection);
  // Appends the `userLabel` and `userSelector` to the `userSection`.
  // Note: Appending to `userSection` after it's appended to `container` means
  // these elements are added to the DOM and become visible.
  userSection.appendChild(userLabel);
  userSection.appendChild(userSelector);

  // --- Inline Styling for userSection (Note: Project stated "No CSS") ---
  // The project requirements explicitly stated "Do not write any CSS". However,
  // this code applies styles directly to the DOM element using JavaScript's
  // `style` property and `Object.assign()`. While technically not a `.css` file,
  // this is still applying styling and might be a point of discussion regarding
  // strict interpretation of "No CSS". It makes the user selection visually distinct.
  Object.assign(userSection.style, {
    display: "flex", // Uses Flexbox for internal layout of label and select.
    justifyContent: "center", // Centers items horizontally within the flex container.
    alignItems: "center", // Centers items vertically within the flex container.
    padding: "10px", // Adds padding around the content.
    backgroundColor: "lightblue", // Sets a background color.
    borderRadius: "8px", // Rounds the corners.
    marginBottom: "20px", // Adds space below the section.
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Adds a subtle shadow for depth.
    color: "#000", // Sets text color to black.
  });

  // --- Inline Styling for Dropdown Select ---
  // Similar to `userSection`, these styles are applied directly to the dropdown.
  Object.assign(userSelector.style, {
    padding: "12px 20px", // Adds internal spacing.
    fontSize: "16px", // Sets font size.
    border: "2px solid #007BFF", // Adds a blue border.
    borderRadius: "8px", // Rounds corners.
    backgroundColor: "#ffffff", // White background.
    color: "#333", // Dark gray text.
    cursor: "pointer", // Changes cursor to pointer on hover.
    width: "200px", // Sets a fixed width.
    transition: "all 0.3s ease", // Smooth transition for style changes (e.g., on hover/focus).
    marginLeft: "1rem", // Adds left margin to separate from the label.
  });

  // --- Event Listener for User Selection ---
  // Attaches an event listener to the `userSelector` (dropdown).
  // When the user changes their selection (`change` event), the provided
  // arrow function is executed.
  userSelector.addEventListener("change", (event) => {
    const userID = event.target.value; // Gets the `value` of the selected option (which is the user ID).
    // If a valid `userID` is selected (i.e., not the empty placeholder value),
    // then `processUserData` from `common.mjs` is called to analyze and display the data for that user.
    if (userID) {
      processUserData(userID);
    }
  });
}

// === UI Generation Function: createTable() ===
/**
 * @function createTable
 * @description Dynamically creates the HTML table structure where the
 * data analysis results (questions and answers) will be displayed.
 */
function createTable() {
  const container = document.querySelector(".container"); // Selects the main container.

  const table = document.createElement("table"); // Creates the <table> element.
  table.id = "musicTable"; // Assigns an ID for unique identification and easy access.
  // Inline styles for the table.
  table.style.width = "60%"; // Sets table width.
  table.style.border = "1px solid black"; // Adds a border.
  table.style.borderCollapse = "collapse"; // Collapses borders for a single-line appearance.
  table.style.marginTop = "20px"; // Adds top margin.

  container.appendChild(table); // Appends the table to the main container.

  // --- Create Table Header (thead) ---
  const thead = document.createElement("thead"); // Creates the <thead> element for table headers.
  const headerRow = document.createElement("tr"); // Creates a <tr> for the header row.

  // Defines the text for the header columns.
  ["Question", "Answer"].forEach((text) => {
    const th = document.createElement("th"); // Creates a <th> (table header cell).
    th.textContent = text; // Sets the header text.
    // Inline styles for header cells.
    th.style.border = "2px solid black"; // Border.
    th.style.padding = "8px"; // Padding.
    th.style.textAlign = "center"; // Text alignment.
    th.style.backgroundColor = "#0056b3"; // Blue background.
    th.style.color = "#fff"; // White text.
    headerRow.appendChild(th); // Appends the header cell to the header row.
  });

  thead.appendChild(headerRow); // Appends the header row to the table header.
  table.appendChild(thead); // Appends the table header to the table.

  // --- Create Table Body (tbody) ---
  const tbody = document.createElement("tbody"); // Creates the <tbody> element for table data.
  tbody.id = "musicTableBody"; // Assigns an ID for dynamic content updates.
  table.appendChild(tbody); // Appends the table body to the table.

  // Note: `container.appendChild(table)` is called twice here. The first call
  // adds the table, and the second call is redundant as the table is already appended.
  container.appendChild(table);
}

// === Utility Function: deleteElement() ===
/**
 * @function deleteElement
 * @description Removes an HTML element from the DOM given its ID.
 * This is used to hide or remove elements when they are no longer needed,
 * such as the table when there's no data, or the "no music" message when data appears.
 * @param {string} elementID - The ID of the HTML element to be removed.
 */
function deleteElement(elementID) {
  const el = document.getElementById(elementID); // Attempts to find the element by its ID.

  if (el) {
    // Checks if the element was found.
    el.remove(); // If found, removes the element from the DOM.
  }
}

// === UI Generation Function: createMessage() ===
/**
 * @function createMessage
 * @description Creates and appends a simple message to the container, typically
 * used when no listening data is available for a selected user.
 */
function createMessage() {
  const container = document.querySelector(".container"); // Selects the main container.
  const message = document.createElement("span"); // Creates a <span> element for the message.
  message.id = "noUserMessage"; // Assigns an ID for potential removal later.
  message.textContent = "No music for this user"; // Sets the message text.
  container.appendChild(message); // Appends the message to the container.
}

// === UI Update Function: updateTable() ===
/**
 * @function updateTable
 * @description Updates the content of the music data table with the processed results.
 * It intelligently hides/shows the table and a "no data" message based on input.
 * This is a critical function that receives the computed insights from `common.mjs`.
 * @param {Array<Object>} [data] - An optional array of result objects, where each
 * object has a `question` (string) and an `answer` (string). If `data` is
 * null/undefined/empty, it indicates no data for the user.
 */
function updateTable(data) {
  // Checks if 'data' is null, undefined, or an empty array.
  // This condition signifies that there's no relevant listening data for the selected user.
  if (!data || data.length === 0) {
    deleteElement("musicTable"); // Removes the existing table if it's present.
    createMessage(); // Displays the "No music for this user" message.
    // The commented-out lines below are reminders from the prompt about handling this case.
    // create a DOM element that states there is no data
    // insert it into the page
  } else {
    // If data IS available:
    const table = document.getElementById("musicTable"); // Tries to get the existing table.
    if (!table) {
      // If the table doesn't exist yet (e.g., first time loading data after "no music").
      createTable(); // Creates the table structure.
    }
    deleteElement("noUserMessage"); // Ensures the "no music" message is removed if it was present.

    const tbody = document.getElementById("musicTableBody"); // Gets the table body element.
    tbody.innerHTML = ""; // Clears any existing rows in the table body before populating new data.

    // Iterates over each `entry` (question-answer pair) in the provided `data` array.
    data.forEach((entry) => {
      const row = document.createElement("tr"); // Creates a new table row for each entry.

      const questionCell = document.createElement("td"); // Creates a table data cell for the question.
      questionCell.textContent = entry.question; // Sets the text content to the question.
      // Inline styles for the question cell.
      questionCell.style.border = "1px solid black";
      questionCell.style.padding = "8px";

      const answerCell = document.createElement("td"); // Creates a table data cell for the answer.
      answerCell.textContent = entry.answer; // Sets the text content to the answer.
      // Inline styles for the answer cell.
      answerCell.style.border = "1px solid black";
      answerCell.style.padding = "8px";

      row.appendChild(questionCell); // Appends the question cell to the row.
      row.appendChild(answerCell); // Appends the answer cell to the row.
      tbody.appendChild(row); // Appends the completed row to the table body.
    });
  }
}

// === Event Listener Function: handleUserSelection() ===
/**
 * @function handleUserSelection
 * @description This function is an event handler for when a user selects an option
 * from the dropdown. It triggers the data processing and table display.
 * (Note: In the current `createContent` function, the `change` event listener
 * is directly defined as an anonymous function, so this `handleUserSelection`
 * might be a remnant or intended for an alternative implementation. However,
 * its purpose would be the same.)
 * @param {Event} event - The DOM event object (specifically, a 'change' event).
 */
function handleUserSelection(event) {
  const userID = event.target.value; // Gets the selected user ID from the dropdown.
  if (userID) {
    // Ensures a valid user ID is selected (not the placeholder).
    processUserData(userID); // Triggers the data analysis for the selected user.
    showTable(); // Ensures the table is visible (though `updateTable` would also handle this implicitly).
  }
}

// === UI Utility Function: showTable() ===
/**
 * @function showTable
 * @description Ensures the music data table is visible by setting its CSS display property.
 * This is primarily useful if the table was previously hidden.
 */
function showTable() {
  const table = document.getElementById("musicTable"); // Gets the table element by its ID.
  if (table) {
    // Checks if the table exists in the DOM.
    table.style.display = "table"; // Sets the display style to "table", making it visible.
  }
}

// === Application Initialization ===
// This block defines what happens when the entire HTML document and its resources
// (including scripts) have finished loading.
window.onload = function () {
  createContent(); // Calls `createContent()` to build and populate the user selection UI.
  // The following commented-out lines show previous or alternative initialization steps.
  // `createTable()` would create the empty table structure initially.
  // `setUpEvents()` would set up event listeners, potentially using `handleUserSelection`.
  // However, the current implementation handles event listener setup within `createContent()`.
  // createTable();
  // setUpEvents(userSelector);
};

// Exports functions that might be needed by other modules (e.g., `common.mjs` needs `updateTable`).
// This is essential for the modular structure and inter-module communication.
export { createContent, createTable, handleUserSelection, updateTable };

// The commented-out block below is an example of debugging/testing code.
// It shows how one might manually retrieve user IDs and listening events
// to inspect the raw data in the console. This is not part of the main
// application logic, but useful for development.
// // -------------- testing what user listen in their history -----------------
// // const users = getUserIDs();
// // console.log(`There are ${users.length} users`);

// // const userID = "4";
// // const events = getListenEvents(userID);

// // events.forEach((event) => {
// //   const song = getSong(event.song_id);
// //   console.log(
// //     `the user ${userID} listen "${song.title}" of ${song.artist} on ${event.timestamp}`
// //   );
// // });
