-- Group 59
-- Corianne Frankovitch
-- Cody Jennette
-- DDL.sql (Step 3 version)

-- MySQL Workbench Forward Engineering

SET foreign_key_checks = 0;
SET AUTOCOMMIT = 0;

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
  PRIMARY KEY (`patient_id`, `insurance_plan_id`),
  INDEX `fk_Patients_InsurancePlans1_idx` (`insurance_plan_id` ASC) VISIBLE,
  UNIQUE INDEX `patient_id_UNIQUE` (`patient_id` ASC) VISIBLE,
  CONSTRAINT `fk_Patients_InsurancePlans1`
    FOREIGN KEY (`insurance_plan_id`)
    REFERENCES `InsurancePlans` (`insurance_plan_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
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
  `due_date` DATE NOT NULL,
  `amount_due` DECIMAL(19,2) NOT NULL,
  `service_date` DATE NOT NULL,
  `services_billed` TEXT(1000) NOT NULL,
  `paid_amount` DECIMAL(19,2) NULL,
  `paid_date` DATE NULL,
  `doctor_id` INT NOT NULL,
  `patient_id` INT NOT NULL,
  PRIMARY KEY (`invoice_id`, `doctor_id`, `patient_id`),
  INDEX `fk_Invoices_Doctors1_idx` (`doctor_id` ASC) VISIBLE,
  INDEX `fk_Invoices_Patients1_idx` (`patient_id` ASC) VISIBLE,
  CONSTRAINT `fk_Invoices_Doctors1`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `Doctors` (`doctor_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Invoices_Patients1`
    FOREIGN KEY (`patient_id`)
    REFERENCES `Patients` (`patient_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Patients_Doctors`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Patients_Doctors` (
  `patient_doctor_id` INT NOT NULL AUTO_INCREMENT,
  `patient_id` INT NULL,
  `doctor_id` INT NOT NULL,
  PRIMARY KEY (`patient_doctor_id`),
  INDEX `fk_Patients_has_Doctors_Doctors1_idx` (`doctor_id` ASC) VISIBLE,
  INDEX `fk_Patients_has_Doctors_Patients1_idx` (`patient_doctor_id` ASC, `patient_id` ASC) VISIBLE,
  CONSTRAINT `fk_Patients_has_Doctors_Patients1`
    FOREIGN KEY (`patient_doctor_id`)
    REFERENCES `Patients` (`patient_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Patients_has_Doctors_Doctors1`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `Doctors` (`doctor_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT INTO `InsurancePlans` (`plan_name`,`number_of_patients`,`bill_frequency`) VALUES
    ('Diamond', 5, 'weekly'),('Elite', 5, 'monthly'), ('Coded Elite', 4, 'biweekly'),('Basic', 3, 'weekly');

INSERT INTO `Patients` (`patient_first_name`,`patient_last_name`,`insurance_plan_id`) VALUES
    ('Ron','Swanson', (SELECT insurance_plan_id from `InsurancePlans` WHERE plan_name='Diamond')), ('Leslie','Knope', (SELECT insurance_plan_id from `InsurancePlans` WHERE plan_name='Diamond')),
    ('April','Ludgate', (SELECT insurance_plan_id from `InsurancePlans` WHERE plan_name='Diamond')), ('Ben','Wyatt', (SELECT insurance_plan_id from `InsurancePlans` WHERE plan_name='Diamond')), ('Andy','Dwyer', (SELECT insurance_plan_id from `InsurancePlans` WHERE plan_name='Diamond'));

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

INSERT INTO `Invoices` (`due_date`,`amount_due`,`service_date`,`services_billed`,`paid_amount`,`paid_date`,`doctor_id`,`patient_id`)
VALUES
('2022-11-12', '4.00', '2022-10-20', 'left when appointment was not free', NULL, NULL, 1, 1),
('2022-11-12', '100.00', '2022-10-20', 'anxiety', '100', '2022-10-20', 2, 2),
('2022-11-19', '50.00', '2022-10-19', 'animal bite', NULL, NULL, 3, 3),
('2022-11-12', '100.00', '2022-10-20', 'physical', NULL, NULL, 4, 4),
('2022-11-12', '250.00', '2022-10-18', 'broken arm-casted', NULL, NULL, 5, 5);

INSERT INTO `Patients_Doctors` (`patient_id`,`doctor_id`)
VALUES (3, 3), (1, 1), (4, 4), (5, 5), (2, 2);

SET foreign_key_checks = 1;
COMMIT;
