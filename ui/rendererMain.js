var app = angular.module('dupsFinderUI', ['ui.grid']);
const {electron,dialog} = require('electron').remote;

app.controller('mainController', function ($scope) {

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

   };

    $scope.gridOptions = {
        columnDefs: [
            {
                name: "firstName",
                field: "firstName",
            },
            {
                name: "lastName",
                field: "lastName",
            },
            {
                name: "company",
                field: "company",
            },
            {
                name: "employed",
                field: "employed",
            },
        ]

    }

    $scope.gridOptions.data = [
        {
            "firstName": "Cox",
            "lastName": "Carney",
            "company": "Enormo",
            "employed": true
    },
        {
            "firstName": "Lorraine",
            "lastName": "Wise",
            "company": "Comveyer",
            "employed": false
    },
        {
            "firstName": "Nancy",
            "lastName": "Waters",
            "company": "Fuelton",
            "employed": false
    }];
});

