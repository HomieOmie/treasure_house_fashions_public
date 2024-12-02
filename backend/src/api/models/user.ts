import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, updateEmail, getAuth, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth, jwtSecret } from "../..";
import { userParams, UserSignInParams, userUpdateParams } from "../../helpers/interfaces";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase_setup";
import jwt from 'jsonwebtoken';


interface UserSessions {
    [token: string]: number;
}

export class User {
    static userSessions: UserSessions = {};

    static cacheUserSession(jwtToken: string, validUntil: any) {
        this.userSessions[jwtToken] = validUntil;
    }

    static uncacheUserSession(jwtToken: string) {
        if (this.userSessions[jwtToken]) {
            delete this.userSessions[jwtToken];
        }
    }

    static isUserCachedAndValid(jwtToken: string) {
        const validUntil = this.userSessions[jwtToken];
        return validUntil && validUntil > Date.now();
    }
    static async signIn(params: UserSignInParams): Promise<any> {
        try {
            const { email, password } = params;
            const { uid, userRole } = await this.firebaseSignIn(email, password);
            const jwtToken = this.createToken(uid, String(userRole))
            const validUntil = Date.now() + (30 * 60 * 1000); // 30 minutes from now
            this.cacheUserSession(jwtToken, validUntil);
            return { jwtToken } ;
        } catch (error: any) {
            throw new Error(`Error signing in user: ${error.message}`);
        }
    }

    static async signOut(jwtToken: string) {
        try {
            this.uncacheUserSession(jwtToken)
            console.log("Signed Out");
        } catch(error: any) {
            throw new Error(`Error signing out user: ${error.message}`);
        }
    }

    static async getAll() {
        try {
            const userCollection = collection(db, "users");
            const userDocs = await getDocs(userCollection);
            const users: userParams[] = []

            userDocs.forEach((doc) => {
                const userID = doc.id;
                const userData = doc.data();
                const { email: email, firstName: firstName, lastName: lastName, phone: phone, role: role, status: status } = userData; // Adjust this based on your actual data structure
                users.push({
                    id: userID,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    role: role,
                    phoneNumber: phone,
                    status: status
                });
            });
            return users;
        } catch (error: any) {
            throw new Error(`Error fetching all users: ${error.message}`)
        }
    }

    static async getUserByID(id: string) {
        try {
            const docRef = doc(db, 'users', id);
            const userSnapshot = await getDoc(docRef);
            if (userSnapshot.exists()) {
                const userInfo = userSnapshot.data()
                const userEmail = userInfo.email;
                const userFirstName = userInfo.firstName;
                const userLastName = userInfo.lastName;
                const userRole = userInfo.role;
                const userPhone = userInfo.phone;
                const userID = userSnapshot.id;
                const userStatus = userInfo.status;
                return {
                    id: userID, 
                    firstName: userFirstName, 
                    lastName: userLastName,
                    email: userEmail,
                    role: userRole,
                    phone: userPhone,
                    status: userStatus
                };
            } else {
                throw new Error("User not found");
            } 
        } catch (error: any) {
            throw new Error(`Error getting user: ${error.message}`)
        }
    }

    //TODO: Add validations for fields
    static async addUser(firstName: string, lastName: string, phone: string, email: string, role: number): Promise<string> {
        try {
            const auth = getAuth()
            const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, "Password");
            const userID: string = userCredential.user.uid;
            const userData = {
                firstName: firstName,
                lastName: lastName,
                phone: this.removeNonDigitsFromPhone(phone),
                email: email,
                role: role,
                status: true
            };
            await sendEmailVerification(userCredential.user);
            await sendPasswordResetEmail(auth, email);
            await setDoc(doc(db, 'users', userID), userData);
            return userID;
        } catch (error: any) {
            throw new Error(`Error adding user: ${error.message}`);
        }
    }

    static update = async (user: userUpdateParams & { [x: string]: any }) => {
        try {
            if (!user.id) {
                throw new Error('User ID is missing');
            }
            const userDocRef = doc(db, 'users', user.id);
            const userToUpdate = {
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                status: user.status
            };
            await updateDoc(userDocRef, userToUpdate);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private static async firebaseSignIn(email: string, password: string): Promise<{ uid: string; userRole: string }> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userRole = userDoc.data().role;
                return { uid: user.uid, userRole: userRole };
            } else {
                throw new Error("User not found");
            }
        } catch (error: any) {
            throw new Error(`Error authenticating with Firebase: ${error.message}`);
        }
    }

    private static convertRole(role: string): number {
        switch (role) {
            case "admin":
                return 1;
            case "user":
            default:
                return 0;
        }
    }
    
    private static removeNonDigitsFromPhone(phone: string): string {
        return phone.replace(/\D/g, "");
    }

    private static createToken(uid: string,  userRole: string) {
        return jwt.sign({id: uid, role: userRole}, jwtSecret, { expiresIn: '1h'})
    }

    static verifyJWTToken(JWTToken: string) {
        try {
            jwt.verify(JWTToken, jwtSecret)
        } catch (error: any) {
            throw new Error(`Token is not verified: ${error}`)
        }
    }
}