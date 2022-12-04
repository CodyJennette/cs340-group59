function confirmDeletePlan(insurancePlanId) {
    var result = confirm("You sure you want to delete?");
    if (result==true) {
     return deletePlan(insurancePlanId);
    } else {
     return false;
    }
  }


function deletePlan(insurancePlanId) {
    // Put our data we want to send in a javascript object

    let data = {
        insurance_plan_id: insurancePlanId
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-plan-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            deleteRow(insurancePlanId);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with deleting.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(insurancePlanId){

    let table = document.getElementById("plans-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == insurancePlanId) {
            table.deleteRow(i);
            deleteDropDownMenu(insurancePlanId);
            break; 
       }
    }
}


function deleteDropDownMenu(insurancePlanId){
  let selectMenu = document.getElementById("planSelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(insurancePlanId)){
      selectMenu[i].remove();
      break;
    }

  }
}