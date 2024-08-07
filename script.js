function RunSQLCommand() {
    const SQLCommand = document.getElementById('SQLcommand').value;
    let fromStatement = SQLCommand.split('FROM');

    let resultsTable = document.querySelector("#resultTable > tbody:nth-child(1)")

    if (resultsTable) {
        resultsTable.remove()
    }

    if (SQLCommand.includes("CREATE TABLE")) {
        let table = SQLCommand.split("CREATE TABLE")[1].trim()
        createTable(table)
        return 0
    }

    if (SQLCommand.includes("DROP TABLE")) {
        let table = SQLCommand.split("DROP TABLE")[1].trim()
        dropTable(table)
        return 0
    }

    let tableName = fromStatement[1].trim().split(' ')[0];
    let selectStatement = fromStatement[0].trim().split(' ').slice(1);
    let tableID = document.getElementById(tableName).value

    if (selectStatement[0] === '*') {
        showEntireTable(tableID);
    } else { // Print the columns listed - split by comma
        let outputString = ''
        outputString = getSelectStatement(selectStatement, tableID)
        showEntireTable(outputString)
    }
}

function dropTable(tableID) {

    let removeTable = document.getElementById(tableID)

    if (removeTable) {
        removeTable.remove()
    } else {
        console.log("Could not find a table by that name")
    }

    const paragraphs = document.querySelectorAll('p');
    const targetParagraph = Array.from(paragraphs).find(p => p.textContent === tableID);

    // Check if the paragraph was found and remove it
    if (targetParagraph) {
        targetParagraph.remove();
    } else {
        console.log('Paragraph with the specified text not found.');
    }

}

function createTable(tableID) {
    let newTable = document.createElement('textarea')
    let label = tableID

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
