var util = require('@grid/util');
var makeDirtyClean = require('@grid/dirty-clean');
var positionRange = require('@grid/position-range');

module.exports = function (_grid) {
    var grid = _grid;

    var dirtyClean = makeDirtyClean(grid);

    var aliveDecorators = [];
    var deadDecorators = [];

    var decorators = {
        add: function (decorator) {
            aliveDecorators.push(decorator);
            dirtyClean.setDirty();
        },
        remove: function (decorators) {
            if (!util.isArray(decorators)) {
                decorators = [decorators];
            }
            decorators.forEach(function (decorator) {
                aliveDecorators.splice(aliveDecorators.indexOf(decorator), 1);
                deadDecorators.push(decorator);
                dirtyClean.setDirty();
            });
        },
        getAlive: function () {
            return aliveDecorators.slice(0);
        },
        popAllDead: function () {
            var oldDead = deadDecorators;
            deadDecorators = [];
            return oldDead;
        },
        isDirty: dirtyClean.isDirty,
        create: function () {
            var decorator = {};
            var thisDirtyClean = makeDirtyClean(grid);

            //mixin the position range functionality
            positionRange(decorator, thisDirtyClean, dirtyClean);

            //they can override but we should have an empty default to prevent npes
            decorator.render = function () {
                var div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.top = '0px';
                div.style.left = '0px';
                div.style.bottom = '0px';
                div.style.right = '0px';
                return div;
            };
            return decorator;

        }

    };


    return decorators;
};