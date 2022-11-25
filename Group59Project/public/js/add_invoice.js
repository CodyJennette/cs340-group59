// Get the objects we need to modify
let addInvoiceForm = document.getElementById('add-invoice-form-ajax');

// Modify the objects we need
addInvoiceForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDueDate = document.getElementById("input-duedate");
    let inputAmountDue = document.getElementById("input-amountdue");
    let inputServiceDate = document.getElementById("input-servicedate");
    let inputServicesBilled = document.getElementById("input-servicesbilled");
    let inputPaidAmount = document.getElementById("input-paidamount");
    let inputPaidDate = document.getElementById("input-paiddate");
    let inputDoctor = document.getElementById("input-doctor");
    let inputPatient = document.getElementById("input-patient");

    // Get the values from the form fields
    let dueDateValue = inputDueDate.value;
    let amountDueValue = inputAmountDue.value;
    let serviceDateValue= inputServiceDate.value;
    let servicesBilledValue = inputServicesBilled.value;
    let paidAmountValue = inputPaidAmount.value;
    let paidDateValue = inputPaidDate.value;
    let doctorValue = inputDoctor.value;
    let patientValue = inputPatient.value;

    // Put our data we want to send in a javascript object
    let data = {
        due_date: dueDateValue,
        amount_due: amountDueValue,
        service_date: serviceDateValue,
        services_billed: servicesBilledValue,
        paid_amount: paidAmountValue,
        paid_date: paidDateValue,
        doctor_id: doctorValue,
        patient_id: patientValue
    }
   
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-invoice-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDueDate.value = '';
            inputAmountDue.value = '';
            inputServiceDate.value = '';
            inputServicesBilled.value = '';
            inputPaidAmount.value = '';
            inputPaidDate.value = '';
            inputDoctor.value = '';
            inputPatient.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})



addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("invoice-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let dueDateCell = document.createElement("TD");
    let amountDueCell = document.createElement("TD");
    let serviceDateCell = document.createElement("TD");
    let servicesBilledCell = document.createElement("TD");
    let paidAmountCell = document.createElement("TD");
    let paidDateCell = document.createElement("TD");
    let doctorCell = document.createElement("TD");
    let patientCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.invoice_id;
    dueDateCell.innerText = newRow.due_date;
    amountDueCell.innerText = newRow.amount_due;
    serviceDateCell.innerText = newRow.service_date;
    servicesBilledCell.innerText = newRow.services_billed;
    paidAmountCell.innerText = newRow.paid_amount;
    paidDateCell.innerText = newRow.paid_date;
    doctorCell.innerText = newRow.doctor_id;
    patientCell.innerText = newRow.patient_id;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteInvoice(newRow.invoice_id);
    };



    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(dueDateCell);
    row.appendChild(amountDueCell);
    row.appendChild(serviceDateCell);
    row.appendChild(servicesBilledCell);
    row.appendChild(paidAmountCell);
    row.appendChild(paidDateCell);
    row.appendChild(doctorCell);
    row.appendChild(patientCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.invoice_id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    
    //let selectMenu = document.getElementById("doctorSelect");
    //let option = document.createElement("doctorOption");
    //option.text = newRow.doctor_name
    //option.value = newRow.doctor_id;
    //selectMenu.add(option);

    // End of new step 8 code.
}