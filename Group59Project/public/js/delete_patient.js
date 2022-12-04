
function confirmDeletePatient(patientID) {
  var result = confirm("You sure you want to delete this patient?");
  if (result==true) {
   return deletePatient(patientID);
  } else {
   return false;
  }
}

function deletePatient(patientID) {
    // Put our data we want to send in a javascript object
    let data = {
        patient_id: patientID
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-patient-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            deleteRow(patientID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with deleting.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(patientID){

    let table = document.getElementById("people-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == patientID) {
            table.deleteRow(i);
            deleteDropDownMenu(patientID);
            break; 
       }
    }
}


function deleteDropDownMenu(patientID){
  let selectMenu = document.getElementById("mySelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(patientID)){
      selectMenu[i].remove();
      break;
    }

  }
}