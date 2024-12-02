import { doc, getDoc, getDocs, setDoc, updateDoc, collection, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase_setup";
import { giftCertificateCreateParams, giftCertificateDataParams, giftCertificateUpdateParams } from "../../helpers/interfaces";
import { User } from "./user";


// Create a class gift certificate that allows for all restful operations
export class GiftCertificate {

  // Validates the gift certificate parameters on creation
  private static async validateOnCreation(params: giftCertificateCreateParams) {
    if (!params.amount || params.amount <= 0) {
      throw new Error("Gift certificate amount must be present and greater than 0");
    } else if (!params.dateCreated || params.dateCreated > new Date()) {
      throw new Error("Gift certificate creation date must be present and not in the future");
    }
    const agencyRef = doc(db, 'agencies', params.agencyId);
    const agencySnapshot = await getDoc(agencyRef);
    if (!agencySnapshot.exists()) {
      throw new Error("Agency not found");
    } else if (!agencySnapshot.data().active){
      throw new Error("Cannot add gift certificate to an agency that is not active");
    }
    return true;
  }

  // Validates the gift certificate parameters on update
  private static async validateOnUpdate(params: giftCertificateUpdateParams, data: any) {
    if (!params.dateCreated || params.dateCreated > new Date()) {
      throw new Error("Gift certificate creation date must be present and not in the future");
    } else if (params.dateRedeemed && params.dateRedeemed > new Date()) {
      throw new Error("Gift certificate redemption date must not be in the future");
    } else if (params.amountToRedeem && (data.amount * (100 - data.percentageRedeemed) / 100) < params.amountToRedeem
      || params.amountToRedeem < 0) {
      throw new Error("Amount to be redeemed cannot be smaller than 0 or greater than the remaining balance");
    } else if (params.discount >= 100 || params.discount < 0) {
      throw new Error("Discount percentage must be a non-negative percentage smaller than 100");
    }
    const agencyRef = doc(db, 'agencies', params.agencyId);
    const agencySnapshot = await getDoc(agencyRef);
    if (!agencySnapshot.exists()) {
      throw new Error("Agency not found");
    }
    return true;
  }

  // Create a new gift certificate
  static async create(params: giftCertificateCreateParams) {
    try {
      await GiftCertificate.validateOnCreation(params);

      const docRef = await addDoc(
        collection(db, 'gift_certificates'),
        {
          amount: params.amount,
          agency: doc(db, 'agencies', params.agencyId),
          dateCreated: params.dateCreated,
          percentageRedeemed: 0,
          clothingValueRedeemed: 0,
          description: "",
        }
      );
      return await getDoc(docRef);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get a single gift certificate by ID
  static async getById(id: string) {
    try {
      const docRef = doc(db, 'gift_certificates', id);
      const giftCertificateSnapshot = await getDoc(docRef);
      if (giftCertificateSnapshot.exists()) {
        return giftCertificateSnapshot.data();
      } else {
        throw new Error("Gift certificate not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get all gift certificates
  static async getAll() {
    try {
      return await getDocs(
        query(collection(db, 'gift_certificates'),
        orderBy('dateCreated', 'desc')
      ));
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Update a gift certificate by ID
  static async update(params: giftCertificateUpdateParams) {
    try {
      const updateRef = doc(db, 'gift_certificates', params.id);
      const giftCertificateSnapshot = await getDoc(updateRef);
      if (!giftCertificateSnapshot.exists()) {
        throw new Error("Gift certificate not found");
      }
      const data = giftCertificateSnapshot.data();
      await GiftCertificate.validateOnUpdate(params, data);
      const updateData: giftCertificateDataParams = {
        agency: doc(db, 'agencies', params.agencyId),
        amount: data.amount,
        dateCreated: params.dateCreated,
        dateRedeemed: params.dateRedeemed ? params.dateRedeemed : (data.dateRedeemed || null),
        percentageRedeemed: data.percentageRedeemed + params.amountToRedeem / data.amount * 100,
        clothingValueRedeemed: data.clothingValueRedeemed + params.amountToRedeem * 100 / (100 - params.discount),
        description: params.description,
      }
      await updateDoc(updateRef, { ...updateData });
      return (await getDoc(updateRef)).data();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
