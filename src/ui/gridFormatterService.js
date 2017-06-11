(function () {
    app.service('gridFormatterService', function (uiGridGroupingConstants) {
        var service = this;

        service.getGridOptions = function ( scope ) {
            return {
                enableFiltering: true,
                columnsDefs : [
                    {
                        name: 'UniqueId',
                        field: 'uniqueId',
                        width: '20%'
                    },
                    {
                        name: 'Name',
                        field: 'fileName'
                    },
                    {
                        name: 'location',
                        field: 'fullFilePath'
                    }
                ],
                onRegisterApi: function( gridApi ) {
                     scope.gridApi = gridApi;
                }

            }
        }
    });
})();


