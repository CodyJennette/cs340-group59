function confirmDeletePatientDoctor(patientDoctorID) {
  var result = confirm("You sure you want to delete this patient-provider relationship?");
  if (result==true) {
   return deletePatientDoctor(patientDoctorID);
  } else {
   return false;
  }
}

function deletePatientDoctor(patientDoctorID) {
    // Put our data we want to send in a javascript object
    let data = {
        patient_doctor_id: patientDoctorID
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-patient-doctor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            deleteRow(patientDoctorID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with deleting.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(patientDoctorID){

    let table = document.getElementById("pd-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == patientDoctorID) {
            table.deleteRow(i);
            break; 
       }
    }
}
