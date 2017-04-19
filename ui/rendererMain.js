var app = angular.module('dupsFinderUI', ['ui.grid']);

app.controller('mainController', function ($scope) {

    $scope.dialogOptions = {
        onRegisterApi: function (dialogApi) {
            $scope.dialogApi = dialogApi;
        }
    }

    $scope.browsePath = function () {
        $scope.dialogApi.showDialog();
    }

    $scope.onPathSelected = function ( value ) {
        alert(value);
        $scope.pathValue = value;
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

app.directive('openFileDialog', function () {
    return {
        restrict: 'AEC',
        template: '<input type="file" id="open-file-dialog" style="display:none"/>',
        scope: {
            onSelection: '&',
            options: '='
        },
        link: function (scope, element, attr) {
            var dialogApi = {};
            scope.options.onRegisterApi(dialogApi);
            dialogApi.showDialog = function () {
                $('#open-file-dialog').click();
            }

            $('#open-file-dialog').change(function( event ) {
                scope.onSelection()(event.value);


            });
        }
    }
});
