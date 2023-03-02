import React, { useMemo, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { deepEqual } from "../../helpers/helper.js";
import { Column, DataTableProps, SortType } from "../../types/types.ts";

const DataTable = ({ data, columns, pageSize = 5 }: DataTableProps) => {
  const [sortColumn, setSortColumn] = useState<Column>();
  const [sortDirection, setSortDirection] = useState<SortType>("asc");
  const [filterColumn, setFilterColumn] = useState<Column>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const sortedData = useMemo(() => {
    if (sortColumn) {
      const sorted = [...data].sort((a, b) => {
        if (a[sortColumn.key] < b[sortColumn.key]) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (a[sortColumn.key] > b[sortColumn.key]) {
          return sortDirection === "asc" ? 1 : -1;
        }

        return 0;
      });

      return sorted;
    }

    return data;
  }, [data, sortColumn, sortDirection]);

  const filteredData = useMemo(() => {
    let filtered = sortedData;

    if (filterColumn && searchTerm) {
      filtered = filtered.filter((item: any) =>
        Object.values(item[filterColumn.key])
          .join("")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (!filterColumn && searchTerm) {
      filtered = filtered.filter((item: any) =>
        Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [sortedData, filterColumn, filterValue, searchTerm]);

  const paginatedData = useMemo(() => {
    const startedIndex = (currentPage - 1) * pageSize;
    const endIndex = startedIndex + pageSize;

    return filteredData.slice(startedIndex, endIndex);
  }, [filteredData, currentPage]);

  const handleSort = (column: Column) => {
    if (sortColumn?.key === column.key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  //filter column change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    const column = columns.find((column: Column) => column.key === value);

    if (column) {
      setFilterColumn(column);
      setFilterValue(value);
    } else {
      setFilterColumn("");
      setFilterValue("");
    }
  };

  //search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  //hide column change
  const handleHideColumn = (columnKey: string) => {
    setHiddenColumns([...hiddenColumns, columnKey]);
  };

  //this row is selected true and false
  const isSelectedRow = (row: any) =>
    selectedRows.find((selectedRow: any) => deepEqual(selectedRow, row));

  //paginated rows are all selected true and false
  const isSelectedAllRow = () => {
    let selectedCount = 0;
    paginatedData.map((row: any) => {
      if (isSelectedRow(row)) {
        selectedCount++;
      }
    });

    return selectedCount === paginatedData.length;
  };

  //single row select
  const handleSelectRow = (row: any) => {
    setSelectedRows(
      isSelectedRow(row)
        ? selectedRows.filter(
            (selectedRow: any) => !deepEqual(selectedRow, row)
          )
        : [...new Set([...selectedRows, row])]
    );
  };

  //all row select
  const handleSelectAllRow = () => {
    setSelectedRows(
      isSelectedAllRow()
        ? selectedRows.filter(
            (selectedRow: any) =>
              !paginatedData.find((data: any) => deepEqual(data, selectedRow))
          )
        : [...new Set([...selectedRows, ...paginatedData])]
    );
  };

  const visibleColumns = columns.filter(
    (column: Column) => !hiddenColumns.includes(column.key)
  );

  return (
    <div className="app">
      <div className="table-header">
        <select
          className="search-filter-list"
          defaultValue={filterValue}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          {visibleColumns.map((column: Column) => (
            <option key={column.key} value={column.key}>
              {column.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="check-column">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && isSelectedAllRow()}
                    onChange={() => handleSelectAllRow()}
                  />
                </label>
              </th>
              {visibleColumns.map((column: Column) => (
                <th key={column.key} onClick={() => handleSort(column)}>
                  <div className="table-row">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span>{column.title}</span>
                      <span
                        style={{
                          color: "blue",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            color:
                              sortDirection === "asc" &&
                              sortColumn?.key === column.key
                                ? "blue"
                                : "silver",
                          }}
                        >
                          ▲
                        </span>
                        <span
                          style={{
                            color:
                              sortDirection === "desc" &&
                              sortColumn?.key === column.key
                                ? "blue"
                                : "silver",
                          }}
                        >
                          ▼
                        </span>
                      </span>
                    </div>

                    <button
                      className="thead-icon"
                      onClick={() => handleHideColumn(column.key)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row: any) => (
              <tr
                className={isSelectedRow(row) ? "row-selected" : ""}
                key={row.id}
              >
                <td className="check-row">
                  <input
                    type="checkbox"
                    checked={Boolean(isSelectedRow(row))}
                    onChange={() => handleSelectRow(row)}
                  />
                </td>
                {visibleColumns.map((column: Column) => (
                  <td key={column.key} data-label={column.title}>
                    {column?.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-bar">
        <Pagination
          currentPage={currentPage}
          totalCount={filteredData.length}
          pageSize={pageSize}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default DataTable;
