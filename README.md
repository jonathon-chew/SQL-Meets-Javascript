# SQL Meets JavaScript

`SQL Meets JavaScript` is a small browser-based experiment that lets you run a limited SQL-like syntax against CSV data entered directly into the page.

The goal is not to build a full database engine. It is to explore how familiar SQL concepts can be mapped onto plain JavaScript and rendered immediately in the browser.

## What It Does

- loads CSV-style table data from text areas in the page
- runs a small set of SQL-like commands in JavaScript
- renders the result as an HTML table
- allows basic table creation and removal in the browser session

This project is best thought of as a lightweight parser and query demo rather than a full SQL implementation.

## Supported Commands

The current version supports:

- `SELECT * FROM table`
- `SELECT column1, column2 FROM table`
- `CREATE TABLE table_name`
- `DROP TABLE table_name`
- `INSERT INTO table_name SELECT column1 FROM other_table`

Tables are stored in page text areas, and query results are shown in the result table on the page.

## Example

Given a table like:

```csv
name,role,team
Alice,Developer,Platform
Bob,Analyst,Operations
Cara,Developer,Infrastructure
```

You can run:

```sql
SELECT name, role FROM textInput1
```

Or:

```sql
CREATE TABLE developers
INSERT INTO developers SELECT name, role FROM textInput1
```

## Running Locally

This project is a static browser app.

Open `index.html` in a browser and start entering CSV data and commands.

If your browser blocks local script behavior, serve the folder with a simple local server instead.

## How It Works

- the query string is parsed with straightforward string operations
- the `FROM` clause identifies which text area to read from
- CSV rows are split into arrays in JavaScript
- selected columns are extracted and rebuilt into a result set
- the result set is rendered into an HTML table

The implementation is intentionally simple and favors experimentation over strict SQL correctness.

## Current Limitations

- no full SQL parser
- table names and commands are case-sensitive in practice
- CSV parsing is basic and does not handle advanced quoting/escaping rules
- no `WHERE`, `JOIN`, `GROUP BY`, or `ORDER BY` yet
- errors are not surfaced as polished user-facing messages
- data only exists for the current browser session

## Why This Project Exists

This project is a hands-on way to explore:

- parsing user input in JavaScript
- representing tabular data in the browser
- mapping SQL-like concepts onto simple in-memory structures
- building interactive demos without a backend

## Roadmap

Planned improvements include:

- `WHERE` filtering
- `ORDER BY`
- `DISTINCT`
- table aliases with `AS`
- `table.column` selection
- `JOIN` support
- better error handling
- cleaner CSV parsing

## Project Files

- `index.html` contains the UI
- `script.js` handles parsing and query execution
- `style.css` styles the page

## Status

This is an experimental prototype. The interesting part of the repo is the idea and the implementation approach, not feature completeness.
