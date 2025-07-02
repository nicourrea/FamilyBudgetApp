// viewtable.js

// Exported function to build an editable, sortable table
export function buildTable(column_names, table_data) {
    const container = document.getElementById('tableContainer');
    if (!container) {
        console.error("Missing #tableContainer in the DOM.");
        return;
    }

    const table = document.createElement('table');
    table.setAttribute("data-editable", "true");
    table.style.margin = '40px auto';
    table.style.borderCollapse = 'collapse';
    table.style.width = '80%';
    table.style.fontSize = '18px';
    table.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    table.style.border = '1px solid #ccc';
    table.style.textAlign = 'center';

    // Header
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    column_names.forEach((col, idx) => {
        const th = document.createElement('th');
        th.textContent = col;
        th.style.padding = '12px 16px';
        th.style.backgroundColor = '#9AC0CD';
        th.style.fontWeight = 'bold';
        th.style.borderBottom = '2px solid #555';
        th.style.color = '#000';
        th.style.cursor = 'pointer';

        // Clickable sort
        th.addEventListener('click', () => sortTable(table, idx));
        headerRow.appendChild(th);
    });

    // Body
    const tbody = table.createTBody();
    table_data.forEach(row => {
        const tr = tbody.insertRow();
        tr.dataset.rowId = row.id;

        column_names.forEach(col => {
            const td = tr.insertCell();

            // Format dates to user-friendly string
            let value = row[col];
            if (col.toLowerCase().includes("date") && value) {
                const d = new Date(value);
                value = !isNaN(d) ? d.toLocaleDateString('en-US') : value;
            }

            td.textContent = value ?? '';
            td.setAttribute("contenteditable", col !== 'id' && col !== 'added_by');
            td.setAttribute("data-column-name", col);
            td.style.padding = '10px 14px';
            td.style.borderBottom = '1px solid #ccc';
        });
    });

    // Render table
    container.innerHTML = '';
    container.appendChild(table);
    console.log(" Table built successfully.");
}

// Helper: Sort table rows by column
function sortTable(table, columnIndex) {
    const rows = Array.from(table.rows).slice(1); // skip header
    const isAsc = table.getAttribute("data-sort-dir") !== "asc";

    rows.sort((a, b) => {
        const valA = a.cells[columnIndex].innerText.trim();
        const valB = b.cells[columnIndex].innerText.trim();

        const parsedA = isNaN(valA) ? valA : parseFloat(valA.replace('$', ''));
        const parsedB = isNaN(valB) ? valB : parseFloat(valB.replace('$', ''));

        return (parsedA > parsedB ? 1 : -1) * (isAsc ? 1 : -1);
    });

    rows.forEach(row => table.appendChild(row)); // re-attach in new order
    table.setAttribute("data-sort-dir", isAsc ? "asc" : "desc");
}