import { Request, Response } from 'express';
import { User } from '../models/user';


export const signOutUser = async (req: Request, res: Response) => {
    try {
        const { jwtToken } = req.body;
        await User.signOut(jwtToken)
    } catch (error: any) {
        res.status(500).json({
            message: "Error signing out :("
        })
    }
}

export const signInUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { jwtToken } = await User.signIn({ email, password });
        res.status(201).json({
            message: "User successfully authenticated",
            token: jwtToken
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Error signing in user",
            error: error.message
        });
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { jwtToken } = req.body;
        User.verifyJWTToken(jwtToken);
    } catch (error: any) {
        res.status(500).json({message: "Unauthorized Access", users: {}, jwtAuthError: true })
        return;
    }
    try {
        
        const users = await User.getAll();
        res.status(201).json({
            message: "Users fetched succesfully",
            users: users,
            jwtAuthError: false
        })
    } catch (error: any) {
        res.status(500).json({
            message: `Error fetching users ${error.message}`,
            users: {},
            jwtAuthError: false
        })
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const { jwtToken } = req.body;
        User.verifyJWTToken(jwtToken);
    } catch(error: any) {
        res.status(500).json({message: "Unauthorized Access", user: {}, jwtAuthError: true })
        return;
    }
    try {
        const id = req.params.id;
        const user = await User.getUserByID(id);
        res.status(201).json({
            message: "User fetched succesfully",
            user: user,
            jwtAuthError: false

        })
    } catch (error: any) {
        console.error(`Error fetching user`)
        res.status(500).json({
            message: `Error getting user ${error.message}`,
            user: {},
            jwtAuthError: false
        })
    }
}

export const addUser = async (req: Request, res: Response) => {
    const { firstName, lastName, phone, email, role, jwtToken } = req.body;
    try {
        User.verifyJWTToken(jwtToken)
    } catch (error: any) {
        res.status(500).json({message: "Unauthorized Access", users: {}, jwtAuthError: true })
        return;
    }
    try {
        const userID: string = await User.addUser(firstName, lastName, phone, email, role);
        res.status(201).json({ 
            message: "User successfully added",
            userID: userID
        });
    } catch (error: any) {
        res.status(500).json({ 
            message: "Error adding user",
            error: error.message 
        });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    
    try {
        const jwtToken = req.body.jwtToken;
        User.verifyJWTToken(jwtToken);
    } catch(error: any) {
        res.status(500).json({message: "Unauthorized Access", users: {}, jwtAuthError: true })
        return;
    }

    console.log("HITHITHITH")

    try {
        const params = req.body;
        params.id = req.params.id;
        await User.update(params);
        res.status(200).json({ message: "User succesfully updated" });
    } catch(error: any) {
        res.status(500).json({
            message: "Error updating user",
            error: error.message
        })
    }
}