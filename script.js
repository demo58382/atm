let balance = 10000;
let visBal = true;
let statement = [];

// Function to show the loading spinner
function showLoading() {
  document.getElementById("resultContainer").innerText = "";
  document.getElementById("loadingSpinner").style.display = "inline-block";
}

// Function to hide the loading spinner
function hideLoading() {
  document.getElementById("loadingSpinner").style.display = "none";
}

//for showing custom alert
const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
const appendAlert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  alertPlaceholder.append(wrapper);
};

//function for taking input only number
function promptForNumber(message) {
  let input;
  do {
    input = prompt(message);
    if (isNaN(input) || input <= 0) {
      if (input === null) {
        alert("Operation cancelled.");
        break;
      }
      alert("Please enter a valid number!!!");
    }
  } while (isNaN(input) || input <= 0);

  return Number(input);
}

// function for dd/mm/yyyy format date
function formatDateTime(date) {
  // Ensure the input is a valid Date object
  if (!(date instanceof Date) || isNaN(date)) {
    return "Invalid Date";
  }

  // Get date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  // Get time components
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Concatenate components to form the "ddmmyyyy hh:mm:ss AM/PM" format
  const formattedDateTime = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;

  return formattedDateTime;
}

// Function to update the display based on the button clicked
function updateDisplay(result) {
  // Remove results from other buttons
  // document.getElementById("balanceContainer").innerText = "";
  // document.getElementById("depositContainer").innerText = "";
  // document.getElementById("withdrawContainer").innerText = "";

  // Display the result of the clicked button
  document.getElementById("resultContainer").innerText = result;

  const existingTable = document.getElementById("statementTable");
  if (existingTable) {
    existingTable.remove();
  }
}

// for checking balance
document.getElementById("balance").addEventListener("click", () => {
  if (visBal) {
    updateDisplay(`${balance} ₹`);
  } else {
    updateDisplay("");
  }
  visBal = !visBal;
});

// for deposit
document.getElementById("deposit").addEventListener("click", () => {
  const depAmnt = promptForNumber("Enter Amount");
  depAmnt > 0 ? showLoading() : null;
  setTimeout(() => {
    if (depAmnt > 0) {
      balance = balance + depAmnt;
      let date = new Date();
      statement.push({
        amount: `+${depAmnt} ₹`,
        type: "credit",
        date: formatDateTime(date),
        left_ammount: `${balance} ₹`,
      });

      updateDisplay(
        `${depAmnt} ₹ deposited successfully,\n current balance: ${balance} ₹`,
      );
      hideLoading();
    }
  }, 1500);
});

// for withdraw money
document.getElementById("withdraw").addEventListener("click", () => {
  const withdrawAmnt = promptForNumber("Enter Amount");
  withdrawAmnt > 0 ? showLoading() : null;

  setTimeout(() => {
    if (withdrawAmnt > 0) {
      if (balance - withdrawAmnt >= 0) {
        balance = balance - withdrawAmnt;

        let date = new Date();
        statement.push({
          amount: `-${withdrawAmnt} ₹`,
          type: "debit",
          date: formatDateTime(date),
          left_ammount: `${balance} ₹`,
        });

        updateDisplay(
          `Collect your ${withdrawAmnt} ₹ rupees,\n current balance: ${balance} ₹`,
        );
        hideLoading();
      } else {
        hideLoading();
        // alert("You do not have sufficient balance for withdrawal !!!");
        document.getElementById("resultContainer").innerText = "";

        const existingTable = document.getElementById("statementTable");
        if (existingTable) {
          existingTable.remove();
        }
        appendAlert(
          "You have not sufficient balance for withdrawal !!!",
          "danger",
        );
      }
    }
  }, 1500);
});

// statement code
document.getElementById("statement").addEventListener("click", () => {
  updateDisplay("");

  if (statement.length > 0) {
    // Clear statement results when clicking the "Statement" button
    const existingTable = document.getElementById("statementTable");
    if (existingTable) {
      existingTable.remove();
    }

    // Create a table element
    const table = document.createElement("table");
    table.id = "statementTable"; // Set an ID for the table
    table.className = "table table-bordered";
    //   // Create a table header row
    const thead = document.createElement("thead");

    const headerRow = document.createElement("tr");
    headerRow.classList.add("table-dark");

    // Extract column names from the first data entry
    const columns = Object.keys(statement[0]);

    // Create table header cells
    columns.forEach((column) => {
      const th = document.createElement("th");
      th.textContent = column;
      headerRow.appendChild(th);
    });

    //   // Append the header row to the table header
    thead.appendChild(headerRow);

    //   // Append the table header to the table
    table.appendChild(thead);

    //   // Create a table body
    const tbody = document.createElement("tbody");

    //   // Populate the table body with data
    statement.forEach((dataItem) => {
      const row = document.createElement("tr");
      if (dataItem.type === "credit") {
        row.classList.add("table-info");
      } else {
        row.classList.add("table-danger");
      }

      //     // Populate cells with data
      columns.forEach((column) => {
        const td = document.createElement("td");
        td.textContent = dataItem[column];

        row.appendChild(td);
      });

      //     // Append the row to the table body
      tbody.appendChild(row);
    });

    //   // Append the table body to the table
    table.appendChild(tbody);

    //   // Append the table to the body of the HTML document
    document.body.appendChild(table);
  }
});
