# Further enhancements I'd like to make

## Table functionality
- **Sort by 1+ columns**: Sorting logic customized per column (if sortable). Defaults to A-Z.
- **Filter by 1+ columns**: Filtering logic and UI components (multi-select, range/greater than/less than, starts/ends with) customized per column
- **Select page size** (rows per page): Can store this preference in cookies to auto apply it on their next visit.
- **Genericize `table-with-search` component**: Instead of defining table columns and data within the `table-with-search` component, define these variables as props & pass them down from parent component.
- **Actions**: Buttons for create, update, delete.

## Design
- **Improve specialties UI/UX**: Limit number of lines displayed, truncate chip text, represent specialties via icons, use colors for enhanced readability
- **Improve sizing / scrolling UX**: Always display column headers, search, and pagination. Intentionally size columns.
- **Improve search UX**: Highlight the matching string for each result row within the table.
- **Use Solace brand colors**
- **Utilize icons where appropriate**: Search input, sorting

## Data & security
- **Ensure DRY data model**: Move repeated/shared data to separate tables and create join tables between them & advocates
  - Specialties
  - Degrees
  - Cities
- **Authentication**: Require user to be logged in, pass token via Request headers, verify token on BE before returining data
