(function () {
    app.service('gridFormatterService', function (uiGridGroupingConstants) {
        var service = this;

        service.getGridOptions = function ( scope ) {
            return {
                enableColumnMenus : false,
                enableGridMenu: true,
                enableRowSelection: true, 
                enableColumnResizing: true,
                columnDefs : [
                    {
                        name: 'UniqueId',
                        field: 'uniqueId',
                        width: '20%',
                        grouping : {
                            groupPriority: 1
                        },
                        visible:false
                    },
                    {
                        name: 'Name',
                        field: 'fileName',
                        width: '*'
                    },
                    {
                        name: 'Location',
                        field: 'location',
                        width: '*'
                    },
                    {
                        name: 'Action',
                        cellTemplate : getButtonTemplate(),
                        maxWidth: 150,
                        width : '*',
                    }
                ],
                onRegisterApi: function( gridApi ) {
                    scope.gridApi = gridApi;

                    scope.gridApi.grid.registerDataChangeCallback(function() {
                            scope.gridApi.treeBase.expandAllRows();
                    });
                }

            }
        }

        function getButtonTemplate() {
            return '<div class="input-group ui-grid-action" style=\"margin:1px\" ng-if="!row.groupHeader">' +
                    '<span class="input-group-btn">' +
                        '<button class="btn btn-default btn-info" ng-click="grid.appScope.explore(grid, row)" type="button">Explore</button>' +
                        '<button class="btn btn-default btn-danger" ng-click="grid.appScope.deleteItem(grid, row)" type="button">Delete</button>' +
                    '</span>' +
                 '</div>'; 
        }
    });
})();


