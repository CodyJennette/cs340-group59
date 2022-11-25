// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 25011;                 // Set a port number at the top so it's easy to change in the future

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));         // this is needed to allow for the form to use the ccs style sheet/javscript
    

// index home page
app.get('/', function(req, res)
{
    return res.render('index');
});

app.get('/patients', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.patient_last_name === undefined)
    {
        query1 = "SELECT * FROM Patients;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Patients WHERE patient_last_name LIKE "${req.query.patient_last_name}%"`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM InsurancePlans;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people/patients
        let people = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the insurance plan table rows
            let plans = rows;

            // Construct an object for reference in the table
            // Array.map is awesome for doing something with each
            // element of an array.
            let planmap = {}
            plans.map(plan => {
                let id = parseInt(plan.insurance_plan_id, 10);

                planmap[id] = plan["plan_name"];
                //console.log(planmap[id])
            })

            // Overwrite the Insurance ID with the name of the insurance in the people object
            people = people.map(person => {
                return Object.assign(person, {insurance_plan_id: planmap[person.insurance_plan_id]})
            })

            return res.render('patients', {data: people, plans: plans});
        })
    })
});

app.get('/insurance-plans', function(req, res)
    {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.plan_name === undefined)
    {
        query1 = "SELECT * FROM InsurancePlans;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM InsurancePlans WHERE plan_name LIKE "${req.query.plan_name}%" OR plan_name LIKE "%${req.query.plan_name}%";`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        let plans = rows;

        return res.render('insurance-plans.hbs', {data: plans});

    })
});

app.get('/doctors', function(req, res)
    {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.doctor_name === undefined)
    {
        query1 = "SELECT * FROM Doctors;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Doctors WHERE doctor_name LIKE "${req.query.doctor_name}%" OR doctor_name LIKE "%${req.query.doctor_name}%";`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        let doctors = rows;

        return res.render('doctors.hbs', {data: doctors});

    })
});


app.get('/invoices', function(req, res)
    {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.services_billed === undefined)
    {
        query1 = "SELECT * FROM Invoices;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Invoices WHERE services_billed LIKE "${req.query.services_billed}%" OR services_billed LIKE "%${req.query.services_billed}%";`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        let invoices = rows;

        return res.render('invoices.hbs', {data: invoices});

    })
});


app.get('/patients-doctors', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if ((req.query.patient_last_name === undefined) && (req.query.doctor_name === undefined))
    {
        query1 = "SELECT * FROM Patients_Doctors;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else if (req.query.patient_last_name != undefined)
    {
        query1 = `SELECT Patients_Doctors.patient_doctor_id, Patients.patient_id, Patients_Doctors.doctor_id FROM Patients_Doctors
        INNER JOIN Patients ON Patients.patient_id = Patients_Doctors.patient_id
        WHERE Patients.patient_last_name LIKE "${req.query.patient_last_name}%"
        ORDER BY Patients.patient_last_name;`
    }

    else if (req.query.doctor_name != undefined)
    {
        query1=`SELECT Patients_Doctors.patient_doctor_id, Patients_Doctors.patient_id, Doctors.doctor_id FROM Patients_Doctors
        INNER JOIN Doctors ON Doctors.doctor_id = Patients_Doctors.doctor_id
        WHERE Doctors.doctor_name LIKE "${req.query.doctor_name}%" OR doctor_name LIKE "%${req.query.doctor_name}%"
        ORDER BY Doctors.doctor_name;`
    }

    
    let query2 = "SELECT * FROM Patients ORDER BY Patients.patient_last_name;";
    let query3 = "SELECT * FROM Doctors;"
    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the table rows
        let patientDoctors = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the patients
            let patients = rows;
            
            

            let planmap = {}
            patients.map(plan => {
                let id = parseInt(plan.patient_id, 10);
                planmap[id] = [plan["patient_first_name"], plan["patient_last_name"]].join(' ');
            })
            console.log(planmap)

            // Run the third query
            db.pool.query(query3, (error, rows, fields) => {

                let doctors = rows;
                console.log(doctors);
                let doctormap = {}

                doctors.map(doctor => {
                    let id = parseInt(doctor.doctor_id, 10);
                    doctormap[id] = doctor["doctor_name"];
                    })
                console.log("doctormap", doctormap)
                patientDoctors = patientDoctors.map(person => {
                    return Object.assign(person, {doctor_id: doctormap[person.doctor_id], patient_id: planmap[person.patient_id]})   
                })
                return res.render('patients-doctors.hbs', {data: patientDoctors, patients: patients, doctors: doctors});
            })
            
        })
    })
});


app.post('/add-patient-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let insurance_plan = parseInt(data['input-insurance']);
    if (isNaN(insurance_plan))
    {
        insurance_plan = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Patients (patient_first_name, patient_last_name, insurance_plan_id) VALUES ('${data['input-fname']}', '${data['input-lname']}', ${insurance_plan})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Patients and
        // presents it on the screen
        else
        {
            res.redirect('patients');
        }
    })
});


