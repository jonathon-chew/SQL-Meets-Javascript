function RunSQLCommand() {
    const SQLCommand = document.getElementById('SQLcommand').value;
    let fromStatement = SQLCommand.split('FROM');

    let resultsTable = document.querySelector("#resultTable > tbody:nth-child(1)")

    if (resultsTable) {
        resultsTable.remove()
    }

    if (SQLCommand.includes("CREATE TABLE")) {
        let table = SQLCommand.split("CREATE TABLE")[1].trim()
        if (!assert(table, { gtlength: 1 })) {
            showError("Could not find a table name after the command CREATE TABLE " + table.length)
            return
        }
        createTable(table)
        return 0
    }

    if (SQLCommand.includes("DROP TABLE")) {
        let table = SQLCommand.split("DROP TABLE")[1].trim()
        if (!assert(table, { gtlength: 1 })) {
            showError("Could not find a table name after the command DROP TABLE " + table.length)
            return
        }
        dropTable(table)
        return 0
    }

    // If we're not doing an insert table / drop table check we have the basics
    if (!assert(SQLCommand, { contains: "FROM" })) {
        showError("No FROM statement")
        return
    }

    if (!assert(SQLCommand, { contains: "SELECT" })) {
        showError("No SELECT statement")
        return
    }

    // Check the from statement has a table name after it
    if (!assert(fromStatement[1].trim(), { type: "string", gtlength: 0 })) {
        showError("No table name found after FROM statement")
        return
    }

    let tableName = fromStatement[1].trim().split(' ')[0];
    let selectStatement = fromStatement[0].trim().split('SELECT').slice(1);
    let tableID = document.getElementById(tableName).value

    if (!SQLCommand.includes("WHERE")) {
        if (selectStatement[0].trim() === '*') {
            showEntireTable(tableID);
        } else { // Print the columns listed - split by comma
            let outputString = ''
            console.log("selectStatement is ", selectStatement)
            outputString = getSelectStatement(selectStatement, tableID)
            showEntireTable(outputString)
        }
    } else {

    }

    if (SQLCommand.includes("INSERT INTO")) {
        let tableToInsertTo = SQLCommand.split("SELECT")[0].split("INSERT INTO")[1].trim()

        // CHECK THE TABLE TO INSERT INTO EXISTSs
        let getTags = document.getElementsByTagName("textArea")
        let checkTableExists = []
        for (let id in getTags) {
            if (getTags[id].id) {
                checkTableExists.push(getTags[id].id)
            }
        }
        if (!assert(checkTableExists, { contains: tableToInsertTo })) {
            showError("No table exists yet with that name to insert into!")
            return
        }

        console.log("selectStatement is ", selectStatement[0].trim())
        if (selectStatement[0].trim() === '*') {
            console.log("Matching the value of the tables insert:", tableToInsertTo, " from ", tableName)
            document.getElementById(tableToInsertTo).value = document.getElementById(tableName).value
        } else {
            document.getElementById(tableToInsertTo).value = getSelectStatement(selectStatement, tableID)
        };
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
        statement = statement.replace(',', '').trim();

        // Find (if at all) where the statement column is
        console.log("/", statement, "/", columnTitle.indexOf(statement));

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
                if (outputString.slice(-2) != '\n') {
                    outputString = outputString + rowData[k] + ","
                } else {
                    outputString = outputString + rowData[k]
                }
            }
        }
        outputString = outputString + "\n"
    }

    // console.log(outputString)
    return outputString
}

function assert(variable, {
    type = null,
    gtlength = -Infinity,
    ltlength = Infinity,
    eqlength = null,
    contains = "",
    isNot = "",
} = {}) {

    if (type !== null) {
        if (typeof (variable) !== type) {
            console.error(variable.type + " is not type " + type)
            return false
        }
    }

    if (gtlength !== -Infinity) {
        if (variable.length <= gtlength) {
            console.error(variable.length + " is less than" + gtlength)
            return false
        }
    }

    if (ltlength !== +Infinity) {
        if (variable.length >= ltlength) {
            console.error(variable.length + " is greater than" + ltlength)
            return false
        }
    }

    if (eqlength !== null) {
        if (variable.length !== eqlength) {
            console.error(variable.length + " is equal to" + eqlength)
            return false
        }
    }

    let found = false
    if (contains != "") {
        if (typeof (variable) == "string") {
            if (!variable.includes(contains)) {
                console.error(variable + " is a string and does not contain " + contains)
                return false
            }
        } else if (typeof (variable) == "object") {
            console.log("Checking array: ", variable)
            for (let item in variable) {
                console.log("Item in the array to check: ", variable[item])
                if (variable[item].includes(contains)) {
                    found = true
                    break
                }
            }
            if (!found) {
                console.error(variable + " is an array of length " + variable.length + " does not contain " + contains)
                return false
            }
        }
    }

    if (variable == isNot) {
        return false
    }

    return true

}

function showError(errorMessage) {

    // Get the result table
    const resultTable = document.getElementById("resultTable");

    // Clear the existing table content + just make it the error message
    resultTable.innerHTML = errorMessage;
}

function showEntireTable(textInput) {
    // Split the input by new lines to create an array of lines
    const lines = textInput.split("\n");

    // Get the result table
    const resultTable = document.getElementById("resultTable");

    // Clear the existing table content
    resultTable.innerHTML = '';

    /* const startRow = resultTable.insertRow(-1);
    const rowLength = lines[0].split(",")
    
        for (let i = 0; i < rowLength.length - 1; i++) {
            const newCell = startRow.insertCell(-1);
            newCell.textContent = i + 1
        } */

    // Loop through each line
    lines.forEach((line) => {
        // Split the line by commas to create an array of values
        const values = line.split(",").filter(item => item.trim() !== '');

        // Create a new row in the table for each line
        const newRow = resultTable.insertRow(-1);

        // Loop through the values and add each one to a new cell in the row
        values.forEach((value) => {
            const cell = newRow.insertCell(-1);
            cell.textContent = value;
        });
    });

}
