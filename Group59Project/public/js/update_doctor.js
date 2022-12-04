let updateDoctorForm = document.getElementById('update-doctor-form-ajax');

// Modify the objects we need

updateDoctorForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("doctorSelect");
    let inputAddress = document.getElementById("input-address-html-update");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let addressValue = inputAddress.value;

    let message = 1;
    // check if we didn't want a Null address Update
    // let message = checkAddress(addressValue);

    // if (message != 1) {
    //    alert(message)
    // }


    if (message === 1) {
        let data = {
            fullname: fullNameValue,
            address: addressValue
        }
        
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/put-doctor-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");
    
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
    
                // Add the new data to the table
                updateRow(xhttp.response, fullNameValue);

                // Clear the input fields for another transaction
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


function updateRow(data, doctorID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("doctor-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == doctorID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of doctor value
            let td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign doctor to our value we updated to
            console.log(parsedData[0].doctor_address)
            td.innerHTML = parsedData[0].doctor_address;
            
       }
    }
}

function checkAddress(addressValue) {
    if(addressValue == "") {
        let message = "Address can not be left blank!"
        return message
    }

    else if(addressValue.length < 7) {
        let message = "That's barely an address, you can do better."
        return message
    }

    else {
        let message = 1
        return message
    }
    
}