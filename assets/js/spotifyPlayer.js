window.onSpotifyWebPlaybackSDKReady = () => {
  const token =
    "BQB8uiU1w1L-EjEa4dimKeIu_ydtK0P6NL--DYSM8Bu50-C5AxWUgXdEkD7h_vZAMrU4BJHFI7A_WMxMFi0maE-qcBjkHpV7QfQcEtzuFX0_9PSP6krJvhVfqJNE5UrL7vWkTNqN0ANZBhKM_UnlAxbmVfG6uqYAJ0J5Q72nk2ryLBehBsn5mNRC8wcfRXPpFFnABT4";
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); },
    volume: 0.5
  });

    // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  })

    player.connect();

    $("#togglePlay").on("click", function () {
        player.togglePlay();
    })
};

$(document).ready(function () {
  const accessToken =
    "BQB8uiU1w1L-EjEa4dimKeIu_ydtK0P6NL--DYSM8Bu50-C5AxWUgXdEkD7h_vZAMrU4BJHFI7A_WMxMFi0maE-qcBjkHpV7QfQcEtzuFX0_9PSP6krJvhVfqJNE5UrL7vWkTNqN0ANZBhKM_UnlAxbmVfG6uqYAJ0J5Q72nk2ryLBehBsn5mNRC8wcfRXPpFFnABT4"; 
  const trackUri = "spotify:track:5Hroj5K7vLpIG4FNCRIjbP"; 

  // Initialize the Spotify player
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: "Your Web App Name",
      getOAuthToken: (cb) => {
        cb(accessToken);
      },
    });

    // Connect to the player
    player.connect();

    // Play the specified track when the player is ready
    player.addListener("ready", ({ device_id }) => {
      playTrack(device_id, trackUri);
    });
  };

  // Function to play a specific track
  function playTrack(device_id, trackUri) {
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
      type: "PUT",
      data: JSON.stringify({ uris: [trackUri] }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      success: function (response) {
        console.log("Track is now playing:", response);
      },
      error: function (error) {
        console.error("Error playing track:", error);
      },
    });
  }
});
