-- CS 340
-- Group 59
-- Corianne Frankovitch
-- Cody Jennette

-- Project Step 5 Draft Version
-- DML.sql

-- Create a new patient

INSERT INTO Patients (patient_first_name, patient_last_name, insurance_plan_id) VALUES (:fname_input, :lname_input, plan_input);

-- Create a new invoice

INSERT INTO Invoices (due_date, amount_due, service_date, services_billed, paid_amount, paid_date, doctor_id, patient_id)
VALUES (:ddate_input, :amount_input, :sdate_input, :services_input, :paid_input, :pdate_input, :doctor_input, :patient_input)

-- Create a new doctor

INSERT INTO Doctors (doctor_name, doctor_address) VALUES (:docname_input, :docaddress_input);

-- Create a new insurance plan

INSERT INTO InsurancePlans (plan_name, number_of_patients, bill_frequency) VALUES (:planname_input, 0, :frequency_input);

-- Associate a patient with a doctor (M:M addition)

INSERT INTO Patients_Doctors (patient_id, doctor_id) VALUES (:patient_id_input, doc_id_input);

-- Read names of patients covered under a given insurance plan

SELECT patient_first_name AS first_name, patient_last_name AS last_name FROM Patients WHERE insurance_plan_id = :plan_id_input;

-- Read invoices pertinent to any given patient

SELECT * FROM Invoices WHERE Invoices.patient_id = :patient_id_input;

-- Read invoices issued by any given doctor

SELECT * FROM Invoices WHERE Invoices.doctor_id = :doc_id_input;

-- Read outstanding invoices

SELECT * FROM Invoices WHERE Invoices.paid_amount < Invoices.amount_due;

-- Read all patients with their current associated doctors

SELECT patient_id, doctor_id, CONCAT(patient_first_name,' ', patient_last_name) AS name, doctor_name AS doctors
FROM Patients
INNER JOIN Patients_Doctors ON Patients.patient_id = Patients_Doctors.patient_id 
INNER JOIN Doctors on Doctors.doctor_id = Patients_Doctors.doctor_id
ORDER BY name, doctors;

-- Update patient name

UPDATE Patients SET patient_first_name = :fname_input, patient_last_name = :lname_input WHERE patient_id = :patient_id_number_from_update_form;

-- Update patient's insurance plan

UPDATE InsurancePlans SET number_of_patients =
((SELECT number_of_patients FROM InsurancePlans WHERE insurance_plan_id =
(SELECT insurance_plan_id FROM Patients WHERE InsurancePlans.insurance_plan_id = Patients.insurance_plan_id)) - 1);

UPDATE Patients SET insurance_plan_id = :plan_input;

UPDATE InsurancePlans SET number_of_patients = ((SELECT number_of_patients FROM InsurancePlans WHERE insurance_plan_id = :plan_input) + 1);

-- Update doctor information

UPDATE Doctors SET doctor_name = :docname_input, doctor_address = docaddress_input WHERE doctor_id = :doc_id_number_from_update_form;

-- Delete a patient

DELETE FROM Patients WHERE patient_id = :patient_selected_to_be_deleted;

-- Delete a doctor

DELETE FROM Doctors WHERE doctor_id = :doctor_selected_to_be_deleted;

-- Delete insurance plan

DELETE FROM InsurancePlans WHERE insurance_plan_id = :plan_selected_to_be_deleted;

-- Delete an invoice

DELETE FROM Invoices WHERE invoice_id = :invoice_selected_to_be_deleted;

-- Disassociate a patient with a doctor (M:M deletion)

DELETE FROM Patients_Doctors WHERE patient_id = :patient_id_input AND doctor_id = :doctor_id_input;
