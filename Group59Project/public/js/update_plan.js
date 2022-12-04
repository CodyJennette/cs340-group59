let updatePlanForm = document.getElementById('update-plan-form-ajax');

// Modify the objects we need
updatePlanForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPlanName = document.getElementById("planSelect");
    let inputFrequency = document.getElementById("input-frequency");
    let inputNumberPatients = document.getElementById("input-number-patients");

    // Get the values from the form fields
    let planNameValue = inputPlanName.value;
    let frequencyValue = inputFrequency.value;
    let numberPatientsValue = inputNumberPatients.value;


    // Put our data we want to send in a javascript object
    let data = {
        plan_id: planNameValue,
        frequency: frequencyValue,
        number_patients: numberPatientsValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-plan-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, planNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, planID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("plans-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == planID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // update number of patients on table page display
            let num = updateRowIndex.getElementsByTagName("td")[2];
            num.innerHTML = parsedData[0].number_of_patients;

            // update bill frequency to new value on table page display
            let bill = updateRowIndex.getElementsByTagName("td")[3];
            bill.innerHTML = parsedData[0].bill_frequency;
            
       }
    }
}