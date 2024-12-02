import Agency from "../models/agency";
import { Request, Response } from "express";
import AgencySerializer from "../utils/agency_serializer";
import { User } from "../models/user";

export const createAgency = async (req: Request, res: Response) => {
  const { name, phone, email, addressLine1, addressLine2, city, state, zip, jwtToken } = req.body;
  try {
    User.verifyJWTToken(jwtToken);
  } catch (error: any) {
    res.status(500).json({ message: "Unauthorized action", data: {}, jwtAuthError: true } );
    return;
  }
  
  try {
    await Agency.create({
      name: name,
      phone: phone,
      email: email,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      zip: zip,
      active: true
    });
    res.status(201).json({ message: "Agency succesfully created", data: {}, jwtAuthError: false });
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: {}, jwtAuthError: false });
    return;
  }
}

export const getAllAgencies = async (req: Request, res: Response) => {
  try {
    const { jwtToken } = req.body;
    User.verifyJWTToken(jwtToken);
  } catch (error: any) {
    res.status(500).json({message: "Unauthorized Access", data: {}, jwtAuthError: true })
    return;
  }
  try {
    const agencies = await Agency.getAll();
    const data = AgencySerializer.getAgenciesFromData(agencies);
    res.status(200).json({message: "Agency Succesfully Fetched", data: data, jwtAuthError: false});
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: {}, jwtAuthError: false });
    return;
  }
}

// GET /agencies/:id //TODO: This returns the JWT token in the response body; fix it
export const getAgencyById = async (req: Request, res: Response) => {
  try {
    const { jwtToken } = req.body;
    User.verifyJWTToken(jwtToken);
  } catch (error: any) {
    res.status(500).json({message: "Unauthorized Access", data: {}, jwtAuthError: true })
    return;
  }

  try {
    const agency = await Agency.getById(req.params.id);
    if (!agency) {
      res.status(404).json({ message: 'Agency not found', data: {}, jwtAuthError: false });
      return;
    } else {
      res.status(200).json({ message: 'Agency not found', data: agency, jwtAuthError: false });
      return;
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: {}, jwtAuthError: false  });
    return;
  }
};

// PUT /agencies/:id
export const updateAgency = async (req: Request, res: Response) => {
  try {
    const jwtToken = req.body.jwtToken;
    User.verifyJWTToken(jwtToken)
  } catch (error: any) {
    res.status(500).json({message: "Unauthorized Access", data: {}, jwtAuthError: true })
    return;
  }
  try {
    const params = req.body.params;
    params.id = req.params.id;
    await Agency.update(params);
    res.status(200).json({ message: "Agency succesfully updated", data: {}, jwtAuthError: false });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: {}, jwtAuthError: false });
  }
};
