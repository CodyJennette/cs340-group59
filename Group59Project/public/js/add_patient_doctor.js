///  HTML that could go with patients-doctors page if wanted to manually add patient doctor relationships.

{/*  <div class="add-db">

    <h3>Add a patient-doctor here...</h3>
        <form class="box-sub" id="add-patient-doctor-form-ajax">
            <p>To add a new patient, please enter their information below and click `Submit`!</p>
            <label for="input-patient">Patient: </label>
            <select name="input-patient" id="input-patient-ajax">
                <option value="">Select a Patient</option>
                {{#each patients}}
                <option value="{{this.patient_id}}">{{this.patient_first_name}}  {{this.patient_last_name}}</option>
                {{/each}}
            </select>

            <label for="input-doctor">Doctor: </label>
            <select name="input-doctor" id="input-doctor-ajax">
                <option value="">Select a Doctor</option>
                {{#each doctors}}
                <option value="{{this.doctor_id}}">{{this.doctor_name}}</option>
                {{/each}}
            </select>

            <input type="submit">
        </form>
        <script src="./js/add_patient_doctor.js"></script> */}




// Get the objects we need to modify
let addPatientDoctorForm = document.getElementById('add-patient-doctor-form-ajax');

// Modify the objects we need
addPatientDoctorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPatient = document.getElementById("input-patient-ajax");
    let inputDoctor = document.getElementById("input-doctor-ajax");

    // Get the values from the form fields
    let patientValue = inputPatient.value;
    let doctorValue = inputDoctor.value;

    // Put our data we want to send in a javascript object
    let data = {
        patient_id: patientValue,
        doctor_id: doctorValue
    }
    console.log(data)
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-patient-doctor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPatient.value = '';
            inputDoctor.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("pd-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let patientCell = document.createElement("TD");
    let doctorCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.patient_doctor_id;
    patientCell.innerText = newRow.patient_first_name + ' ' +  newRow.patient_last_name;
    doctorCell.innerText = newRow.doctor_name;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        confirmDeletePatientDoctor(newRow.patient_doctor_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(patientCell);
    row.appendChild(doctorCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.patient_doctor_id);

    // Add the row to the table
    currentTable.appendChild(row);
}