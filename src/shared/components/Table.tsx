import React, { useState } from 'react';
import './Table.scss'; // Import the SCSS file
import { TableProps } from '../../interfaces/common.interface';

const Table: React.FC<TableProps> = ({ data, columns, className="Products", searchPlaceholder = 'Search', itemsPerPage = 3 }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle sorting logic
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Filter data based on search input
  const filteredData = data.filter((item) =>
    columns.some((column) =>
      String(item[column.key]).toLowerCase().includes(search.toLowerCase())
    )
  );

  // Sorting the data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    } else {
      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    }
  });

  // Pagination logic
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div  className={`table-container ${className}`}>
      {/* Search Input */}
      <div className="search-bar">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
        />
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} onClick={() => handleSort(column.key)} style={{ cursor: 'pointer' }}>
                {column.header} {sortColumn === column.key ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key}>{item[column.key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="no-data">No data found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls - Show only if data is greater than 10 */}
      {totalItems > 10 && (
        <div className="pagination">
          <span>Items per page: {itemsPerPage}</span>
          <span>
            {startIndex + 1} – {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
          </span>
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            &lt;
          </button>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;