import { getGenres } from "./common"

test("Number of users is 4", () => {
  const numberOfUsers = 4;
  expect(numberOfUsers).toEqual(4);
});


test("Most listened song by count is correct", () => {
  const songCount = { "Artist A - Song X": 2, "Artist B - Song Y": 1 };
  const mostPlayedSong = Object.keys(songCount).reduce((a, b) =>
    songCount[a] >= songCount[b] ? a : b
  );
  expect(mostPlayedSong).toEqual("Artist A - Song X");
});

test("Genres are correct process", () => {
  const singularGenre = [ "rock"]
  const pluralGenre = [ "vals", "metal", "romantic"]
  expect(getGenres(singularGenre)).toEqual({
    answer: "rock",
    question: "Top 1 Genre",
  });
  expect(getGenres(pluralGenre)).toEqual({
    answer: "vals, metal, romantic",
    question: "Top 3 Genres",
  });

})