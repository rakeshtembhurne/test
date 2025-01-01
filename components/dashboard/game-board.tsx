import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminGame = ({
  data,
  title = "Game Board",
  showColumnTotals = true,
  highlightEmptyCells = true,
}) => {
  // Generate column headers (0-9)
  const columns = Array.from({ length: 10 }, (_, i) => i.toString());

  // Calculate column totals
  const calculateColumnTotals = () => {
    const totals = {};
    columns.forEach((col) => {
      const sum = Object.values(data).reduce((acc, row) => {
        return acc + (row[col] || 0);
      }, 0);
      totals[col] = sum;
    });
    return totals;
  };

  const columnTotals = calculateColumnTotals();

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2"></th>
                {columns.map((col) => (
                  <th key={col} className="border p-2 text-center">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([rowId, rowData]) => (
                <tr key={rowId} className="hover:bg-gray-50">
                  <td className="border p-2 font-medium">{rowId}</td>
                  {columns.map((col) => {
                    const value = rowData[col];
                    const isEmpty = value === null || value === undefined;
                    return (
                      <td
                        key={`${rowId}-${col}`}
                        className={`border p-2 text-right ${
                          isEmpty && highlightEmptyCells ? "bg-gray-100" : ""
                        }`}
                      >
                        {isEmpty ? "-" : value.toLocaleString()}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {showColumnTotals && (
                <tr className="bg-gray-200 font-bold">
                  <td className="border p-2">Total</td>
                  {columns.map((col) => (
                    <td key={`total-${col}`} className="border p-2 text-right">
                      {columnTotals[col].toLocaleString()}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminGame;
