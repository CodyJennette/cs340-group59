// Get the objects we need to modify
let addDoctorForm = document.getElementById('add-doctor-form-ajax');

// Modify the objects we need
addDoctorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-fname-ajax");
    let inputLastName = document.getElementById("input-lname-ajax");
    let inputAddress = document.getElementById("input-address-ajax");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let addressValue= inputAddress.value;

    // checks validity that input values are not null, or alerts message
    let message = checkDoctorValidity(firstNameValue, lastNameValue, addressValue);

    if (message != 1) {
        alert(message)
    }

    if (message === 1) {

        let fullName = [firstNameValue, lastNameValue].join(' ');
        // Put our data we want to send in a javascript object
        let data = {
            doctor_name: fullName,
            address: addressValue
        }
    
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/add-doctor-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                addRowToTable(xhttp.response);

                // Clear the input fields for another transaction
                inputFirstName.value = '';
                inputLastName.value = '';
                inputAddress.value = '';
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));

    }
    

})



addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("doctor-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let fullNameCell = document.createElement("TD");
    let addressCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.doctor_id;
    fullNameCell.innerText = newRow.doctor_name;
    addressCell.innerText = newRow.doctor_address;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteDoctor(newRow.doctor_id);
    };



    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(fullNameCell);
    row.appendChild(addressCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.doctor_id);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("doctorSelect");
    let option = document.createElement("option");
    option.text = newRow.doctor_name;
    option.value = newRow.doctor_id;
    selectMenu.add(option);
}

// creates message if unsatisfactory input (ie empty fields). if message = 1, input is good.
function checkDoctorValidity(firstNameValue, lastNameValue, addressValue) {

    if (firstNameValue == "") {
        let message = "Can first names be that short?"
        return message
    }

    else if(containsNumbers(firstNameValue) === true) {
        let message = "You sure you want a number there?"
        return message
    }

    else if (lastNameValue.length < 2) {
        let message = "Is that a real last name?"
        return message
    }

    else if(containsNumbers(lastNameValue) === true) {
        let message = "You sure you want a number there?"
        return message
    }
    // else if (addressValue.length < 7) {
    //     let message = "What kind of address is that?"
    //     return message
    // }

    else {
        let message = 1
        return message
    }

    function containsNumbers(string) {
        return /\d/.test(string)
    }

}