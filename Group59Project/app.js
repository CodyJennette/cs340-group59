// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 25012;                 // Set a port number at the top so it's easy to change in the future

// app.js
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
    


app.get('/', function(req, res)
{
    return res.render('index');
});
// app.js
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
        
        // Save the people
        let people = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
            let plans = rows;

            // BEGINNING OF NEW CODE

            // Construct an object for reference in the table
            // Array.map is awesome for doing something with each
            // element of an array.
            let planmap = {}
            plans.map(plan => {
                let id = parseInt(plan.insurance_plan_id, 10);

                planmap[id] = plan["plan_name"];
                //console.log(planmap[id])
            })

            // Overwrite the homeworld ID with the name of the planet in the people object
            people = people.map(person => {
                return Object.assign(person, {insurance_plan_id: planmap[person.insurance_plan_id]})
            })

            // END OF NEW CODE
            return res.render('patients', {data: people, plans: plans});
        })
    })
});

//////////////


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


  ////////////

  
  /*
      LISTENER
  */
  app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
      console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
  });