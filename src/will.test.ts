import request from 'supertest';
import app from './server'; 
import mongoose from 'mongoose';
import Will from './Models/willModel';
import { beforeAll, afterAll, test, expect } from '@jest/globals';  
import { describe } from 'node:test';

describe('Will Activity Confirmation', () => {
  beforeAll(async () => {
 
    const mongodb = process.env.MONGO_URI || 'mongodb+srv://agbakwuruoluchi:SF4nv3OCBQmexwO9@cluster0.rt46t.mongodb.net';
    await mongoose.connect(mongodb);  
    console.log('Connected to MongoDB');
  });

  afterAll(async () => {
  
    await mongoose.connection.close();
  });

  test('should confirm user activity successfully', async () => {
   
    const will = new Will({
      userId: '673956f7b47f844fe2213414',
      email: 'oluchicharity10@gmail.com',
      status: 'active',
      creationDate: new Date(),
      lastConfirmed: null,
    });
    await will.save();

    const response = await request(app).post(`/will/confirm/${will.userId}`);

  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Your activity has been confirmed.');

    const updatedWill = await Will.findOne({ userId: '673956f7b47f844fe2213414' });
    expect(updatedWill).not.toBeNull();
    if (updatedWill) { 
        expect(updatedWill.lastConfirmed).not.toBeNull();
    }
  });

  test('should return 404 if will not found', async () => {
    const response = await request(app).post('/will/confirm/invalidUserId');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Will not found for this user');
  });

  test('should handle errors gracefully', async () => {
    const response = await request(app).post('/will/confirm/');
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('An error occurred while confirming your activity.');
  });
});
