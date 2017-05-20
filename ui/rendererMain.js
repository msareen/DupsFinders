'use strict';

var app = angular.module('dupsFinderUI', ['ui.grid']);
const { remote, ipcRenderer } = require('electron');

app.controller('mainController', function ($scope) {
    $scope.pathValue = '';
    $scope.browsePath = function () {
        $scope.pathValue = remote.dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
        $scope.$apply();
    }

   $scope.lookForDuplicates = function() {
       ipcRenderer.send('duplicate-finder', $scope.pathValue);
       ipcRenderer.on('finder-progress', ( event, args ) => {
           if( args.type === 'progress' ) {
                markProgress( args.data );
           }
           else if ( args.type === 'result') {
               renderResults( args.data );
           }
           else if( args.type === 'error' ) {

           }
           $scope.$apply();
       });
   };

    function markProgress( message ) {


    }

    function renderResults( results ) {
        console.log(results);
    }

    $scope.gridOptions = {
        data : {}
    }


});

