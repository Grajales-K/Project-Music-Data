
// common.mjs
// This module contains the core data processing logic for the "Music Data Project".
// Its main responsibility is to take a user's raw listening events and
// compute various statistics and insights, which are then formatted and passed
// to the UI for display. It performs calculations for:
// - Most listened song/artist (by count and time)
// - Most listened song on Friday nights
// - Longest consecutive song streak
// - Songs listened to every day
// - Top genres

// Imports functions to retrieve listening event data and song details.
// `getListenEvents(userID)`: Fetches a user's chronological listening history.
// `getSong(songID)`: Retrieves detailed information for a specific song.
import { getListenEvents, getSong } from "./data.mjs";
// Imports `updateTable` from `script.mjs`. This creates a **circular dependency**
// (`common.mjs` imports `script.mjs`, and `script.mjs` imports `common.mjs`).
// While it works in modern JS modules, it can sometimes be a sign of tightly coupled
// modules. The purpose here is for `common.mjs` to pass the processed results back
// to `script.mjs` for UI rendering.
import { updateTable } from "./script.mjs";

/**
 * @function processUserData
 * @description Orchestrates the entire data processing pipeline for a given user.
 * It retrieves listening events, initializes data structures, iterates through
 * each event to accumulate statistics, computes final insights, and then
 * updates the UI with the results.
 * @param {string} userID - The ID of the user whose listening data needs to be analyzed.
 */
