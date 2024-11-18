import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import userModel from '../Models/userModel';
import { sendEmail } from '../Emails/email'
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { Fullname, Email, Password } = req.body;

        if (!Fullname || !Email || !Password) {
            return res.status(400).json({ error: 'Fullname, Email, and Password are required for registration' });
        }

        const existingUser = await userModel.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ error: 'This email already exists' });
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(Password, salt);
        const newUser = new userModel({
            Fullname,
            Email,
            Password: hashedPassword
        });
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error creating user:', (error as Error).message);
        return res.status(500).json({ error: (error as Error).message });
    }
};

export const Login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({ error: 'Email and Password are required' });
        }

        const user = await userModel.findOne({ Email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(Password, user.Password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { userId: user._id, Email: user.Email },
            process.env.SECRET as string,
            { expiresIn: '5d' }
        );

        await sendEmail({
            email: user.Email,
            subject: 'Successful Login',
            html: '<p>hello, welcome back </p>',
        });
         console.log(sendEmail)
        return res.json({
            message: 'Welcome',
            user: { Email: user.Email, Fullname: user.Fullname },
            token
        });
    } catch (error) {
        console.error('Error during login:', error as Error);
        return res.status(500).json({ error: (error as Error).message });
    }
};