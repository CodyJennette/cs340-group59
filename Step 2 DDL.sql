-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Schema cs340_jennettc
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema cs340_jennettc
-- -----------------------------------------------------
-- CREATE SCHEMA IF NOT EXISTS `cs340_jennettc` DEFAULT CHARACTER SET utf8 ;
-- USE `cs340_jennettc` ;

-- -----------------------------------------------------
-- Table `InsurancePlans`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `InsurancePlans` (
  `insurance_plan_id` INT NOT NULL AUTO_INCREMENT,
  `plan_name` VARCHAR(255) NULL,
  `number_of_patients` INT NOT NULL,
  `bill_frequency` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`insurance_plan_id`),
  UNIQUE INDEX `insurance_plan_id_UNIQUE` (`insurance_plan_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Patients`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Patients` (
  `patient_id` INT NOT NULL AUTO_INCREMENT,
  `patient_first_name` VARCHAR(255) NOT NULL,
  `patient_last_name` VARCHAR(255) NOT NULL,
  `insurance_plan_id` INT NOT NULL,
  `doctor_name` VARCHAR(255) NOT NULL,
  `InsurancePlans_insurance_plan_id` INT NOT NULL,
  PRIMARY KEY (`patient_id`, `InsurancePlans_insurance_plan_id`),
  UNIQUE INDEX `patient_id_UNIQUE` (`patient_id` ASC) VISIBLE,
  INDEX `fk_Patients_InsurancePlans_idx` (`InsurancePlans_insurance_plan_id` ASC) VISIBLE,
  CONSTRAINT `fk_Patients_InsurancePlans`
    FOREIGN KEY (`InsurancePlans_insurance_plan_id`)
    REFERENCES `InsurancePlans` (`insurance_plan_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `InvoiceDetails`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `InvoiceDetails` (
  `invoice_details_id` INT NOT NULL AUTO_INCREMENT,
  `doctor_name` VARCHAR(255) NOT NULL,
  `due_date` DATE NOT NULL,
  `amount_due` DECIMAL(19,2) NOT NULL,
  `patient_full_name` VARCHAR(255) NOT NULL,
  `service_date` DATE NOT NULL,
  `services_billed` TEXT(1000) NULL,
  `paid_amount` DECIMAL(19,2) NULL,
  `paid_date` DATE NULL,
  PRIMARY KEY (`invoice_details_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Doctors`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Doctors` (
  `doctor_id` INT NOT NULL AUTO_INCREMENT,
  `doctor_name` VARCHAR(255) NOT NULL,
  `doctor_address` VARCHAR(255) NULL,
  PRIMARY KEY (`doctor_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Invoices`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Invoices` (
  `invoice_id` INT NOT NULL AUTO_INCREMENT,
  `insurance_plan_id` INT NOT NULL,
  `doctor_id` INT NOT NULL,
  `invoice_details_id` INT NOT NULL,
  `InsurancePlans_insurance_plan_id` INT NOT NULL,
  `InvoiceDetails_invoice_details_id` INT NOT NULL,
  `Doctors_doctor_id` INT NOT NULL,
  PRIMARY KEY (`invoice_id`, `InsurancePlans_insurance_plan_id`, `InvoiceDetails_invoice_details_id`, `Doctors_doctor_id`),
  INDEX `fk_Invoices_InsurancePlans1_idx` (`InsurancePlans_insurance_plan_id` ASC) VISIBLE,
  INDEX `fk_Invoices_InvoiceDetails1_idx` (`InvoiceDetails_invoice_details_id` ASC) VISIBLE,
  INDEX `fk_Invoices_Doctors1_idx` (`Doctors_doctor_id` ASC) VISIBLE,
  CONSTRAINT `fk_Invoices_InsurancePlans1`
    FOREIGN KEY (`InsurancePlans_insurance_plan_id`)
    REFERENCES `InsurancePlans` (`insurance_plan_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Invoices_InvoiceDetails1`
    FOREIGN KEY (`InvoiceDetails_invoice_details_id`)
    REFERENCES `InvoiceDetails` (`invoice_details_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Invoices_Doctors1`
    FOREIGN KEY (`Doctors_doctor_id`)
    REFERENCES `Doctors` (`doctor_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Patients_Doctors`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Patients_Doctors` (
  `patient_doctor_id` INT NOT NULL AUTO_INCREMENT,
  `patient_id` INT NOT NULL,
  `doctor_id` INT NOT NULL,
  PRIMARY KEY (`patient_doctor_id`),
  INDEX `fk_Patients_has_Doctors_Doctors1_idx` (`doctor_id` ASC) VISIBLE,
  INDEX `fk_Patients_has_Doctors_Patients1_idx` (`patient_doctor_id` ASC, `patient_id` ASC) VISIBLE,
  CONSTRAINT `fk_Patients_has_Doctors_Patients1`
    FOREIGN KEY (`patient_doctor_id` , `patient_id`)
    REFERENCES `Patients` (`patient_id` , `InsurancePlans_insurance_plan_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Patients_has_Doctors_Doctors1`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `Doctors` (`doctor_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;

INSERT INTO `InsurancePlans` (`plan_name`,`number_of_patients`,`bill_frequency`) VALUES
    ('Diamond', 5, 'weekly'),('Elite', 5, 'monthly'), ('Coded Elite', 4, 'biweekly'),('Basic', 3, 'weekly');

INSERT INTO `Patients` (`patient_first_name`,`patient_last_name`,`doctor_name`, `insurance_plan_id`) VALUES
    ('Ron','Swanson', 'Dr. Bishop', (SELECT insurance_plan_id from `InsurancePlans` WHERE plan_name='Diamond')), ('Leslie','Knope', 'Dr. Day', (SELECT insurance_plan_id from `InsurancePlans` WHERE plan_name='Diamond')),
    ('April','Ludgate', 'Dr. Schmidt', (SELECT insurance_plan_id from `InsurancePlans` WHERE plan_name='Diamond')), ('Ben','Wyatt', 'Dr. Parekh', (SELECT insurance_plan_id from `InsurancePlans` WHERE plan_name='Diamond')), ('Andy','Dwyer', 'Dr. Miller', (SELECT insurance_plan_id from `InsurancePlans` WHERE plan_name='Diamond'));

INSERT INTO `Doctors` (`doctor_name`,`doctor_address`)
VALUES ('Winston Bishop', '1020 The Loft Lane, Los Angeles CA'),
('Jessica Day', '1020 The Loft Lane, Los Angeles CA'),
('Winston Schmidt', '1020 The Loft Lane, Los Angeles CA'),
('Cece Parekh', '1022 The Loft Lane, Los Angeles CA'),
('Nick Miller','1022 The Loft Lane, Los Angeles CA'),
('Eleanor Shellstrop','102 Basic Lane, Phoenix, AZ'),
('Jason Mendoza','21 Box Road, Jacksonville, FL'),
('Good Janet','1 Good Place Ave, Orlando, FL'),
('Chidi Anagonye','133 Sophocles St, Pittsburgh, PA');

INSERT INTO `InvoiceDetails`(`doctor_name`,`due_date`,`amount_due`,`patient_full_name`,`service_date`,`services_billed`,`paid_amount`,`paid_date`)
VALUES
('Bishop', '2022-11-12', '4.00', 'Ron Swanson', '2022-10-20', 'left when appointment was not free', NULL, NULL),
('Day', '2022-11-12', '100', 'Leslie Knope', '2022-10-20', 'anxiety', '100', '2022-10-20'),
('Schmidt','2022-11-19', '50.00', 'April Ludgate', '2022-10-19', 'animal bite', NULL, NULL),
('Parekh', '2022-11-19', '100', 'Ben Wyatt', '2022-10-20','physical',NULL,NULL),
('Miller', '2022-11-12', '250.04', 'Andy Dwyer', '2022-10-18', 'broken arm',NULL,NULL);

INSERT INTO `Invoices` (`insurance_plan_id`,`doctor_id`,`invoice_details_id`)
VALUES((SELECT insurance_plan_id FROM Patients WHERE patient_id='1'),(SELECT doctor_id FROM Doctors WHERE doctor_id=1),(SELECT invoice_details_id FROM InvoiceDetails WHERE invoice_details_id='1')),
((SELECT insurance_plan_id FROM Patients WHERE patient_id='2'),(SELECT doctor_id FROM Doctors WHERE doctor_id=2),(SELECT invoice_details_id FROM InvoiceDetails WHERE invoice_details_id='2')),
((SELECT insurance_plan_id FROM Patients WHERE patient_id='3'),(SELECT doctor_id FROM Doctors WHERE doctor_id=3),(SELECT invoice_details_id FROM InvoiceDetails WHERE invoice_details_id='3')),
((SELECT insurance_plan_id FROM Patients WHERE patient_id='4'),(SELECT doctor_id FROM Doctors WHERE doctor_id=4),(SELECT invoice_details_id FROM InvoiceDetails WHERE invoice_details_id='4')),
((SELECT insurance_plan_id FROM Patients WHERE patient_id='5'),(SELECT doctor_id FROM Doctors WHERE doctor_id=5),(SELECT invoice_details_id FROM InvoiceDetails WHERE invoice_details_id='5'));

INSERT INTO `Patients_Doctors` (`patient_id`,`doctor_id`)
VALUES((SELECT patient_id FROM Patients WHERE Doctors.doctor_id=))

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

COMMIT;
