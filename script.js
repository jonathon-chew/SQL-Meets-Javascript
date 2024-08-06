function RunSQLCommand() {
    const table1 = document.getElementById("textInput1").value;
    const table2 = document.getElementById("textInput2").value;
    const table3 = document.getElementById("textInput3").value;

    const SQLCommand = document.getElementById('SQLcommand').value;
    let fromStatement = SQLCommand.split('FROM');

    let resultsTable = document.querySelector("#resultTable > tbody:nth-child(1)")

    if (resultsTable) {
        resultsTable.remove()
    }

    if (SQLCommand === "CREATE TABLE") {
        createTable()
        return 0
    }


    let tableName = fromStatement[1].trim().split(' ')[0];
    let selectStatement = fromStatement[0].trim().split(' ').slice(1);

    if (selectStatement[0] === '*') {
        // Select everything
        switch (tableName) {
            case 'textInput1':
                showEntireTable(table1);
                break
            case 'textInput2':
                showEntireTable(table2);
                break
            case 'textInput3':
                showEntireTable(table3);
                break
            default:
                console.log("Can't do this");
                break
        }
    } else { // Print the columns listed - split by comma
        // Empty array to add to
        let outputString = ''
        switch (tableName) {
            case 'textInput1':
                outputString = getSelectStatement(selectStatement, table1)
                showEntireTable(outputString)
                break
            case 'textInput2':
                outputString = getSelectStatement(selectStatement, table2)
                showEntireTable(outputString)
                break
            case 'textInput3':
                outputString = getSelectStatement(selectStatement, table3)
                showEntireTable(outputString)
                break
            default:
                console.log("Can't do this");
                break
        }
    }
}

function createTable() {
    let newTable = document.createElement('textarea')
    let numberOfTables = document.querySelectorAll('textarea').length
    let label = "textInput" + numberOfTables

    newTable.id = label
    newTable.title = label 
    newTable.placeholder = "Enter Text Data"
    newTable.style.width = "50vw"
    newTable.style.height = "10vh"
   // newTable.style.overflow-wrap = "normal"
   // newTable.style.overflow-x = "scroll"

    let tableTitle = document.createElement('p')
    tableTitle.innerText = label

    let body = document.querySelector('body')
    body.prepend(newTable)
    body.prepend(tableTitle)
}

function getSelectStatement(selectStatement, tableFinder) {
    // loop through the rest of the lines only printing those values contained in columnsToUser
    let columnsToUse = []

    // This could be more than one - this allows for it
    selectStatement.forEach(statement => {

        // Get the first line - as this will be column names
        let firstLine = tableFinder.split('\n')[0]
        let columnTitle = firstLine.split(',')

        // Remove the comma - statement is split by space NOT by comma so remove it to make it match
        statement = statement.replace(',', '');

        // Find (if at all) where the statement column is
        console.log(statement, columnTitle.indexOf(statement));

        // Push to the columnsToUseArray the index of the statement to be used later
        columnsToUse.push(columnTitle.indexOf(statement));

        // Build a JSON object for statement index to keep order of written?
        // Double JSON object 1 for index in column, 1 for index in statement
    });

    let outputString = ''
    let tableData = tableFinder.split('\n')
    for (let j = 0; j < tableData.length; j++) {
        let row = tableData[j]
        let rowData = row.split(',')
        for (let k = 0; k < rowData.length; k++) {
            if (columnsToUse.includes(k)) {
                outputString = outputString + ", " + rowData[k]
            }
        }
        outputString = outputString + "\n"
    }

    return outputString
}

function showEntireTable(textInput) {
    // Get the text input value - this is from the passed in value
    console.log(textInput)
    // Split the input by new lines to create an array of lines
    const lines = textInput.split("\n");

    // Get the result table
    const resultTable = document.getElementById("resultTable");

    // Clear the existing table content
    resultTable.innerHTML = '';

    const startRow = resultTable.insertRow(-1);
    const rowLength = lines[0].split(",")

    for (let i = 0; i < rowLength.length; i++) {
        const newCell = startRow.insertCell(-1);
        newCell.textContent = i + 1
    }

    // Loop through each line
    lines.forEach((line) => {
        // Split the line by commas to create an array of values
        const values = line.split(",");

        // Create a new row in the table for each line
        const newRow = resultTable.insertRow(-1);

        // Loop through the values and add each one to a new cell in the row
        values.forEach((value) => {
            const cell = newRow.insertCell(-1);
            cell.textContent = value;
        });
    });

}
