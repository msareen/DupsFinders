var app = angular.module('dupsFinderUI', ['ui.grid']);
const {electron,dialog, ipcRenderer} = require('electron').remote;

app.controller('mainController', function ($scope) {

    $scope.pathValue = '';

    $scope.dialogOptions = {
        isDirectoyDialog : true,
        onRegisterApi: function (dialogApi) {
            $scope.dialogApi = dialogApi;
        }
    }

    $scope.browsePath = function () {
        $scope.pathValue = dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
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


    }

    $scope.gridOptions = {
        data : {}
    }


});

