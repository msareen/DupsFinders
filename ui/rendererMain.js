var app = angular.module('dupsFinderUI', ['ui.grid']);

app.controller('mainController', function ($scope) {
    $scope.dialogOptions = {
        isDirectoyDialog : true,
        onRegisterApi: function (dialogApi) {
            $scope.dialogApi = dialogApi;
        }
    }

    $scope.browsePath = function () {
        $scope.dialogApi.showDialog();
    }

    $scope.onPathSelected = function ( event ) {
        alert( event.value );
        $scope.pathValue = event.value;
    }



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

