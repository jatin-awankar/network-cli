import Table from "cli-table3";

export function createTable(headers) {
  return new Table({
    head: headers,
    wordWrap: true,
    colWidths: [30, 20, 15],
  });
}
