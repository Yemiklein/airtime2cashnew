import 'dotenv/config';
import app from '../app';
import supertest from 'supertest';
import { userInstance } from '../model/userModel';
import db from '../config/database.config';
import bcrypt from 'bcryptjs';
import { response } from 'express';

const request = supertest(app);

beforeAll(async () => {
  await db
    .sync({ force: true })
    .then(() => {
      console.log('database connected successfully');
    })
    .catch((err) => {
      console.log(err);
    });
});

describe('user test', () => {
  it('create user successfully', async () => {
    const response = await request.post('/user/register').send({
      firstName: 'POD',
      lastName: 'F',
      userName: 'podf',
      email: 'podf@example.com',
      phoneNumber: '08123456789',
      password: 'abcd',
      confirmPassword: 'abcd',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Successfully created a user');
    expect(response.body).toHaveProperty('record');
  });

  it('login user successfully', async () => {
    const response = await request.post('/user/login').send({
      email: 'podf@example.com',
      password: 'abcd',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Successfully logged in');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user_info');
  });

  it('update user profile', async () => {
    const user = await request.post('/user/login').send({
      email: 'podf@example.com',
      password: 'abcd',
    });

    const response = await request
      .patch(`/user/update/${user.body.id}`)
      .set('authorization', `Bearer ${user.body.token}`)
      .send({
        firstName: 'POD',
        lastName: 'F',
        phoneNumber: '08123456789',
        avatar:
          'https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg',
      });

    expect(response.status).toBe(202);
    expect(response.body.message).toBe('successfully updated user details');
    expect(response.body).toHaveProperty('updatedRecord');
  });

  // it('forgot password', async () => {

  // })
});
