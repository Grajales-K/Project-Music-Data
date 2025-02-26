// /*
//   expected output result
//   Most listened song by count
//   Most listened song by time
//   Most listened song by count
//   Most listened song by time
//   Most listened artist by count
//   Most listened artist by time
//   Most listened song on Friday nights (by count and time)
//   Longest streak song
//   Everyday songs
//   Top genres
// */

import { getListenEvents, getSong } from "./data.js";
import { updateTable } from "./script.js";

/**
 * Processes user listening data and extracts key insights.
 * Computes statistics such as most listened songs, artists, and genres.
 * Updates the table with the results.
 * @param {string} userID - The ID of the user whose data is being processed.
 */

export function processUserData(userID) {
  // Retrieve the user's listening events
  const events = getListenEvents(userID);

  // If no listening history is found, update the table with a message and exit
  if (!events || events.length === 0) {
    updateTable();
    return;
  }

  // ------------------------- Initialize Counters & Data Structures -------------------------
  // These objects will store the counts and time durations for songs, artists, and genres.
  let songCount = {},
    songTime = {},
    artistCount = {},
    artistTime = {},
    genreCount = {};

  // Additional tracking for specific patterns like Friday night songs, song streaks, etc.
  let fridayNightSongs = {},
    fridayNightTime = {},
    songDays = {};

  let maxStreak = 0,
    currentStreak = 1,
    streakSongs = [],
    prevSong = "";

  // Count the total number of unique days the user listened to music
  const totalDays = new Set(
    events.map((x) => new Date(x.timestamp).toDateString())
  ).size;

  // ------------------------------ Process Each Listening Event ------------------------------
  for (let event of events) {
    let song = getSong(event.song_id); // Retrieve song details
    let songKey = `${song.artist} - ${song.title}`; // Create a unique key for the song

    // Count how many times each song was played
    songCount[songKey] = (songCount[songKey] || 0) + 1;
    songTime[songKey] = (songTime[songKey] || 0) + song.duration_seconds;

    // Count how many times each artist was played and total listening time
    artistCount[song.artist] = (artistCount[song.artist] || 0) + 1;
    artistTime[song.artist] =
      (artistTime[song.artist] || 0) + song.duration_seconds;

    // Count genre popularity
    genreCount[song.genre] = (genreCount[song.genre] || 0) + 1;

    // Identify songs played on Friday nights (Friday 17:00 - Saturday 03:59)
    let date = new Date(event.timestamp);
    let day = date.getDay(),
      hour = date.getHours();
    if ((day === 5 && hour >= 17) || (day === 6 && hour < 4)) {
      fridayNightSongs[songKey] = (fridayNightSongs[songKey] || 0) + 1;
      fridayNightTime[songKey] =
        (fridayNightTime[songKey] || 0) + song.duration_seconds;
    }

    // Track which songs were played every day
    songDays[songKey] = songDays[songKey] || new Set();
    songDays[songKey].add(date.toDateString());

    // Track longest consecutive listening streak of the same song
    if (songKey === prevSong) {
      currentStreak++;
    } else {
      currentStreak = 1;
      prevSong = songKey;
    }
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
      streakSongs = [songKey];
    } else if (currentStreak === maxStreak) {
      streakSongs.push(songKey);
    }
  }

  // ------------------------------ Compute Final Results ------------------------------
  // Determine the most played song, artist, and top genres
  let mostPlayedSong = Object.keys(songCount).reduce(
    (a, b) => (songCount[a] >= songCount[b] ? a : b),
    ""
  );
  let mostPlayedSongByTime = Object.keys(songTime).reduce(
    (a, b) => (songTime[a] >= songTime[b] ? a : b),
    ""
  );
  let mostPlayedArtist = Object.keys(artistCount).reduce(
    (a, b) => (artistCount[a] >= artistCount[b] ? a : b),
    ""
  );
  let mostPlayedArtistByTime = Object.keys(artistTime).reduce(
    (a, b) => (artistTime[a] >= artistTime[b] ? a : b),
    ""
  );
  let topGenres = Object.keys(genreCount)
    .sort((a, b) => genreCount[b] - genreCount[a])
    .slice(0, 3);

  // Find songs played every single day
  let everydaySongs =
    Object.keys(songDays)
      .filter((song) => songDays[song].size === totalDays)
      .join(", ") || "";

  // Identify the most played song on Friday nights
  let topFridaySong = Object.keys(fridayNightSongs).reduce(
    (a, b) => (fridayNightSongs[a] >= fridayNightSongs[b] ? a : b),
    ""
  );
  let topFridaySongByTime = Object.keys(fridayNightTime).reduce(
    (a, b) => (fridayNightTime[a] >= fridayNightTime[b] ? a : b),
    ""
  );

  // ------------------------------ Format Results for Display ------------------------------
  let results = [
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
    topFridaySong && {
      question: "Friday night song (count)",
      answer: topFridaySong,
    },
    topFridaySongByTime && {
      question: "Friday night song (time)",
      answer: topFridaySongByTime,
    },
    streakSongs.length && {
      question: "Longest streak song",
      answer: `${streakSongs.join(", ")} (length: ${maxStreak})`,
    },
    everydaySongs && { question: "Every day songs", answer: everydaySongs },
    topGenres && getGenres(topGenres),
  ].filter(Boolean);

  // -------------------- Update the UI with the computed results --------------------------
  updateTable(results);
}

export function getGenres(topGenres) {
  const singularGender = topGenres.length === 1 ? "Genre" : "Genres";
  const label = `Top ${topGenres.length} ${singularGender}`;

  return { question: label, answer: topGenres.join(", ") };
}

// Answer && Question ?
// False && True  => False Not Show
// True && True => True  Show

//"" ==  False

///HI Iam here
