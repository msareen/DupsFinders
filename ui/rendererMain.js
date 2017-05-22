var app = (function () {
    'use strict';

    var app = angular.module('dupsFinderUI', ['ui.grid', 'ui.grid.grouping']);
    const { remote, ipcRenderer } = require('electron');

    app.controller('mainController', function ($scope, uiGridGroupingConstants, gridFormatterService) {
        $scope.pathValue = '';
        $scope.progressObj = {};
        $scope.browsePath = function () {
            $scope.pathValue = remote.dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
        }

        $scope.lookForDuplicates = function () {
            ipcRenderer.send('duplicate-finder', $scope.pathValue);
            ipcRenderer.on('finder-progress', (event, args) => {
                if (args.type === 'progress') {
                    markProgress(args.data);
                }
                else if (args.type === 'result') {
                    renderResults(args.data);
                }
                else if (args.type === 'error') {

                }

            });
        };

        function markProgress(progressObj) {
            $scope.progressObj = progressObj;
            $scope.$apply();
        }

        function renderResults(results) {
            $scope.gridOptions.data = results.dupsHashMap;
            $scope.$apply();
        }

        $scope.gridOptions = {
            data: {}
        }
    });
    return app;
})();


