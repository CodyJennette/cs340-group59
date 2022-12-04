
let addPlanForm = document.getElementById('add-plan-form-ajax');

// Modify the objects we need
addPlanForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPlanName = document.getElementById("input-pname");
    let inputNumberPatients = document.getElementById("input-number");
    let inputBillFrequency = document.getElementById("frequencySelect");
    console.log(inputNumberPatients)
    console.log(inputBillFrequency)

    // Get the values from the form fields
    let planNameValue = inputPlanName.value;
    let numberPatientValue = inputNumberPatients.value;
    let billFrequencyValue = inputBillFrequency.value;

    // checks validity that input values are not null, or alerts message
    let message = checkPlanValidity(planNameValue, numberPatientValue, billFrequencyValue);

    if (message != 1) {
        alert(message)
    }

    if (message === 1) {

        // Put our data we want to send in a javascript object
        let data = {
            plan_name: planNameValue,
            number_of_patients: numberPatientValue,
            bill_frequency: billFrequencyValue
        }
        console.log("this is data", data)
        
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/add-plan-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");
    
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
    
                // Add the new data to the table
                addRowToTable(xhttp.response);
    
                // Clear the input fields for another transaction
                inputPlanName.value = '';
                inputBillFrequency.value = '';
                inputNumberPatients.value = '';
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }
        console.log(data)
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));

    }
    

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("plans-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let planNameCell = document.createElement("TD");
    let numberPatientsCell = document.createElement("TD");
    let billFrequencyCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.insurance_plan_id;
    planNameCell.innerText = newRow.plan_name;
    numberPatientsCell.innerText = newRow.number_of_patients;
    billFrequencyCell.innerText = newRow.bill_frequency;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        confirmDeletePlan(newRow.insurance_plan_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(planNameCell);
    row.appendChild(numberPatientsCell);
    row.appendChild(billFrequencyCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.insurance_plan_id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("planSelect");
    let option = document.createElement("option");
    option.text = newRow.plan_name;
    option.value = newRow.insurance_plan_id;
    selectMenu.add(option);
    // End of new step 8 code.
}

// creates message if unsatisfactory input (ie empty fields). if message = 1, input is good.
function checkPlanValidity(planNameValue, numberPatientValue, billFrequencyValue) {

    if (planNameValue == "") {
        let message = "Your plan name can't be nothing, silly!"
        return message
    }

    else if (numberPatientValue.length < 0) {
        let message = "You can't have negative subscribers!"
        return message
    }

    else if (billFrequencyValue === 'None') {
        let message = "Please select a valid bill frequency."
        return message
    }
    // else if (insurancePlanValue.length === null {
    //     let message = "What no insurance plan?"
    //     return message
    // }
    else {
        let message = 1
        return message
    }

}