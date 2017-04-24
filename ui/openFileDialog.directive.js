(function () {

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
                if (scope.options.isDirectoyDialog) {
                    var input = element.children('input:first-child');
                    input.attr('directory', '');
                    input.attr('webkitdirectory', '');
                }
                scope.options.onRegisterApi(dialogApi);
                dialogApi.showDialog = function () {
                    $('#open-file-dialog').click();
                }

                $('#open-file-dialog').change(function (event, value) {
                    var files = event.target.files;
                    var relativePath = files[0].webkitRelativePath;
                    var folder = relativePath.split("/");

                    alert(folder[0]);
                    scope.onSelection({
                        $event: event,
                        $files: scope.options.isDirectoyDialog ? folder : files
                    })

                });
            }
        }
    });

})();
