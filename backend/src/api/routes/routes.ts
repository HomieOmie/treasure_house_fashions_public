import express from 'express';
import {
  getAllGiftCertificates,
  getGiftCertificateById,
  createGiftCertificate,
  updateGiftCertificate,
} from '../controllers/gift_certificate_controller';

import {
  getAllAgencies,
  getAgencyById,
  createAgency,
  updateAgency,
} from '../controllers/agency_controller';
import { getReport } from '../controllers/report_controller';
import { addUser, getAllUsers, getUser, signInUser, signOutUser, updateUser } from '../controllers/user_controller';

const router = express.Router();
//TODO: Go through all of these for JWT Auth

/* Authentication/User based routes */

// Verify your sign in credentials
router.post('/signin', signInUser); 

router.post('/signout', signOutUser);

// Add new users to the system
router.post('/addUser', addUser);

// Get all users
router.post('/getAllUsers', getAllUsers);

// Get an individual user
router.post('/users/:id', getUser);

// Update existing user information
router.patch('/users/:id', updateUser);

/* Agencies routes */

// Get all agencies
router.post('/agencies', getAllAgencies);

// Create a new agency
router.post('/newAgency', createAgency);

// Get a specific agency by ID
router.post('/agencies/:id', getAgencyById);

// Update an existing agency
router.put('/agencies/:id', updateAgency);

/* Gift Certificate Routes */

// Get all gift certificates
router.post('/gift_certificates', getAllGiftCertificates);

// Get a specific gift certificate by ID
router.post('/gift_certificates/:id', getGiftCertificateById);

// Create a new gift certificate
router.post('/create_gift_certificates', createGiftCertificate);

// Update an existing gift certificate
router.put('/gift_certificates/:id', updateGiftCertificate);

/* Reports Routes */

// Gets columns needed for reports
router.post("/report", getReport); //TODO: Add JWT Auth

// required params: /:agencies/:startDate/:endDate/:reportType

export default router;
