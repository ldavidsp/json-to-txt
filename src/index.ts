import {WS, ES, FORMAT} from './constants'
import {readFileSync} from "fs";

/**
 *
 * @param value
 */
const removeDoubleQuotes = (value: string) => {
  return value.replace(/"/g, ' ');
}

/**
 *
 * @param headers
 * @param startPoints
 * @param isHeaderRow
 * @param obj
 */
const getRow = (headers: any[], startPoints: any, isHeaderRow: boolean, obj?: any) => {
  let row = ES;
  headers.forEach((header, index) => {
    const value = isHeaderRow ? header : obj[header];
    row += typeof value === 'object' ? removeDoubleQuotes(JSON.stringify(value)) : value;

    if (index < headers.length - 1) {
      console.log(row)
      row = row + WS;
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
const getRows = (data: any[], headers: any[], startPoints: any) => {
  let rows = [];
  rows.push(getRow(headers, startPoints, true));
  data.forEach(obj => {
    rows.push(getRow(headers, startPoints, false, obj));
  });
  return rows;
};

/**
 * @param header
 * @param data
 * @param startPoint
 */
const getStartPoint = (header: any, data: any[], startPoint: number) => {
  let lengths = [header.length];
  data.forEach(obj => {
    if (obj[header] === null) {
      lengths.push(6);
    } else {
      const value = obj[header];
      const valueLength = typeof value === 'object' ? JSON.stringify(value).length : value.toString().length;
      lengths.push(valueLength);
    }
  });
  startPoint += Math.max(...lengths) + 5;
  return startPoint;
};

/**
 * @param data
 * @param headers
 */
const getStartPoints = (data: any, headers: any) => {
  let startPoints = [0];
  let startPoint = 0;

  headers.forEach((header: any) => {
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
const getData = (params: { data: any; newLine?: string; filePath?: any; ""?: any; }) => {
  if (params.filePath != null) {
    return JSON.parse(readFileSync(params.filePath, FORMAT));
  }
  return params.data
}

/**
 *  Convert JSON to TXT.
 *
 * @param params
 * @constructor
 */
export const JsonToTxt = (params: { data: any, newLine: string; }) => {
  const data = getData(params);
  const headers = Object.keys(data[0]);
  const startPoints = getStartPoints(data, headers);
  const rows = getRows(data, headers, startPoints);

  const newLineCode = params.newLine || "\n";
  return rows.join(newLineCode) + newLineCode;
};
