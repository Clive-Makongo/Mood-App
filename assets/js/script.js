$(document).ready(function () {
  const storedSearchesContainer = $("#storedSearchesContainer");
  const searchInput = $("#searchInput");
  const moodPlaylistsContainer = $("#moodPlaylistsContainer");
  const spotifyPlayerContainer = $("#spotifyPlayerContainer");

  let searchInputValue = "";
  let accessToken =
    "BQDGrDck9r87X_DodBqt5bPf7T1u_v9JxAStyMQYoyThCLaAM5RRs4zqAZN3_kX4CALF_vNYio85T7B8efBpp7rYc7PBKPTRz-hfQW96xj4bMSfzKpvGXyBVGBWZ01ZC1ptT9id5r9gUUjVC6vZ-ivuo25kJOj-ck4_KHX6_7Bdi4a5SJynTVcM3rC0Jd3FBx4Yr-Lk";
  let moodPlaylists = [];
  let selectedPlaylistUri = "";

  // WEB PLAYER
  let spotifyPlayer;

  function initSpotifyPlayer() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = accessToken;

      spotifyPlayer = new Spotify.Player({
        name: "Your Web App Name",
        getOAuthToken: (cb) => {
          cb(token);
        },
      });
      // Error handling

      // Connect to the player
      spotifyPlayer.connect();
    };
  }

  function playTrack(uri) {
    spotifyPlayer.resume();
    spotifyPlayer.play({
      uris: [uri],
    });
  }

  function getPlaylistTracks(playlistId) {
    authenticateSpotify()
      .then(() => {
        const playlistTracksEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

        return axios.get(playlistTracksEndpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      })
      .then((response) => {
        const tracks = response.data.items;
        console.log("Tracks in the selected playlist:", tracks);

        // Play the first track in the playlist
        if (tracks.length > 0) {
          playTrack(tracks[0].track.uri);
        }
      })
      .catch((error) => {
        console.error("Error retrieving playlist tracks:", error);
      });
  }

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
        console.log(
          "Playlists:",
          playlists,
          response,
          response.playlists.items[0].tracks
        );

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
    const clientSecret = "5613691d1dfe4c9a8b0ab38d79f3170f";

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
        const playlistTracksEndpoint =
          "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

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

  // Initialize the Spotify Player
  initSpotifyPlayer();
  const searchButton = $("#searchButton");
  searchButton.on("click", getSearchInput);
  

  // ... (Rest of your code)
});