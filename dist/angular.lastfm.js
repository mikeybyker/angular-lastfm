(function(){
    'use strict';

    angular
        .module('lastfm', [])
        .provider('LastFM', LastFM);

    function LastFM(){

        var endPoint = 'http://ws.audioscrobbler.com/2.0/',
            config = {api_key: null, format: 'json'};

        this.setAPIKey = function (key) {
            config.api_key = key;
            return config.api_key;
        };
        this.getAPIKey = function () {
            return config.api_key;
        };
        this.setFormat = function (format) {
            config.format = format;
            return config.format;
        };
        this.getFormat = function () {
            return config.format;
        };
        this.setEndPoint = function (url) {
            endPoint = url;
            return endPoint;
        };
        this.getEndPoint = function () {
            return endPoint;
        };

        this.$get = ["$q", "$http", function($q, $http){

            // Regex for matching Music Brainz Identifier (mbid)
            var mbidPattern = /^[a-fA-F0-9]{8}(-[a-fA-F0-9]{4}){3}-[a-fA-F0-9]{12}$/;

            function LastFMService() {
                this.version = '1.0.0';
                if(!config.api_key){
                    throw ('LastFm API key NOT set : Use setAPIKey on the provider in config...');
                }
            }

            function http(settings, options){
                var params = getParams(settings, options);
                return $http.get(endPoint, {params: params});
            }

            function getParams(settings, options){
                return  angular.extend(
                            {},             // So we don't pollute the objects
                            config,         // api_key and format
                            settings,       // method etc.
                            options || {}   // user options
                        );
            }

            function getSettings(settings, fieldName){
                fieldName = fieldName || 'artist';
                if(isMbid(settings[fieldName])){
                    settings.mbid = settings[fieldName];
                    settings[fieldName] = '';
                    // or... mbid takes precedence, regardless
                    // delete settings[fieldName];
                }
                return settings;
            }

            function isMbid(str){
                return mbidPattern.test(str);
            }

            // Docs: http://www.last.fm/api/show/album.getInfo
            function _getAlbumInfo(artistOrMbid, album, options){
                var settings = {
                            artist: artistOrMbid,
                            album: album,
                            method: 'album.getinfo'
                            // mbid: mbid,
                            // autocorrect: 1,
                            // lang: 'de'
                    };
                settings = getSettings(settings);
                return http(settings, options);
            }
            function getAlbumInfo(artistOrMbid, album, options){
                return _getAlbumInfo.apply(this, arguments)
                        .then(function(response){
                            if(response.data.error || !response.data.album){
                                return reject(response, 'Couldn\'t find this album');
                            }
                            return response.data.album;
                        });
            }

            // Docs: http://www.last.fm/api/show/album.getTopTags
            /*
                Note: Docs say artist & album optional if mbid is used...
                That appers wrong - supplying mbid returns error artist/album missing.
            */
            function _getAlbumTopTags(artistOrMbid, album, options){
                var settings = {
                            method: 'album.gettoptags',
                            album :album,
                            artist :artistOrMbid
                            // mbid :mbid,
                            // autocorrect: 1
                    };
                settings = getSettings(settings);
                return http(settings, options);
            }
            function getAlbumTopTags(artistOrMbid, album, options){
                return _getAlbumTopTags.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.toptags){
                            return reject(response, 'Error looking up tags');
                        }
                        return response.data.toptags.tag;
                    });
            }

            // Docs: http://www.last.fm/api/show/album.search
            function _searchAlbum(album, options){
                var settings = {
                            album: album,
                            method: 'album.search'
                            // limit: 10,
                            // page: 1
                    };
                return http(settings, options);
            }
            // Return the actual albums found, rather than end user digging the data for them...
            function searchAlbum(album, options){
                return _searchAlbum.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.results || !response.data.results.albummatches){
                            return reject(response, 'Couldn\'t find this album');
                        }
                        return response.data.results.albummatches.album;
                    });
            }


            // Artist

            // Docs: http://www.last.fm/api/show/artist.getInfo
            function _getArtistInfo(artistOrMbid, options){
                var settings = {
                            artist: artistOrMbid,
                            method: 'artist.getinfo'
                            // mbid: mbid,
                            // autocorrect: 1,
                            // lang: 'de'
                    };
                settings = getSettings(settings);
                return http(settings, options);
            }
            function getArtistInfo(artistOrMbid, options){
                return _getArtistInfo.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.artist){
                            return reject(response, 'Couldn\'t find artist');
                        }
                        return response.data.artist;
                    });
            }

            // Docs: http://www.last.fm/api/show/artist.getSimilar
            function _getSimilar(artistOrMbid, options){
                var settings = {
                            artist: artistOrMbid,
                            method: 'artist.getsimilar'
                            // mbid: mbid,
                            // limit: 10,
                            // autocorrect: 1
                    };
                settings = getSettings(settings);
                return http(settings, options);
            }
            function getSimilar(artistOrMbid, options){
                return _getSimilar.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.similarartists){
                            return reject(response, 'Couldn\'t find similar artists');
                        }
                        return response.data.similarartists.artist;
                    });
            }

            // Docs: http://www.last.fm/api/show/artist.getTopAlbums
            function _getTopAlbums(artistOrMbid, options){
                var settings = {
                            artist: artistOrMbid,
                            method: 'artist.gettopalbums'
                            // mbid: mbid,
                            // limit: 10,
                            // autocorrect: 1,
                            // page: 1
                    };
                settings = getSettings(settings);
                return http(settings, options);
            }
            function getTopAlbums(artistOrMbid, options){
                return _getTopAlbums.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.topalbums){
                            return reject(response, 'Couldn\'t find albums');
                        }
                        return response.data.topalbums.album;
                    });
            }

            // Docs: http://www.last.fm/api/show/artist.getTopTags
            function _getArtistTopTags(artistOrMbid, options){
                var settings = {
                            artist: artistOrMbid,
                            method: 'artist.gettoptags'
                            // mbid: mbid,
                            // autocorrect: 1
                    };
                settings = getSettings(settings);
                return http(settings, options);
            }
            function getArtistTopTags(artistOrMbid, options){
                return _getArtistTopTags.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.toptags){
                            return reject(response, 'Couldn\'t find tags');
                        }
                        return response.data.toptags.tag;
                    });
            }

            // Docs: http://www.last.fm/api/show/artist.getTopTracks
            function _getTopTracks(artistOrMbid, options){
                var settings = {
                            artist: artistOrMbid,
                            method: 'artist.gettoptracks'
                            // mbid: mbid,
                            // limit: 10,
                            // autocorrect: 1,
                            // page: 1
                    };
                settings = getSettings(settings);
                return http(settings, options);
            }
            function getTopTracks(artistOrMbid, options){
                return _getTopTracks.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.toptracks){
                            return reject(response, 'Couldn\'t find tracks');
                        }
                        return response.data.toptracks.track;
                    });
            }

            // Docs: http://www.last.fm/api/show/artist.search
            function _searchArtists(artist, options) {
                var settings = {
                            artist: artist,
                            method: 'artist.search'
                            // limit: 10,
                            // page: 1
                    };
                return http(settings, options);
            }
            function searchArtists(artist, options) {
                return _searchArtists.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.results || !response.data.results.artistmatches){
                            return reject(response, 'Couldn\'t find artist');
                        }
                        return response.data.results.artistmatches.artist;
                    });
            }


            // Charts

            // Docs: http://www.last.fm/api/show/chart.getTopArtists
            function _getTopArtists(options){
                var settings = {
                            method: 'chart.gettopartists'
                            // limit: 10,
                            // page: 1
                    };
                return http(settings, options);
            }
            function getTopArtists(options){
                return _getTopArtists.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.artists){
                            return reject(response, 'Couldn\'t find artist');
                        }
                        return response.data.artists.artist;
                    });
            }

            // Docs: http://www.last.fm/api/show/chart.getTopTags
            function _getChartsTopTags(options){
                var settings = {
                            method: 'chart.gettoptags'
                            // limit: 10,
                            // page: 1
                    };
                return http(settings, options);
            }
            function getChartsTopTags(options){
                return _getChartsTopTags.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.tags){
                            return reject(response, 'Couldn\'t find tags');
                        }
                        return response.data.tags.tag;
                    });
            }

            // Docs: http://www.last.fm/api/show/chart.getTopTracks
            function _getChartsTopTracks(options){
                var settings = {
                            method: 'chart.gettoptracks'
                            // limit: 10,
                            // page: 1
                    };
                return http(settings, options);
            }
            function getChartsTopTracks(options){
                return _getChartsTopTracks.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.tracks){
                            return reject(response, 'Couldn\'t find tracks');
                        }
                        return response.data.tracks.track;
                    });
            }


            // Geo

            // Docs: http://www.last.fm/api/show/geo.getTopArtists
            function _getTopGeoArtists(country, options){
                var settings = {
                            country: country,
                            method: 'geo.gettopartists'
                            // limit: 10,
                            // page: 1
                    };
                return http(settings, options);
            }
            function getTopGeoArtists(country, options){
                return _getTopGeoArtists.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.topartists){
                            return reject(response, 'Couldn\'t find artists');
                        }
                        return response.data.topartists.artist;
                    });
            }

            // Docs: http://www.last.fm/api/show/geo.getTopTracks
            function _getTopGeoTracks(country, options){
                var settings = {
                            country: country,
                            method: 'geo.gettoptracks'
                            // limit: 10,
                            // page: 1,
                            // location: 'Manchester'
                    };
                return http(settings, options);
            }
            function getTopGeoTracks(country, options){
                return _getTopGeoTracks.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.tracks){
                            return reject(response, 'Couldn\'t find tracks');
                        }
                        return response.data.tracks.track;
                    });
            }


            // Track

            // Docs: http://www.last.fm/api/show/track.getInfo
            function _getTrackInfo(artistOrMbid, track, options){
                var settings = {
                            artist: artistOrMbid,
                            track: track,
                            method: 'track.getInfo'
                            // mbid: mbid,
                            // autocorrect: 1
                    };
                settings = getSettings(settings);
                return http(settings, options);
            }
            function getTrackInfo(artistOrMbid, track, options){
                return _getTrackInfo.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.track){
                            return reject(response, 'Couldn\'t find track');
                        }
                        return response.data.track;
                    });
            }

            // Docs: http://www.last.fm/api/show/track.getSimilar
            function _getSimilarTrack(artistOrMbid, track, options){
                var settings = {
                            artist: artistOrMbid,
                            track: track,
                            method: 'track.getsimilar'
                            // mbid: mbid,
                            // autocorrect: 1,
                            // limit: 10
                    };
                settings = getSettings(settings);
                return http(settings, options);
            }
            function getSimilarTrack(artistOrMbid, track, options){
                return _getSimilarTrack.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.similartracks){
                            return reject(response, 'Couldn\'t find similar tracks');
                        }
                        return response.data.similartracks.track;
                    });
            }