export function processUserData(userID) {
  // Retrieve the user's raw listening events using the `getListenEvents` function.
  // This array contains objects with `timestamp` and `song_id`.
  const events = getListenEvents(userID);

  // --- Edge Case Handling: No Listening History ---
  // If `events` is null, undefined, or an empty array, it means the user has no
  // listening history. In this case, `updateTable()` is called without data,
  // which will trigger the display of a "No music for this user" message.
  if (!events || events.length === 0) {
    updateTable(); // Call UI function to display appropriate message
    return; // Exit the function as there's no data to process.
  }

  // ------------------------- Initialize Counters & Data Structures -------------------------
  // These objects will act as frequency maps or accumulators. Keys will be song titles,
  // artist names, or genre names, and values will be their corresponding counts or total durations.
  let songCount = {}; // Stores how many times each song was listened to.
  let songTime = {}; // Stores total listening duration (seconds) for each song.
  let artistCount = {}; // Stores how many times each artist was listened to.
  let artistTime = {}; // Stores total listening duration (seconds) for each artist.
  let genreCount = {}; // Stores how many times each genre was listened to.

  // Additional tracking variables for more complex analysis questions.
  let fridayNightSongs = {}; // Counts listens for songs specifically on Friday nights.
  let fridayNightTime = {}; // Accumulates listening time for songs on Friday nights.
  let songDays = {}; // Stores a Set of unique days (as strings) each song was played on.
                      // This is used to determine "every day songs."

  // Variables for tracking the longest consecutive listening streak of the same song.
  let maxStreak = 0; // Stores the maximum streak length found so far.
  let currentStreak = 1; // Stores the streak length of the current song being processed.
  let streakSongs = []; // Stores the name(s) of the song(s) that achieved `maxStreak`.
  let prevSong = ""; // Stores the key of the previous song played, used for streak comparison.

  // Calculate the total number of *unique* days the user listened to music.
  // `events.map(x => new Date(x.timestamp).toDateString())` extracts just the date part (e.g., "Fri Aug 01 2024")
  // for each event.
  // `new Set(...)` creates a collection of only unique date strings.
  // `.size` then gives the count of these unique days. This is crucial for the "every day songs" question.
  const totalDays = new Set(
    events.map((x) => new Date(x.timestamp).toDateString())
  ).size;

  // ------------------------------ Process Each Listening Event ------------------------------
  // This is the main iteration loop where all the raw data is processed event by event.
  // Each iteration updates the various counter and tracking objects initialized above.
  for (let event of events) {
    // Retrieve full song details (artist, title, genre, duration) for the current `song_id`.
    let song = getSong(event.song_id);
    // Create a standardized and unique key for each song (e.g., "Artist - Song Title").
    // This ensures that different songs with the same title by different artists, or
    // slight variations, are treated as distinct if needed, and provides a readable key.
    let songKey = `${song.artist} - ${song.title}`;

    // --- Most Listened Song (Count and Time) ---
    // Increment the listen count for the current song. `(songCount[songKey] || 0)` ensures
    // that if the song hasn't been encountered yet, its count starts at 0 before incrementing.
    songCount[songKey] = (songCount[songKey] || 0) + 1;
    // Accumulate the total listening time for the current song.
    songTime[songKey] = (songTime[songKey] || 0) + song.duration_seconds;

    // --- Most Listened Artist (Count and Time) ---
    // Increment the listen count for the current song's artist.
    artistCount[song.artist] = (artistCount[song.artist] || 0) + 1;
    // Accumulate total listening time for the current song's artist.
    artistTime[song.artist] =
      (artistTime[song.artist] || 0) + song.duration_seconds;

    // --- Top Genres ---
    // Increment the count for the current song's genre.
    genreCount[song.genre] = (genreCount[song.genre] || 0) + 1;

    // --- Friday Night Songs (Count and Time) ---
    // Create a Date object from the event's timestamp to extract day of week and hour.
    let date = new Date(event.timestamp);
    let day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday.
    let hour = date.getHours(); // 0-23.

    // Check if the event occurred on a "Friday night" based on the definition:
    // "Friday (day 5) from 5 PM (17:00) onwards" OR
    // "Saturday (day 6) before 4 AM (04:00)".
    if ((day === 5 && hour >= 17) || (day === 6 && hour < 4)) {
      fridayNightSongs[songKey] = (fridayNightSongs[songKey] || 0) + 1;
      fridayNightTime[songKey] =
        (fridayNightTime[songKey] || 0) + song.duration_seconds;
    }

    // --- Every Day Songs ---
    // Ensure `songDays[songKey]` exists and is a Set. If not, initialize it as a new Set.
    // A Set stores only unique values, so it will record each unique day a song was played.
    songDays[songKey] = songDays[songKey] || new Set();
    // Add the current event's date (formatted as a string to represent just the day) to the Set.
    // If the same song is played multiple times on the same day, the Set will only store that day once.
    songDays[songKey].add(date.toDateString());

    // --- Longest Streak Song ---
    // Compares the `songKey` of the current event with the `prevSong` (the song from the previous event).
    if (songKey === prevSong) {
      currentStreak++; // If it's the same song, increment the `currentStreak`.
    } else {
      currentStreak = 1; // If it's a different song, reset `currentStreak` to 1.
      prevSong = songKey; // Update `prevSong` to the current song for the next iteration.
    }
    // Check if the `currentStreak` has surpassed the `maxStreak` found so far.
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak; // Update `maxStreak`.
      streakSongs = [songKey]; // Start a new list of `streakSongs` with the current song.
    } else if (currentStreak === maxStreak) {
      // If the `currentStreak` is equal to the `maxStreak`, it means there's another song
      // or set of songs that achieved the same longest streak length. Add it to the list.
      streakSongs.push(songKey);
    }
  }

  // ------------------------------ Compute Final Results ------------------------------
  // After iterating through all events, calculate the final answers to the questions.

  // --- Most Listened Song (Count) ---
  // Uses `Object.keys()` to get an array of all unique song keys.
  // `reduce()` iterates through these keys to find the one with the highest `songCount`.
  // `(a, b) => (songCount[a] >= songCount[b] ? a : b)` is the reducer logic: it compares
  // the counts of two songs (`a` and `b`) and returns the key of the one with the higher count.
  // The initial value for `reduce` is an empty string `""`, which acts as the starting 'most played'.
  let mostPlayedSong = Object.keys(songCount).reduce(
    (a, b) => (songCount[a] >= songCount[b] ? a : b),
    ""
  );
  // --- Most Listened Song (Time) ---
  // Same logic as above, but uses `songTime` to find the song with the longest total listening duration.
  let mostPlayedSongByTime = Object.keys(songTime).reduce(
    (a, b) => (songTime[a] >= songTime[b] ? a : b),
    ""
  );
  // --- Most Listened Artist (Count) ---
  // Same logic, but uses `artistCount` to find the artist with the most listens.
  let mostPlayedArtist = Object.keys(artistCount).reduce(
    (a, b) => (artistCount[a] >= artistCount[b] ? a : b),
    ""
  );
  // --- Most Listened Artist (Time) ---
  // Same logic, but uses `artistTime` to find the artist with the longest total listening duration.
  let mostPlayedArtistByTime = Object.keys(artistTime).reduce(
    (a, b) => (artistTime[a] >= artistTime[b] ? a : b),
    ""
  );

  // --- Top Genres ---
  // 1. `Object.keys(genreCount)`: Get all unique genre names.
  // 2. `.sort((a, b) => genreCount[b] - genreCount[a])`: Sorts genres in descending order based on their counts.
  //    `genreCount[b] - genreCount[a]` achieves descending order.
  // 3. `.slice(0, 3)`: Takes only the top 3 genres from the sorted list.
  let topGenres = Object.keys(genreCount)
    .sort((a, b) => genreCount[b] - genreCount[a])
    .slice(0, 3);

  // --- Every Day Songs ---
  // 1. `Object.keys(songDays)`: Get all song keys that were played at least once.
  // 2. `.filter((song) => songDays[song].size === totalDays)`: Filters this list
  //    to include only those songs whose `Set` of unique listening days has a size
  //    equal to the `totalDays` the user listened to music. This identifies "every day songs".
  // 3. `.join(", ")`: Joins the names of these songs into a single comma-separated string.
  // 4. `|| ""`: If no songs meet the criteria, default to an empty string.
  let everydaySongs =
    Object.keys(songDays)
      .filter((song) => songDays[song].size === totalDays)
      .join(", ") || "";

  // --- Most Played Song on Friday Nights (Count and Time) ---
  // Similar `reduce` logic to find the song with the highest count among Friday night listens.
  let topFridaySong = Object.keys(fridayNightSongs).reduce(
    (a, b) => (fridayNightSongs[a] >= fridayNightSongs[b] ? a : b),
    ""
  );
  // Similar `reduce` logic to find the song with the longest listening duration among Friday night listens.
  let topFridaySongByTime = Object.keys(fridayNightTime).reduce(
    (a, b) => (fridayNightTime[a] >= fridayNightTime[b] ? a : b),
    ""
  );

  // ------------------------------ Format Results for Display ------------------------------
  // Creates an array of objects, where each object represents a question-answer pair
  // ready for display in the HTML table.
  let results = [
    // The `&&` operator is used here as a conditional inclusion.
    // If `mostPlayedSong` is a non-empty string (truthy), the object `{ question: ..., answer: ... }`
    // is included in the array. If `mostPlayedSong` is an empty string (falsy), `false` is included.
    mostPlayedSong && {
      question: "Most listened song (count)",
      answer: mostPlayedSong,
    },
    mostPlayedSongByTime && {
      question: "Most listened song (time)",
      answer: mostPlayedSongByTime,
    },
    mostPlayedArtist && {
      question: "Most listened artist (count)",
      answer: mostPlayedArtist,
    },
    mostPlayedArtistByTime && {
      question: "Most listened artist (time)",
      answer: mostPlayedArtistByTime,
    },
    // Friday night questions are only included if `topFridaySong` has a value (meaning there were Friday night listens).
    topFridaySong && {
      question: "Friday night song (count)",
      answer: topFridaySong,
    },
    topFridaySongByTime && {
      question: "Friday night song (time)",
      answer: topFridaySongByTime,
    },
    // Longest streak song is only included if `streakSongs` has elements.
    streakSongs.length && {
      question: "Longest streak song",
      // Formats the answer to include all songs that achieved the max streak and the streak length.
      answer: `${streakSongs.join(", ")} (length: ${maxStreak})`,
    },
    // "Every day songs" is only included if `everydaySongs` is not an empty string.
    everydaySongs && { question: "Every day songs", answer: everydaySongs },
    // Top genres are handled by a separate helper function to customize the label.
    // This is only included if `topGenres` array has elements.
    topGenres.length && getGenres(topGenres),
  ].filter(Boolean); // The `filter(Boolean)` method removes any `false` (or `null`, `undefined`, empty string, 0)
                     // values from the `results` array. This effectively hides questions for which
                     // no data was found or no answer applies, meeting a key requirement.

  // -------------------- Update the UI with the computed results --------------------------
  // Calls the `updateTable` function (imported from `script.mjs`) to render the `results`
  // into the HTML table on the web page. This completes the data processing and display cycle.
  updateTable(results);
}

/**
 * @function getGenres
 * @description A helper function to format the question and answer for the "Top Genres" section,
 * dynamically adjusting the label based on the number of genres found (e.g., "Top 1 Genre", "Top 3 Genres").
 * @param {string[]} topGenres - An array of the top genre names.
 * @returns {Object} An object with `question` and `answer` properties, suitable for display.
 */
export function getGenres(topGenres) {
  // Determine if "Genre" or "Genres" should be used based on the count.
  const singularGender = topGenres.length === 1 ? "Genre" : "Genres";
  // Constructs the question label dynamically (e.g., "Top 3 Genres", "Top 1 Genre").
  const label = `Top ${topGenres.length} ${singularGender}`;

  // Returns the formatted object.
  return { question: label, answer: topGenres.join(", ") }; // Joins genre names with a comma and space.
}
