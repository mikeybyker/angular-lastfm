(function(){
    'use strict';

    angular
        .module('app', ['lastfm'])
        .config(function (LastFMProvider) {
            LastFMProvider.setAPIKey('ADD_API_KEY');
            // Just to remind you  to change it!
            if(!LastFMProvider.getAPIKey() || LastFMProvider.getAPIKey() === 'ADD_API_KEY'){
                alert('You need to add a Last.fm API Key!\nVisit: http://www.last.fm/api');
            }
        });

}());