app.post('/add-invoice-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let invoice = req.body;

    // Capture NULL values
    let paid_amount = parseInt(invoice['input-paidamount']);
    if (isNaN(paid_amount))
    {
        paid_amount = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Invoices (due_date, amount_due, service_date, services_billed, paid_amount, paid_date, doctor_id, patient_id) VALUES ('${invoice['input-duedate']}', '${invoice['input-amountdue']}', '${invoice['input-servicedate']}', '${invoice['input-servicesbilled']}', '${paid_amount}', '${invoice['input-paiddate']}', '${invoice['input-doctor']}', '${invoice['input-patient']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Invoices and
        // presents it on the screen
        else
        {
            res.redirect('invoices');
        }
    })
});


app.post('/add-patient-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values age
    let insurance_plan = parseInt(data.insurance_plan_id);
    
    if (isNaN(insurance_plan))
    {
        insurance_plan = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Patients (patient_first_name, patient_last_name, insurance_plan_id) VALUES ('${data.patient_first_name}', '${data.patient_last_name}', ${insurance_plan})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Patients
            query2 = `SELECT Patients.patient_id, Patients.patient_first_name, Patients.patient_last_name, Patients.insurance_plan_id, InsurancePlans.plan_name
FROM Patients 
LEFT JOIN InsurancePlans ON Patients.insurance_plan_id = InsurancePlans.insurance_plan_id;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-patient-ajax/', function(req,res,next){
  let data = req.body;
  let patientID = parseInt(data.patient_id);
  let deletePatients_Doctors  = `DELETE FROM Patients_Doctors WHERE patient_id = ?`;
  let deletePatients = `DELETE FROM Patients WHERE patient_id = ?`;


        // Run the 1st query
        db.pool.query(deletePatients_Doctors, [patientID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deletePatients, [patientID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400); 
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
})});

app.put('/put-person-ajax', function(req,res,next){                                   
    let data = req.body;

    let insurance_plan= parseInt(data.plan);
    let person = parseInt(data.fullname);
  
    queryUpdatePlan = `UPDATE Patients SET insurance_plan_id = ? WHERE Patients.patient_id = ?`;
    selectPlan = `SELECT * FROM InsurancePlans WHERE insurance_plan_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdatePlan, [insurance_plan, person], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectPlan, [insurance_plan], function(error, rows, fields) {
          
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

//////////////  DOCTORS


app.post('/add-doctor-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    //formatData(data);
    // Capture NULL values
    //let address = parseInt(data['input-address']);
    let first = data['input-fname'];
    let last = data['input-lname'];
    let fullName = [first,' ', last].join('');
    let address = data['input-address'];
    console.log(address)

    query1 = `INSERT INTO Doctors (doctor_name, doctor_address) VALUES ('${fullName}', '${address}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('doctors');
        }
    })
});

app.post('/add-doctor-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    formatData(data)
    // Capture NULL values of Name.

    // Create the query and run it on the database
    query1 = `INSERT INTO Doctors (doctor_name, doctor_address) VALUES ('${data.doctor_name}', '${data.address}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {   
            //if there was no error, perform a SELECT * on Doctors
            query2 = `SELECT * FROM Doctors;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-patient-doctor-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let patient= data['input-patient'];
    let doctor = data['input-doctor'];

    // Create the query and run it on the database
    query1 = `INSERT INTO Patients_Doctors (patient_id, doctor_id) VALUES ('${data['input-patient']}', '${data['input-doctor']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Patients and
        // presents it on the screen
        else
        {
            res.redirect('patients-doctors');
        }
    })
});

app.delete('/delete-invoice-ajax/', function(req,res,next){
    let invoice = req.body;
    let invoiceID = parseInt(invoice.invoice_id);
    let deleteInvoices = `DELETE FROM Invoices WHERE invoice_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteInvoices, [invoiceID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteInvoices, [invoiceID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400); 
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

app.delete('/delete-doctor-ajax/', function(req,res,next){
  let data = req.body;
  let doctorID = parseInt(data.doctor_id);
  let deletePatients_Doctors  = `DELETE FROM Patients_Doctors WHERE doctor_id = ?`;
  let deleteDoctors = `DELETE FROM Doctors WHERE doctor_id = ?`;


        // Run the 1st query
        db.pool.query(deletePatients_Doctors, [doctorID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteDoctors, [doctorID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400); 
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
})});

app.put('/put-doctor-ajax', function(req,res,next){                                   
    let data = req.body;
    formatData(data)
    
    let address= data.address;
    let doctor = parseInt(data.fullname);
  
    queryUpdateAddress = `UPDATE Doctors SET address = ? WHERE Doctors.doctor_id = ?`;
    //selectPlan = `SELECT * FROM InsurancePlans WHERE insurance_plan_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateAddress, [address, doctor], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                res.send(rows);
              }
  })});
  
// function to be use with routes to turn empty strings into NULL values for DB
function formatData(data) {
    for (const key of Object.keys(data)) {
        if (typeof data[key]=== 'string') {
            if (data[key].trim()==='') {
                data[key] = null
            } else {
                data[key]= `${data[key]}`;
            }
        }
    }
    return;
}
  /*
      LISTENER
  */
  app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
      console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
  });