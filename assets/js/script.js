$(document).ready(function () {
  const storedSearchesContainer = $("#storedSearchesContainer");
  const searchInput = $("#searchInput");
  const moodPlaylistsContainer = $("#moodPlaylistsContainer");
  const spotifyPlayerContainer = $("#spotifyPlayerContainer");

  let searchInputValue = "";
  let accessToken = "";
  let moodPlaylists = [];
  let selectedPlaylistUri = "";

  function getSearchInput() {
    searchInputValue = searchInput.val();
    console.log("Search input value:", searchInputValue);
    search(searchInputValue);
  }

  function search(searchValue) {
    authenticateSpotify()
      .then((accessToken) => {
        const searchEndpoint = `https://api.spotify.com/v1/search?q=${searchValue}&type=playlist`;

        return $.ajax({
          url: searchEndpoint,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      })
      .then((response) => {
        const playlists = response.playlists.items;
        console.log("Playlists:", playlists, response, response.playlists.items[0].tracks);

        // Render the first playlist only
        if (playlists.length > 0) {
          renderMoodPlaylist(playlists[0]);
        }
      })
      .catch((error) => {
        console.error("Error searching for playlists:", error);
      });
  }

  function authenticateSpotify() {
    // REPLACE CLIENT ID
    const clientId = "746bd7c02af2439a94e089e6a1cdfa95";
    const clientSecret = "746bd7c02af2439a94e089e6a1cdfa95";

    const base64Credentials = btoa(`${clientId}:${clientSecret}`);

    return $.ajax({
      type: "POST",
      url: "https://accounts.spotify.com/api/token",
      data: "grant_type=client_credentials",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${base64Credentials}`,
      },
    })
    .then((response) => response.access_token)
    .catch((error) => {
      console.error("Error authenticating with Spotify:", error);
      throw error;
    });
  }

  function renderMoodPlaylist(playlist) {
    moodPlaylistsContainer.empty(); // Clear previous content

    const playlistDiv = $("<div>").css({
      borderRadius: "1rem",
      boxShadow: "4px 1px 30px rgba(219, 52, 235)",
    });

    const playlistImage = $("<img>").attr("src", playlist.images[0].url);
    playlistDiv.append(playlistImage);

    const playlistTitle = $("<h3>").text(playlist.name);
    playlistDiv.append(playlistTitle);

    const playlistTracks = $("<p>").text(`${playlist.tracks.total} TRACKS`);
    playlistDiv.append(playlistTracks);

    const loadButton = $("<button>").text("Load Mood To Playlist");
    loadButton.on("click", () => {
      getPlaylistTracks(playlist.id);
    });
    playlistDiv.append(loadButton);

    moodPlaylistsContainer.append(playlistDiv);
  }

  function getPlaylistTracks(playlistId) {
    authenticateSpotify()
      .then((accessToken) => {
        const playlistTracksEndpoint = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

        return $.ajax({
          url: playlistTracksEndpoint,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      })
      .then((response) => {
        const tracks = response.items;
        console.log("Tracks in the selected playlist:", tracks);

        // You can now do something with the tracks, such as displaying them or further processing
        // For simplicity, let's just log the track names
        tracks.forEach((track) => {
          console.log("Track name:", track.track.artists[0].name);
        });
      })
      .catch((error) => {
        console.error("Error retrieving playlist tracks:", error);
      });
  }


  const searchButton = $("#searchButton");
  searchButton.on("click", getSearchInput);

  // ... (Rest of your code)
});