import React from "react";

const TableRow = ({ table }) => {
  return (
    <tr>
      <td className="px-4 py-2 text-center">{table.number}</td>
      <td className="px-4 py-2 text-center">{table.status}</td>
    </tr>
  );
};

export default TableRow;
