function confirmDeleteDoctor(doctorID) {
  var result = confirm("You sure you want to delete this provider?");
  if (result==true) {
   return deleteDoctor(doctorID);
  } else {
   return false;
  }
}

function deleteDoctor(doctorID) {
    // Put our data we want to send in a javascript object
    let data = {
        doctor_id: doctorID
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-doctor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            deleteRow(doctorID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with deleting.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(doctorID){

    let table = document.getElementById("doctor-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == doctorID) {
            table.deleteRow(i);
            deleteDropDownMenu(doctorID);
            break; 
       }
    }
}


function deleteDropDownMenu(doctorID){
  let selectMenu = document.getElementById("doctorSelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(doctorID)){
      selectMenu[i].remove();
      break;
    }
  }
}