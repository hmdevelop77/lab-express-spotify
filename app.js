require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENTID,
  clientSecret: process.env.SPOTIFY_CLIENTSECRET,
});
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((artists) => spotifyApi.setAccessToken(artists.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((artists) => {
      //console.log('The received artists from the API: ', artists.body.artists.items[0]);
      res.render("artist-search-results", {
        artists: artists.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  //console.log("Id is: ", req.params.artistId);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((artists) => {
      console.log(
        "The received artists from the API: ",
        artists.body.items[0].artists[0].name
      );
      res.render("albums", {
        albums: artists.body.items,
        artist: artists.body.items[0].artists[0].name,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:trackId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.trackId)
    .then((artists) => {
      res.render("tracks", { tracks: artists.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