//@todo artist > artistOrMbid
            // Docs: http://www.last.fm/api/show/track.getTopTags
            function _getTrackTopTags(artist, track, options){
                var settings = {
                            artist: artist,
                            track: track,
                            method: 'track.gettoptags'
                            // mbid: mbid,
                            // autocorrect: 1
                    };
                settings = getSettings(settings);
                return http(settings, options);
            }
            function getTrackTopTags(artist, track, options){
                return _getTrackTopTags.apply(this, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.toptags){
                            return reject(response, 'Couldn\'t find tags');
                        }
                        return response.data.toptags.tag;
                    });
            }

            // Docs: http://www.last.fm/api/show/track.search
            function _searchTrack(track, options){
                var settings = {
                            track: track,
                            method: 'track.search'
                            // limit: 10,
                            // page: 1
                    };
                return http(settings, options);
            }
            function searchTrack(track, options){
                // console.log(LastFMService.prototype);
                return _searchTrack.apply(LastFMService.prototype, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.results || !response.data.results.trackmatches){
                            return reject(response, 'Couldn\'t find track');
                        }
                        return response.data.results.trackmatches.track;
                    });
            }


            function reject(response, reason){
                var error = {
                        error: response.data.error || true,
                        statusText: response.data.message || (reason || 'Error')
                    };
                return $q.reject(error);
            }

            LastFMService.prototype = {
                getParams :         getParams,
                isMbid :            isMbid,
                Album: {
                    getInfo:        getAlbumInfo.bind(this),
                    getTopTags:     getAlbumTopTags.bind(this),
                    search:         searchAlbum.bind(this),
                    _getInfo:       _getAlbumInfo.bind(this),
                    _getTopTags:    _getAlbumTopTags.bind(this),
                    _search:        _searchAlbum.bind(this)
                },
                Artist: {
                    getInfo:        getArtistInfo.bind(this),
                    getSimilar:     getSimilar.bind(this),
                    getTopAlbums:   getTopAlbums.bind(this),
                    getTopTags:     getArtistTopTags.bind(this),
                    getTopTracks:   getTopTracks.bind(this),                    
                    search:         searchArtists.bind(this),
                    _getInfo:       _getArtistInfo.bind(this),
                    _getSimilar:    _getSimilar.bind(this),
                    _getTopAlbums:  _getTopAlbums.bind(this),
                    _getTopTags:    _getArtistTopTags.bind(this),
                    _getTopTracks:  _getTopTracks.bind(this),
                    _search:        _searchArtists.bind(this)
                },
                Charts: {                    
                    getTopArtists:  getTopArtists.bind(this),
                    getTopTags:     getChartsTopTags.bind(this),
                    getTopTracks:   getChartsTopTracks.bind(this),                    
                    _getTopArtists: _getTopArtists.bind(this),
                    _getTopTags:    _getChartsTopTags.bind(this),
                    _getTopTracks:  _getChartsTopTracks.bind(this)
                },
                Geo : {
                     getTopArtists:  getTopGeoArtists.bind(this),
                     getTopTracks:   getTopGeoTracks.bind(this),                   
                    _getTopArtists: _getTopGeoArtists.bind(this),
                    _getTopTracks:  _getTopGeoTracks.bind(this)
                },
                Track: {                    
                    getInfo:        getTrackInfo.bind(this),
                    getSimilar:     getSimilarTrack.bind(this),
                    getTopTags:     getTrackTopTags.bind(this),
                    search:         searchTrack.bind(this),
                    _getInfo:       _getTrackInfo.bind(this),
                    _getSimilar:    _getSimilarTrack.bind(this),
                    _getTopTags:    _getTrackTopTags.bind(this),
                    _search:        _searchTrack.bind(this)
                }
            }

            var _p = LastFMService.prototype;

            return new LastFMService();
        }]

    }

}());