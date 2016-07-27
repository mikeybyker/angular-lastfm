# Angular LastFM

[![Build Status](https://travis-ci.org/mikeybyker/angular-lastfm.svg?branch=master)](https://travis-ci.org/mikeybyker/angular-lastfm)

An Angular LastFm API service. The services covered are those not requiring authentication. A [Last.FM](http://www.last.fm/api) API Key is required.

### Usage

Add as dependency...

```javascript
var app = angular.module('app', ['lastfm']);
```

Set your API key in a config block...

```javascript
app.config(function (LastFMProvider) {
    LastFMProvider.setAPIKey('YOUR_API_KEY');
});
```

Inject into controllers...
```javascript
app.controller('MainCtrl', function (Lastfm) {
    //
});
```

Each call will return a promise.

```javascript
// e.g.
$ctrl.albums = LastFM.Artist.getTopAlbums('The Cure');

// or
LastFM.Artist.getTopAlbums('The Cure')
    .then(albums){
        console.log(albums);
    });
```

Send in an object to set any options - see [Last.FM](http://www.last.fm/api) for each call.

```javascript
// e.g.
LastFM.Artist.getSimilar('The Cure', {limit: 10})
    .then(artists){
        console.log(artists);
    });
```

### MusicBrainz Identifier

If a [MusicBrainz Identifier](https://musicbrainz.org/doc/MusicBrainz_Identifier) (mbid) is accepted by a method, the other parameters are not required.

```javascript
// e.g.
LastFM.Track.getSimilar('The Cure', 'Faith')
    .then(tracks){
        console.log(tracks);
    });

// Or using mbid...
LastFM.Track.getSimilar('e7da35ed-ad25-4721-a3b2-43784fa4f856')
    .then(tracks){
        console.log(tracks);
    });
```

### Full Response Data

The main methods dig out and return the relevant data from the last.fm response. If you require the full response, append an underscore to the method name.

```javascript
// e.g.
LastFM.Artist._getTopAlbums('The Cure')
    .then(function(response){
        // To get the array of albums,
        // look for...
        console.log(response.data.topalbums.album);
    });
```

### Methods

The following methods are available:

#### Albums
  - LastFM.Album.getInfo(artist or mbid, album, options);
  - LastFM.Album.getTopTags(artist or mbid, album, options);
  - LastFM.Album.search(album, options);

#### Artist
  - LastFM.Artist.getInfo(artist or mbid, options);
  - LastFM.Artist.getSimilar(artist or mbid, options);
  - LastFM.Artist.getTopAlbums(artist or mbid, options);
  - LastFM.Artist.getTopTags(artist or mbid, options);
  - LastFM.Artist.getTopTracks(artist or mbid, options);
  - LastFM.Artist.search(artist, options);

#### Charts
  - LastFM.Charts.getTopArtists(options);
  - LastFM.Charts.getTopTags(options);
  - LastFM.Charts.getTopTracks(options);

#### Geo
  - LastFM.Geo.getTopArtists(country, options);
  - LastFM.Geo.getTopTracks(country, options);

#### Track
  - LastFM.Track.getInfo(artist or mbid, track, options);
  - LastFM.Track.getSimilar(artist or mbid, track, options);
  - LastFM.Track.getTopTags(artist or mbid, track, options);
  - LastFM.Track.search(track, options);

### Version
1.0.0

Mike