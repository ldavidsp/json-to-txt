"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonToTxt = void 0;
var constants_1 = require("./constants");
var fs_1 = require("fs");
/**
 *
 * @param value
 */
var removeDoubleQuotes = function (value) {
    return value.replace(/"/g, ' ');
};
/**
 *
 * @param headers
 * @param startPoints
 * @param isHeaderRow
 * @param obj
 */
var getRow = function (headers, startPoints, isHeaderRow, obj) {
    var row = constants_1.ES;
    headers.forEach(function (header, index) {
        var value = isHeaderRow ? header : obj[header];
        row += typeof value === 'object' ? removeDoubleQuotes(JSON.stringify(value)) : value;
        if (index < headers.length - 1) {
            console.log(row);
            row = row + constants_1.WS;
        }
    });
    return row;
};
/**
 *
 * @param data
 * @param headers
 * @param startPoints
 */
var getRows = function (data, headers, startPoints) {
    var rows = [];
    rows.push(getRow(headers, startPoints, true));
    data.forEach(function (obj) {
        rows.push(getRow(headers, startPoints, false, obj));
    });
    return rows;
};
/**
 * @param header
 * @param data
 * @param startPoint
 */
var getStartPoint = function (header, data, startPoint) {
    var lengths = [header.length];
    data.forEach(function (obj) {
        if (obj[header] === null) {
            lengths.push(6);
        }
        else {
            var value = obj[header];
            var valueLength = typeof value === 'object' ? JSON.stringify(value).length : value.toString().length;
            lengths.push(valueLength);
        }
    });
    startPoint += Math.max.apply(Math, lengths) + 5;
    return startPoint;
};
/**
 * @param data
 * @param headers
 */
var getStartPoints = function (data, headers) {
    var startPoints = [0];
    var startPoint = 0;
    headers.forEach(function (header) {
        startPoint = getStartPoint(header, data, startPoint);
        startPoints.push(startPoint);
    });
    return startPoints;
};
/**
 * @description array of objects to be converted to txt.
 *
 * @param params
 * @returns {string}
 */
var getData = function (params) {
    if (params.filePath != null) {
        return JSON.parse((0, fs_1.readFileSync)(params.filePath, constants_1.FORMAT));
    }
    return params.data;
};
/**
 *  Convert JSON to TXT.
 *
 * @param params
 * @constructor
 */
var JsonToTxt = function (params) {
    var data = getData(params);
    var headers = Object.keys(data[0]);
    var startPoints = getStartPoints(data, headers);
    var rows = getRows(data, headers, startPoints);
    var newLineCode = params.newLine || "\n";
    return rows.join(newLineCode) + newLineCode;
};
exports.JsonToTxt = JsonToTxt;
