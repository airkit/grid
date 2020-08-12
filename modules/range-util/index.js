"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function intersect(range1, range2) {
    var range2Start = range2[0];
    var range1Start = range1[0];
    var range1End = range1Start + range1[1] - 1;
    var range2End = range2Start + range2[1] - 1;
    if (range2Start > range1End || range2End < range1Start) {
        return null;
    }
    var resultStart = (range1Start > range2Start ? range1Start : range2Start);
    var resultEnd = (range1End < range2End ? range1End : range2End);
    return [
        resultStart,
        resultEnd - resultStart + 1
    ];
}
exports.intersect = intersect;
function union(range1, range2) {
    if (!range1) {
        return range2;
    }
    if (!range2) {
        return range1;
    }
    var range2Start = range2[0];
    var range2End = range2Start + range2[1] - 1;
    var range1Start = range1[0];
    var range1End = range1Start + range1[1] - 1;
    var resultStart = (range1Start < range2Start ? range1Start : range2Start);
    return [
        resultStart, (range1End > range2End ? range1End : range2End) - resultStart + 1
    ];
}
exports.union = union;
function createFromPoints(r1, c1, r2, c2) {
    var range = {};
    if (r1 < r2) {
        range.top = r1;
        range.height = r2 - r1 + 1;
    }
    else {
        range.top = r2;
        range.height = r1 - r2 + 1;
    }
    if (c1 < c2) {
        range.left = c1;
        range.width = c2 - c1 + 1;
    }
    else {
        range.left = c2;
        range.width = c1 - c2 + 1;
    }
    return range;
}
exports.createFromPoints = createFromPoints;
function iterate() {
    var args = this.getArgs(arguments);
    var range = args.range;
    var cellFn = args.cellFn;
    var rowFn = args.rowFn;
    for (var r = range.top; r < range.top + range.height; r++) {
        var rowResult = void 0;
        if (rowFn) {
            rowResult = rowFn(r);
        }
        for (var c = range.left; c < range.left + range.width; c++) {
            if (cellFn) {
                cellFn(r, c, rowResult);
            }
        }
    }
}
exports.iterate = iterate;
function getArgs(args) {
    var range = args[0];
    var cellFn = args[1];
    var rowFn;
    if (args.length === 3) {
        cellFn = args[2];
        rowFn = args[1];
    }
    return {
        range: range,
        cellFn: cellFn,
        rowFn: rowFn
    };
}
exports.getArgs = getArgs;
function equal(r1, r2) {
    return r1.top === r2.top &&
        r1.left === r2.left &&
        r1.width === r2.width &&
        r1.height === r2.height;
}
exports.equal = equal;
//# sourceMappingURL=index.js.map