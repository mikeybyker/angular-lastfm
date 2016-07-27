/* global getJSONFixture */

describe('angular-lastfm', function () {

    // For the config
    describe('LastFMProvider', function () {

        var lastFMProvider;

        beforeEach(function () {
            module('lastfm', function (_LastFMProvider_) {
                lastFMProvider = _LastFMProvider_;
            });

            inject(function () {});
        });

        it('should be defined', function () {
            expect(lastFMProvider).toBeDefined();
        });

        it('should have a method setAPIKey()', function () {
            expect(lastFMProvider.setAPIKey).toBeDefined();
        });

        it('should have a method getAPIKey()', function () {
            expect(lastFMProvider.getAPIKey).toBeDefined();
        });

        it('should have a method setFormat()', function () {
            expect(lastFMProvider.setFormat).toBeDefined();
        });

        it('should have a method getFormat()', function () {
            expect(lastFMProvider.getFormat).toBeDefined();
        });

        it('should have a method setEndPoint()', function () {
            expect(lastFMProvider.setEndPoint).toBeDefined();
        });

        it('should have a method getEndPoint()', function () {
            expect(lastFMProvider.getEndPoint).toBeDefined();
        });

    });
    // End For the config


    // For injecting into controllers
    describe('LastFM', function () {

        beforeEach(module('lastfm'));

        var LastFM,
            endPoint;

        beforeEach(function () {
            module('lastfm', function (_LastFMProvider_) {
                _LastFMProvider_.setAPIKey('123'); // !Important! Else all tests will fail
                endPoint = _LastFMProvider_.getEndPoint()
            });

            inject(function () {});
        });


        beforeEach(inject(function (_LastFM_) {
            LastFM = _LastFM_;
        }));

        it('should be defined', function () {
            expect(LastFM).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof LastFM).toBe('object');
        });

        it('should set api_key and json in params', function () {
            expect(LastFM.getParams).toBeDefined();
            expect(LastFM.getParams({})).toEqual({api_key:'123', format:'json'});
        });


        describe('Methods', function () {
            // Album
            describe('Album', function () {

                it('should have an object Album', function () {
                    expect(LastFM.Album).toBeDefined();
                });

                it('should have a method Album.getInfo()', function () {
                    expect(LastFM.Album.getInfo).toBeDefined();
                });

                it('should have a method Album.getTopTags()', function () {
                    expect(LastFM.Album.getTopTags).toBeDefined();
                });

                it('should have a method Album.search()', function () {
                    expect(LastFM.Album.search).toBeDefined();
                });                
            });

            // Artist
            describe('Artist', function () {

                it('should have an object Artist', function () {
                    expect(LastFM.Artist).toBeDefined();
                });

                it('should have a method Artist.getInfo()', function () {
                    expect(LastFM.Artist.getInfo).toBeDefined();
                });

                it('should have a method Artist.getSimilar()', function () {
                    expect(LastFM.Artist.getSimilar).toBeDefined();
                });

                it('should have a method Artist.getTopAlbums()', function () {
                    expect(LastFM.Artist.getTopAlbums).toBeDefined();
                });

                it('should have a method Artist.getTopTags()', function () {
                    expect(LastFM.Artist.getTopTags).toBeDefined();
                });

                it('should have a method Artist.getTopTracks()', function () {
                    expect(LastFM.Artist.getTopTracks).toBeDefined();
                });

                it('should have a method Artist.search()', function () {
                    expect(LastFM.Artist.search).toBeDefined();
                });                
            });

            // Charts
            describe('Charts', function () {

                it('should have an object Charts', function () {
                    expect(LastFM.Charts).toBeDefined();
                });

                it('should have a method Charts.getTopArtists()', function () {
                    expect(LastFM.Charts.getTopArtists).toBeDefined();
                });

                it('should have a method Charts.getTopTags()', function () {
                    expect(LastFM.Charts.getTopTags).toBeDefined();
                });

                it('should have a method Charts.getTopTracks()', function () {
                    expect(LastFM.Charts.getTopTracks).toBeDefined();
                });
            });

            // Geo
            describe('Geo', function () {

                it('should have an object Geo', function () {
                    expect(LastFM.Geo).toBeDefined();
                });

                it('should have a method Geo.getTopArtists()', function () {
                    expect(LastFM.Geo.getTopArtists).toBeDefined();
                });

                it('should have a method Geo.getTopTracks()', function () {
                    expect(LastFM.Geo.getTopTracks).toBeDefined();
                });
            });

            // Track
            describe('Track', function () {

                it('should have an object Track', function () {
                    expect(LastFM.Track).toBeDefined();
                });
                
                it('should have a method Track.getInfo()', function () {
                    expect(LastFM.Track.getInfo).toBeDefined();
                });

                it('should have a method Track.getSimilar()', function () {
                    expect(LastFM.Track.getSimilar).toBeDefined();
                });

                it('should have a method Track.getTopTags()', function () {
                    expect(LastFM.Track.getTopTags).toBeDefined();
                });

                it('should have a method Track.search()', function () {
                    expect(LastFM.Track.search).toBeDefined();
                });
            });

        });
        // End Cut 2

        describe('API Calls', function () {

            var $httpBackend,
                $rootScope,
                LastFM,
                apiKey = 123,
                $httpParamSerializer;

            function createURL(settings, config){
                config = config || {api_key: 123, format: 'json'};
                var params = angular.extend(
                                {},                                 // So we don't polute the objects
                                config,                             // api_key and format
                                settings || {}                      // method etc.
                            );
                return endPoint + '?' + $httpParamSerializer(params);
            }

            beforeEach(inject(function(_LastFM_, _$httpBackend_, _$rootScope_, _$httpParamSerializer_) {

                LastFM = _LastFM_;
                $httpBackend = _$httpBackend_;
                $rootScope = _$rootScope_;
                $httpParamSerializer = _$httpParamSerializer_;
                // ** base is set in karma.conf.js
                // To use jasmine.getJSONFixtures, you need jasmine-jquery
                jasmine.getJSONFixtures().fixturesPath='base/';

            }));

            afterEach(function(){
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });


            /*
                Note:
                When you use {params} in $http call, angular will sort alphabetically...(see: $httpParamSerializer)
                So we know what order to expect them in the query string
                So we can reliably let whenGET/expectGET etc. know the url to expect.
            */
            // Catch Errors
            describe('Catch Errors', function () {
                // Picking any api call as all use same mechanism
                // _ methods *do not* handle LastFm errors, that is left to the user

                var url;
                // Network
                it('should handle network error', function () {
                    url = createURL({ album: 'Disintegration', method:'album.search' });
                    $httpBackend.expectGET(url).respond(function (method, url, data, headers) {
                        return [404, '', {}, 'Not found'];
                    });

                    LastFM.Album.search('Disintegration')
                        .then(function (response) {
                            expect(response).not.toBeDefined();
                        }, function(reason){
                            expect(reason).toBeDefined();
                            expect(reason).toEqual(jasmine.any(Object))
                            expect(reason.status).toBe(404);
                            expect(reason.statusText).toBe('Not found');
                        });

                    $httpBackend.flush();

                });

                it('should handle network error with _ method', function () {
                    url = createURL({ album: 'Disintegration', method:'album.search' });
                    $httpBackend.expectGET(url).respond(function (method, url, data, headers) {
                        return [404, '', {}, 'Not found'];
                    });

                    LastFM.Album._search('Disintegration')
                        .then(function (response) {
                            expect(response).not.toBeDefined();
                        }, function(reason){
                            expect(reason).toBeDefined();
                            expect(reason).toEqual(jasmine.any(Object))
                            expect(reason.status).toBe(404);
                            expect(reason.statusText).toBe('Not found');
                        });

                    $httpBackend.flush();

                });


                // LastFM
                it('should handle LastFM error response', function () {
                    url = createURL({ album: 'Disintegration', method:'album.search' });
                    $httpBackend.expectGET(url).respond(function () {
                        return [/*status*/ 200, /*data*/ {error:6, message:'Album not found'}];
                    });

                    LastFM.Album.search('Disintegration')
                        .then(function (response) {
                            expect(response).not.toBeDefined();
                        }, function(reason){
                            expect(reason).toBeDefined();
                            expect(reason).toEqual(jasmine.any(Object))
                            expect(reason.error).toBe(6);
                            expect(reason.statusText).toBe('Album not found');
                        });

                    $httpBackend.flush();

                });

            });
            // End Catch Errors

            // isMbid
            describe('isMbid', function () {

                var mbid = '91fa2331-d8b4-4d1f-aa4d-53b1c54853e5',
                    tooShort =  '91fa2331-d8b4-4d1f-aa4d-53b1c54853e',
                    tooLong = '91fa2331-d8b4-4d1f-aa4d-53b1c54853e51',
                    wrongChars = '91ga2331-d?b4-4d1g-aa4d-53b1c54853e51',   // has a ?
                    withGs = '91ga2331-d8b4-4d1g-aa4d-53b1c54853e51',       // has g's
                    noDash = '91fa2331d8b44d1faa4d53b1c54853e5',
                    caps = '91FA2331-D8B4-4D1F-AA4D-53B1C54853E5',
                    four4 = '91fa2331-d8b4-4d1f-aa4d-aa4d-53b1c54853e5';


                it('should be defined', function () {
                    expect(LastFM.isMbid).toBeDefined();
                });

                it('should match real mbid', function () {
                    expect(LastFM.isMbid(mbid)).toBe(true);
                });

                it('should match with all capitals', function () {
                    expect(LastFM.isMbid(caps)).toBe(true);
                });

                it('should reject too long', function () {
                    expect(LastFM.isMbid(tooLong)).toBe(false);
                });

                it('should reject too short', function () {
                    expect(LastFM.isMbid(tooShort)).toBe(false);
                });

                it('should reject too with unaccepted letters', function () {
                    expect(LastFM.isMbid(withGs)).toBe(false);
                });

                it('should reject too with unaccepted characters', function () {
                    expect(LastFM.isMbid(wrongChars)).toBe(false);
                });

                it('should reject leading white space', function () {
                    expect(LastFM.isMbid(' ' + mbid)).toBe(false);
                });

                it('should reject trailing white space', function () {
                    expect(LastFM.isMbid(mbid + ' ')).toBe(false);
                });

                it('should reject leading dash', function () {
                    expect(LastFM.isMbid('-' + mbid)).toBe(false);
                });

                it('should reject trailing dash', function () {
                    expect(LastFM.isMbid(mbid + '-')).toBe(false);
                });

                it('should reject with missing dashes', function () {
                    expect(LastFM.isMbid(noDash)).toBe(false);
                });

                it('should reject with 4 four sections', function () {
                    expect(LastFM.isMbid(four4)).toBe(false);
                });

            });
            // End isMbid

            // Album
            describe('Album', function () {
                var url;

                // getInfo
                describe('Album.getInfo', function () {

                    it('should return an album object', function () {
                        url = createURL({ artist: 'The Cure', album: 'Faith', method:'album.getinfo' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/album.info.json'));

                        LastFM.Album.getInfo('The Cure', 'Faith')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response.name).toBe('Faith');
                                expect(response.tracks.track).toEqual(jasmine.any(Array));
                            });

                        $httpBackend.flush();
                    });


                    // When (if) response.data.album isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ artist: 'The Cure', album: 'Faith', method:'album.getinfo' });
                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {results:{}}];
                        });

                        LastFM.Album.getInfo('The Cure', 'Faith')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find this album');
                            });

                        $httpBackend.flush();

                    });

                });
                describe('Album._getInfo', function () {

                    it('should return data object containing an album object', function () {
                        url = createURL({ artist: 'The Cure', album: 'Faith', method:'album.getinfo' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/album.info.json'));

                        LastFM.Album._getInfo('The Cure', 'Faith')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.album).toBeDefined();
                                expect(response.data.album.name).toBe('Faith');
                                expect(response.data.album.tracks.track).toEqual(jasmine.any(Array));
                            });

                        $httpBackend.flush();
                    });

                });
                // End getInfo


                // getTopTags
                describe('Album.getTopTags', function () {

                    it('should return array of tag objects', function () {
                        url = createURL({ artist: 'The Cure', album: 'Faith', method:'album.gettoptags' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/album.toptags.json'));

                        LastFM.Album.getTopTags('The Cure', 'Faith')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(100);
                                expect(response[0]).toEqual(jasmine.any(Object));
                                expect(response[0].name).toBe('post-punk');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.toptags isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ artist: 'The Cure', album: 'Faith', method:'album.gettoptags' });
                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xtoptags:{}}];
                        });

                        LastFM.Album.getTopTags('The Cure', 'Faith')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Error looking up tags');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Album._getTopTags', function () {

                    it('should return data object containing array of tags', function () {
                        url = createURL({ artist: 'The Cure', album: 'Faith', method:'album.gettoptags' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/album.toptags.json'));

                        LastFM.Album._getTopTags('The Cure', 'Faith')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.toptags).toBeDefined();
                                expect(response.data.toptags.tag).toEqual(jasmine.any(Array));
                                expect(response.data.toptags.tag.length).toBe(100);
                                expect(response.data.toptags.tag[0]).toEqual(jasmine.any(Object));
                                expect(response.data.toptags.tag[0].name).toBe('post-punk');
                            });


                        $httpBackend.flush();
                    });
                });
                // End getTopTags


                // Search
                describe('Album.search', function () {

                    it('should return a matched array of albums', function () {
                        url = createURL({ album: 'Disintegration', method:'album.search' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/album.search.json'));

                        LastFM.Album.search('Disintegration')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(2);
                            });

                        $httpBackend.flush();
                    });


                    // When (if) response.data.results.albummatches isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ album: 'Disintegration', method:'album.search' });
                        // Note: The object you use for data becomes response.data in then(response)
                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {results:{}}];
                        });

                        LastFM.Album.search('Disintegration')
                            .then(function (response) {
                                expect(response).not.toBeDefined(); // Will only be tested if things are wrong
                            }, function(reason){
                                //... as we should be here with the bad data.
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find this album');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Album._search', function () {

                    it('should return data object containing matched array of albums', function () {
                        url = createURL({ album: 'Disintegration', method:'album.search' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/album.search.json'));

                        LastFM.Album._search('Disintegration')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.results.albummatches.album).toBeDefined();
                                expect(response.data.results.albummatches.album.length).toBe(2);
                                expect(response.data.results.albummatches.album).toEqual(jasmine.any(Array));
                            });


                        $httpBackend.flush();
                    });

                });
                // End Search

            });
            // End Album


            // Artist
            describe('Artist', function () {
                var url;

                // getInfo
                describe('Artist.getInfo', function () {

                    it('should return an artist object', function () {
                        url = createURL({ artist: 'The Cure', method:'artist.getinfo' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/artist.info.json'));

                        LastFM.Artist.getInfo('The Cure')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Object));
                                expect(response.name).toBe('The Cure');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.artist isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ artist: 'The Cure', method:'artist.getinfo' });
                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xartist:{}}];
                        });

                        LastFM.Artist.getInfo('The Cure')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find artist');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Artist._getInfo', function () {

                    it('should return data object containing an artist object', function () {
                        url = createURL({ artist: 'The Cure', method:'artist.getinfo' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/artist.info.json'));

                        LastFM.Artist._getInfo('The Cure')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.artist).toBeDefined();
                                expect(response.data.artist.name).toBe('The Cure');
                            });

                        $httpBackend.flush();
                    });
                });
                // End getInfo


                // getSimilar
                describe('Artist.getSimilar', function () {

                    it('should return an array of artists', function () {
                        url = createURL({ artist: 'The Cure', method:'artist.getsimilar' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/artist.similar.json'));

                        LastFM.Artist.getSimilar('The Cure')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(100);
                                expect(response[0].name).toBe('Siouxsie and the Banshees');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.similarartists isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ artist: '!', method:'artist.getsimilar' });

                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xsimilarartists:{}}];
                        });

                        LastFM.Artist.getSimilar('!')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find similar artists');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Artist._getSimilar', function () {

                    it('should return data object containing matched array of artists', function () {
                        url = createURL({ artist: 'The Cure', method:'artist.getsimilar' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/artist.similar.json'));

                        LastFM.Artist._getSimilar('The Cure')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.similarartists).toBeDefined();
                                expect(response.data.similarartists.artist).toEqual(jasmine.any(Array));
                                expect(response.data.similarartists.artist.length).toBe(100);
                            });

                        $httpBackend.flush();
                    });
                });
                // End getSimilar


                // getTopAlbums
                describe('Artist.getTopAlbums', function () {

                    it('should return an array of albums', function () {
                        url = createURL({ artist: 'The Cure', method:'artist.gettopalbums' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/artist.topalbums.json'));

                        LastFM.Artist.getTopAlbums('The Cure')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(50);
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.results.topalbums isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ artist: 'The Cure', method:'artist.gettopalbums' });
                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {results:{}}];
                        });

                        LastFM.Artist.getTopAlbums('The Cure')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find albums');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Album._getInfos', function () {

                    it('should return data object containing array of albums', function () {
                        url = createURL({ artist: 'The Cure', method:'artist.gettopalbums' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/artist.topalbums.json'));

                        LastFM.Artist._getTopAlbums('The Cure')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.topalbums).toBeDefined();
                                expect(response.data.topalbums.album).toEqual(jasmine.any(Array));
                                expect(response.data.topalbums.album.length).toBe(50);
                                expect(response.data.topalbums.album[0]).toEqual(jasmine.any(Object));
                            });

                        $httpBackend.flush();
                    });
                });
                // End getTopAlbums

                
                // getTopTags
                describe('Artist.getTopTags', function () {

                    it('should return an array of tags', function () {
                        url = createURL({ artist: 'The Cure', method:'artist.gettoptags' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/artist.toptags.json'));

                        LastFM.Artist.getTopTags('The Cure')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(44);
                                expect(response[0].name).toBe('post-punk');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.toptags isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ artist: '!', method:'artist.gettoptags' });

                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xtoptags:{}}];
                        });

                        LastFM.Artist.getTopTags('!')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find tags');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Artist._getTopTags', function () {

                    it('should return data object containing matched array of artists', function () {
                        url = createURL({ artist: 'The Cure', method:'artist.gettoptags' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/artist.toptags.json'));

                        LastFM.Artist._getTopTags('The Cure')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.toptags).toBeDefined();
                                expect(response.data.toptags.tag).toBeDefined();
                                expect(response.data.toptags.tag.length).toBe(44);
                            });

                        $httpBackend.flush();
                    });
                });
                // End getTopTags


                // getTopTracks
                describe('Artist.getTopTracks', function () {

                    it('should return an array of tracks', function () {
                        var url = createURL({ artist: 'The Cure', method:'artist.gettoptracks' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/artist.toptracks.json'));

                        LastFM.Artist.getTopTracks('The Cure')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(50);
                                expect(response[0].name).toBe('Friday I\'m in Love');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.toptracks isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        var url = createURL({ artist: '!', method:'artist.gettoptracks' });

                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xtoptracks:{}}];
                        });

                        LastFM.Artist.getTopTracks('!')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find tracks');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Artist._getTopTracks', function () {

                    it('should return data object containing array of toptracks', function () {
                        var url = createURL({ artist: 'The Cure', method:'artist.gettoptracks' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/artist.toptracks.json'));

                        LastFM.Artist._getTopTracks('The Cure')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.toptracks).toBeDefined();
                                expect(response.data.toptracks.track).toBeDefined();
                                expect(response.data.toptracks.track.length).toBe(50);
                            });

                        $httpBackend.flush();
                    });
                });
                // End getTopTracks


                // search
                describe('Artist.search', function () {

                    it('should return a matched array of artists', function () {
                        url = createURL({ artist: 'The Cure', method:'artist.search' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/artist.search.json'));

                        LastFM.Artist.search('The Cure')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(30);
                                expect(response[0].name).toBe('The Cure');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.results.artistmatches isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ artist: '!', method:'artist.search' });

                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {results:{}}];
                        });

                        LastFM.Artist.search('!')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find artist');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Artist._search', function () {

                    it('should return data object containing matched array of artists', function () {
                        url = createURL({ artist: 'The Cure', method:'artist.search' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/artist.search.json'));

                        LastFM.Artist._search('The Cure')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.results.artistmatches.artist).toBeDefined();
                                expect(response.data.results.artistmatches.artist).toEqual(jasmine.any(Array));
                                expect(response.data.results.artistmatches.artist.length).toBe(30);
                            });

                        $httpBackend.flush();
                    });
                });
                // End search
            });
            // End Artist


            // Charts
            describe('Charts', function(){
                var url;

                // getTopArtists
                describe('Charts.getTopArtists', function () {

                    it('should return an array of artists', function () {
                        url = createURL({ method:'chart.gettopartists' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/charts.artists.json'));

                        LastFM.Charts.getTopArtists()
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(10);
                                expect(response[1].name).toBe('Radiohead');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.artists isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ method:'chart.gettopartists' });

                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xartists:{}}];
                        });

                        LastFM.Charts.getTopArtists()
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find artist');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Charts._getTopArtists', function () {

                    it('should return data object containing array of artists', function () {
                        url = createURL({ method:'chart.gettopartists' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/charts.artists.json'));

                        LastFM.Charts._getTopArtists()
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.artists).toBeDefined();
                                expect(response.data.artists.artist).toBeDefined();
                                expect(response.data.artists.artist.length).toBe(10);
                            });

                        $httpBackend.flush();
                    });
                });
                // End getTopArtists

                // getTopTags
                describe('Charts.getTopTags', function () {

                    it('should return an array of tags', function () {
                        url = createURL({ method:'chart.gettoptags' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/charts.toptags.json'));

                        LastFM.Charts.getTopTags()
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(50);
                                expect(response[0].name).toBe('rock');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.tags isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ method:'chart.gettoptags' });

                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xtags:{}}];
                        });

                        LastFM.Charts.getTopTags()
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find tags');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Charts._getTopTags', function () {

                    it('should return data object containing array of tags', function () {
                        url = createURL({ method:'chart.gettoptags' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/charts.toptags.json'));

                        LastFM.Charts._getTopTags()
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.tags).toBeDefined();
                                expect(response.data.tags.tag).toBeDefined();
                                expect(response.data.tags.tag.length).toBe(50);
                            });

                        $httpBackend.flush();
                    });
                });
                // End getTopTags

                // getTopTracks
                describe('Charts.getTopTracks', function () {

                    it('should return an array of tracks', function () {
                        url = createURL({ method:'chart.gettoptracks' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/charts.toptracks.json'));

                        LastFM.Charts.getTopTracks()
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(10);
                                expect(response[4].name).toBe('Burn the Witch');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.tracks isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ method:'chart.gettoptracks' });

                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xtracks:{}}];
                        });

                        LastFM.Charts.getTopTracks()
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find tracks');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Charts._getTopTracks', function () {

                    it('should return data object containing array of tracks', function () {
                        url = createURL({ method:'chart.gettoptracks' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/charts.toptracks.json'));

                        LastFM.Charts._getTopTracks()
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.tracks).toBeDefined();
                                expect(response.data.tracks.track).toBeDefined();
                                expect(response.data.tracks.track.length).toBe(10);
                            });

                        $httpBackend.flush();
                    });
                });
                // End getTopTracks

            })
            // End Charts

            // Geo
            describe('Geo', function(){
                var url;

                // getTopArtists
                describe('Geo.getTopArtists', function () {

                    it('should return an array of artists', function () {
                        url = createURL({ country: 'United Kingdom', method:'geo.gettopartists' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/geo.topartists.json'));

                        LastFM.Geo.getTopArtists('United Kingdom')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(10);
                                expect(response[0].name).toBe('David Bowie');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.topartists isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ country: 'United Kingdom', method:'geo.gettopartists' });

                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xtopartists:{}}];
                        });

                        LastFM.Geo.getTopArtists('United Kingdom')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find artists');
                            });

                        $httpBackend.flush();

                    });
                });

                describe('Charts._getTopArtists', function () {

                    it('should return data object containing array of artists', function () {
                        url = createURL({ country: 'United Kingdom', method:'geo.gettopartists' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/geo.topartists.json'));

                        LastFM.Geo._getTopArtists('United Kingdom')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.topartists).toBeDefined();
                                expect(response.data.topartists.artist).toBeDefined();
                                expect(response.data.topartists.artist.length).toBe(10);
                            });

                        $httpBackend.flush();
                    });
                });
                // End getTopArtists


                // getTopTracks
                describe('Geo.getTopTracks', function () {

                    it('should return an array of tracks', function () {
                        url = createURL({ country: 'United Kingdom', method:'geo.gettoptracks' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/geo.toptracks.json'));

                        LastFM.Geo.getTopTracks('United Kingdom')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(10);
                                expect(response[0].name).toBe('Hello');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.tracks isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ country: '!', method:'geo.gettoptracks' });

                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xtracks:{}}];
                        });

                        LastFM.Geo.getTopTracks('!')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find tracks');
                            });

                        $httpBackend.flush();

                    });
                });

                describe('Geo._getTopTracks', function () {

                    it('should return data object containing array of tracks', function () {
                        url = createURL({ country: 'United Kingdom', method:'geo.gettoptracks' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/geo.toptracks.json'));

                        LastFM.Geo._getTopTracks('United Kingdom')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.tracks).toBeDefined();
                                expect(response.data.tracks.track).toBeDefined();
                                expect(response.data.tracks.track.length).toBe(10);
                            });

                        $httpBackend.flush();
                    });
                });
                // End getTopTracks

            });
            // End Geo

            // Track
            describe('Track', function(){
                var url;

                // getInfo
                describe('Track.getTopTags', function () {
                    var url;
                    it('should return array of tracks', function () {
                        url = createURL({ artist: 'The Cure', track: 'Faith', method:'track.getInfo' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/track.info.json'));

                        LastFM.Track.getInfo('The Cure', 'Faith')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response.name).toBe('Faith');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.track isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ artist: '!', track: '!!', method:'track.getInfo' });
                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xtrack:{}}];
                        });

                        LastFM.Track.getInfo('!', '!!')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find track');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Track._getInfo', function () {

                    it('should return data object containing array of tags', function () {
                        url = createURL({ artist: 'The Cure', track: 'Faith', method:'track.getInfo' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/track.info.json'));


                        LastFM.Track._getInfo('The Cure', 'Faith')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.track).toBeDefined();
                                expect(response.data.track.name).toBe('Faith');
                            });


                        $httpBackend.flush();
                    });
                });
                // End getInfo


                // getSimilar
                describe('Track.getSimilar', function () {

                    it('should return an array of tracks', function () {
                        url = createURL({ artist: 'The Cure', track: 'Faith', method:'track.getsimilar' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/track.similar.json'));

                        LastFM.Track.getSimilar('The Cure', 'Faith')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(100);
                                expect(response[0].name).toBe('The Drowning Man');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.similartracks isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ artist: '!', track: '!!', method:'track.getsimilar' });

                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xsimilartracks:{}}];
                        });

                        LastFM.Track.getSimilar('!', '!!')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find similar tracks');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Track._getSimilar', function () {

                    it('should return data object containing matched array of tracks', function () {
                        url = createURL({ artist: 'The Cure', track: 'Faith', method:'track.getsimilar' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/track.similar.json'));

                        LastFM.Track._getSimilar('The Cure', 'Faith')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.similartracks).toBeDefined();
                                expect(response.data.similartracks.track).toEqual(jasmine.any(Array));
                                expect(response.data.similartracks.track.length).toBe(100);
                            });

                        $httpBackend.flush();
                    });
                });
                // End getSimilar

                // getTopTags
                describe('Track.getTopTags', function () {
                    var url;
                    it('should return array of tag objects', function () {
                        url = createURL({ artist: 'The Cure', track: 'Faith', method:'track.gettoptags' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/track.toptags.json'));

                        LastFM.Track.getTopTags('The Cure', 'Faith')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(100);
                                expect(response[1]).toEqual(jasmine.any(Object));
                                expect(response[1].name).toBe('post-punk');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.toptags isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ artist: '!', track: '!!', method:'track.gettoptags' });
                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {Xtoptags:{}}];
                        });

                        LastFM.Track.getTopTags('!', '!!')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find tags');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Track._getTopTags', function () {

                    it('should return data object containing array of tags', function () {
                        url = createURL({ artist: 'The Cure', track: 'Faith', method:'track.gettoptags' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/track.toptags.json'));


                        LastFM.Track._getTopTags('The Cure', 'Faith')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.toptags).toBeDefined();
                                expect(response.data.toptags.tag).toEqual(jasmine.any(Array));
                                expect(response.data.toptags.tag.length).toBe(100);
                                expect(response.data.toptags.tag[1]).toEqual(jasmine.any(Object));
                                expect(response.data.toptags.tag[1].name).toBe('post-punk');
                            });


                        $httpBackend.flush();
                    });
                });
                // End getTopTags

                // search
                describe('Track.search', function () {

                    it('should return a matched array of tracks', function () {
                        url = createURL({ track: 'Close To Me', method:'track.search' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/track.search.json'));

                        LastFM.Track.search('Close To Me')
                            .then(function (response) {
                                expect(response).toBeDefined();
                                expect(response).toEqual(jasmine.any(Array));
                                expect(response.length).toBe(10);
                                expect(response[0].artist).toBe('The Cure');
                            });

                        $httpBackend.flush();
                    });

                    // When (if) response.data.results.trackmatches isn't sent
                    it('should handle bad response with unexpected data format', function () {
                        url = createURL({ track: '!', method:'track.search' });

                        $httpBackend.expectGET(url).respond(function () {
                            return [/*status*/ 200, /*data*/ {results:{}}];
                        });

                        LastFM.Track.search('!')
                            .then(function (response) {
                                expect(response).not.toBeDefined();
                            }, function(reason){
                                expect(reason).toBeDefined();
                                expect(reason).toEqual(jasmine.any(Object))
                                expect(reason.statusText).toBe('Couldn\'t find track');
                            });

                        $httpBackend.flush();

                    });

                });

                describe('Track._search', function () {

                    it('should return data object containing matched array of tracks', function () {
                        url = createURL({ track: 'Close To Me', method:'track.search' });
                        $httpBackend.expectGET(url).respond(getJSONFixture('mocks/track.search.json'));

                        LastFM.Track._search('Close To Me')
                            .then(function (response) {
                                expect(response.data).toBeDefined();
                                expect(response.data.results.trackmatches.track).toBeDefined();
                                expect(response.data.results.trackmatches.track).toEqual(jasmine.any(Array));
                                expect(response.data.results.trackmatches.track.length).toBe(10);
                            });

                        $httpBackend.flush();
                    });
                });
                // End search
            });
            // End Track

        });  // End API Calls

    }); // End LastFM

});