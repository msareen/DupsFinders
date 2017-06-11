var app = (function () {
    'use strict';

    var app = angular.module('dupsFinderUI', ['ui.grid', 'ui.grid.grouping']);
    const { remote, ipcRenderer } = require('electron');

    app.controller('mainController', function ($scope, uiGridGroupingConstants, gridFormatterService) {
        $scope.pathValue = '';
        $scope.progressObj = {};
        $scope.lookingForDuplicates = false;

        $scope.gridOptions = gridFormatterService.getGridOptions( $scope );
        //$scope.gridOptions = {};

        $scope.browsePath = function () {
            $scope.pathValue = remote.dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
        }

        

        $scope.lookForDuplicates = function () {
            $scope.lookingForDuplicates = true;
            ipcRenderer.send('dupsFinder-find', $scope.pathValue);
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

        $scope.cancelProcess = function() {
            $scope.lookingForDuplicates = false;
            ipcRenderer.send('dupsFinder-cancel');
        }

        function markProgress(progressObj) {
            $scope.progressObj = progressObj;
            if($scope.$$phase) {
                $scope.$digest();
            }
        }

        function renderResults(results) {
            $scope.lookingForDuplicates = false;
            $scope.gridOptions.data = flatGridData(results.dupsHashMap);
            if(!$scope.$$phase) {
                $scope.$digest();
            }
            
        }

        function flatGridData( dupsHashMap ) {
            var flatArray = [];
            _.forEach(dupsHashMap, ( element ) => {
                _.forEach( element.files, (file ) => {
                    flatArray.push(
                        {
                            uniqueId : element.uniqueId,
                            fileName : file.name,
                            location : file.fullFilePath,
                            count : element.count,
                        }
                    )
                })
            })
            return flatArray;
        }

        
    });
    return app;
})();


