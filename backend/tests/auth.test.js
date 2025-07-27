const request = require('supertest');
const app = require('../src/app');

describe('POST /login', () => {
  it('should return 200 and token for valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'user@example.com',
        password: 'Password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: 'test-token-123'
    });
  });

  it('should return 401 for invalid password', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'user@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Invalid credentials'
    });
  });

  it('should return 401 for invalid email', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'wrong@example.com',
        password: 'Password123'
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Invalid credentials'
    });
  });

  it('should return 401 for missing credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({});

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Invalid credentials'
    });
  });
});
