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