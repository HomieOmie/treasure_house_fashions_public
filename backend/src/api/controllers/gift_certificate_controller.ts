import { Request, Response } from 'express';
import { GiftCertificate } from '../models/gift_certificate';
import GiftCertificateSerializer from '../utils/certificate_serializer';
import Agency from '../models/agency';  
import { DocumentData } from 'firebase/firestore';
import { User } from '../models/user';

// Get all gift certificates
// TODO: modularize middleware into the serializer
export const getAllGiftCertificates = async (req: Request, res: Response) => {
  try {
    const { jwtToken } = req.body;
    User.verifyJWTToken(jwtToken);
  } catch (error: any) {
    res.status(500).json({message: "Unauthorized Access", data: {}, jwtAuthError: true })
    return;
  }
  try {
    const giftCertificates = await GiftCertificate.getAll();
    const agencies = (await Agency.getAll()).docs;
    const data: unknown[] = [];
    giftCertificates.forEach((doc: any) => {
      const fields = doc.data();
      fields['id'] = doc.id;
      fields['dateCreated'] = fields.dateCreated.toDate().toISOString().split('T')[0]; // Format date: YYYY-MM-DD
      if (fields.dateRedeemed) {
        fields['dateRedeemed'] = fields.dateRedeemed.toDate().toISOString().split('T')[0]; // Format date: YYYY-MM-DD
      }
      const agencyId = fields.agency.id;
      const agency = agencies.find((agency: any) => agency.id === agencyId);
      if (!agency) {
        throw new Error(`Agency not found for id: ${agencyId}`);
      }
      fields['agency'] = { id: agencyId, name: agency.data().name };
      data.push(fields);
    });

    res.status(201).json({message: "Succesful Fetch", data: data, jwtAuthError: false })
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: {}, jwtAuthError: false });
    return;
  }
};

// Get a single gift certificate by ID
/**
 * TODO: Firebase can automatically generate IDs for gift certificates, so
 * we might reconsider using uuid to generate IDs for gift certificates.
 */
export const getGiftCertificateById = async (req: Request, res: Response) => {
  try {
    const { jwtToken } = req.body;
    User.verifyJWTToken(jwtToken)
  } catch (error: any) {
    res.status(500).json({message: "Unauthorized Access", data: {}, jwtAuthError: true })
    return;
  }
  try {
    const giftCertificate = await GiftCertificate.getById(req.params.id);
    if (giftCertificate) {
      const fields = giftCertificate;
      fields['id'] = giftCertificate.id;
      fields['dateCreated'] = fields.dateCreated.toDate().toISOString().split('T')[0]; // Format date: YYYY-MM-DD
      if (fields.dateRedeemed) {
        fields['dateRedeemed'] = fields.dateRedeemed.toDate().toISOString().split('T')[0]; // Format date: YYYY-MM-DD
      }
      const agencyId = fields.agency.id;
      const agency = await Agency.getById(agencyId);
      if (!agency) {
        throw new Error(`Agency not found for id: ${agencyId}`);
      } else {
        fields['agency'] = { id: agencyId, name: agency.name };
      }
      res.status(201).json({message: "Gift Certificate Found", data: fields, jwtAuthError: false});
    } else {
      res.status(404).json({ message: 'Gift certificate not found', data: {}, jwtAuthError: false });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: {}, jwtAuthError: false });
  }
};

// Create a new gift certificate
export const createGiftCertificate = async (req: Request, res: Response) => {
  const { amount, dateCreated, agencyId, jwtToken } = req.body;
  try {
    User.verifyJWTToken(jwtToken)
  } catch (error: any) {
    res.status(500).json({message: "Unauthorized Access", data: {}, jwtAuthError: true })
    return;
  }

  try {
    const newGiftCertificate = await GiftCertificate.create({
      amount,
      dateCreated: new Date(dateCreated),
      agencyId,
    });
    const fields = newGiftCertificate.data() as DocumentData;
    fields['id'] = newGiftCertificate.id;
    fields['dateCreated'] = fields.dateCreated.toDate().toISOString().split('T')[0]; // Format date: YYYY-MM-DD
    const aid = fields.agency.id;
    const agency = await Agency.getById(aid);
    fields['agency'] = { id: aid, name: agency.name };
    const data = fields 
    res.status(201).json({message: "Gift Certificate(s) Succesfully Created", data: data, jwtAuthError: false })
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: {}, jwtAuthError: false });
    return;
  }
};

// Update a gift certificate by ID
export const updateGiftCertificate = async (req: Request, res: Response) => {
  try {
    const jwtToken = req.body.jwtToken;
    User.verifyJWTToken(jwtToken)
  } catch (error: any) {
    res.status(500).json({message: "Unauthorized Access", data: {}, jwtAuthError: true })
    return;
  }
  try {
    
    const updatedGiftCertificate = await GiftCertificate.update(
      {
        id: req.params.id,
        amountToRedeem: req.body.amountToRedeem,
        dateCreated: new Date(req.body.dateCreated),
        dateRedeemed: req.body.dateRedeemed ? new Date(req.body.dateRedeemed) : null,
        agencyId: req.body.agencyId,
        discount: req.body.discount,
        description: req.body.description,
      },
    );
    if (updatedGiftCertificate) {
      res.status(200).json({ message: 'Gift certificate updated', data: {}, jwtAuthError: false });
      return
    } else {
      res.status(404).json({ message: 'Gift certificate not found', data: {}, jwtAuthError: false });
      return
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: {}, jwtAuthError: false });
    return;
  }
};
