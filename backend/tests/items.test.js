const request = require('supertest');
const app = require('../src/app');
const { resetStore } = require('../src/items');

const VALID_TOKEN = 'test-token-123';
const INVALID_TOKEN = 'invalid-token';

describe('Items API', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('GET /items', () => {
    it('should return 200 and empty array with valid token and empty store', async () => {
      const response = await request(app)
        .get('/items')
        .set('Authorization', `Bearer ${VALID_TOKEN}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/items');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Unauthorized'
      });
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/items')
        .set('Authorization', `Bearer ${INVALID_TOKEN}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Unauthorized'
      });
    });

    it('should return 401 with malformed authorization header', async () => {
      const response = await request(app)
        .get('/items')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Unauthorized'
      });
    });
  });

  describe('POST /items', () => {
    it('should return 201 and created item with valid token and valid body', async () => {
      const itemData = {
        title: 'Test Item',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send(itemData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: 1,
        title: 'Test Item',
        description: 'Test Description'
      });
    });

    it('should return 201 and created item with title only', async () => {
      const itemData = {
        title: 'Test Item'
      };

      const response = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send(itemData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: 1,
        title: 'Test Item',
        description: ''
      });
    });

    it('should return 400 when title is missing', async () => {
      const itemData = {
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send(itemData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Title is required'
      });
    });

    it('should return 400 when title is empty string', async () => {
      const itemData = {
        title: '',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send(itemData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Title is required'
      });
    });

    it('should return 400 when title is only whitespace', async () => {
      const itemData = {
        title: '   ',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send(itemData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Title is required'
      });
    });

    it('should return 401 without token', async () => {
      const itemData = {
        title: 'Test Item',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/items')
        .send(itemData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Unauthorized'
      });
    });

    it('should return 401 with invalid token', async () => {
      const itemData = {
        title: 'Test Item',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${INVALID_TOKEN}`)
        .send(itemData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Unauthorized'
      });
    });
  });

  describe('PUT /items/:id', () => {
    beforeEach(async () => {
      // Create a test item
      await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({
          title: 'Original Title',
          description: 'Original Description'
        });
    });

    it('should return 200 and updated item when updating title and description', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put('/items/1')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        title: 'Updated Title',
        description: 'Updated Description'
      });
    });

    it('should return 200 and updated item when updating title only', async () => {
      const updateData = {
        title: 'Updated Title Only'
      };

      const response = await request(app)
        .put('/items/1')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        title: 'Updated Title Only',
        description: 'Original Description'
      });
    });

    it('should return 200 and updated item when updating description only', async () => {
      const updateData = {
        description: 'Updated Description Only'
      };

      const response = await request(app)
        .put('/items/1')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        title: 'Original Title',
        description: 'Updated Description Only'
      });
    });

    it('should return 404 for non-existent id', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put('/items/999')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Item not found'
      });
    });

    it('should return 400 when title is empty string', async () => {
      const updateData = {
        title: '',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put('/items/1')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Title is required'
      });
    });

    it('should return 400 when title is only whitespace', async () => {
      const updateData = {
        title: '   ',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put('/items/1')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Title is required'
      });
    });

    it('should return 401 without token', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put('/items/1')
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Unauthorized'
      });
    });

    it('should return 401 with invalid token', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put('/items/1')
        .set('Authorization', `Bearer ${INVALID_TOKEN}`)
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Unauthorized'
      });
    });
  });

  describe('DELETE /items/:id', () => {
    beforeEach(async () => {
      // Create a test item
      await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({
          title: 'Item to Delete',
          description: 'This item will be deleted'
        });
    });

    it('should return 204 with no body when deleting existing item', async () => {
      const response = await request(app)
        .delete('/items/1')
        .set('Authorization', `Bearer ${VALID_TOKEN}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      // Verify item is actually deleted
      const getResponse = await request(app)
        .get('/items')
        .set('Authorization', `Bearer ${VALID_TOKEN}`);

      expect(getResponse.body).toEqual([]);
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app)
        .delete('/items/999')
        .set('Authorization', `Bearer ${VALID_TOKEN}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Item not found'
      });
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .delete('/items/1');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Unauthorized'
      });
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .delete('/items/1')
        .set('Authorization', `Bearer ${INVALID_TOKEN}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Unauthorized'
      });
    });
  });

  describe('Integration tests', () => {
    it('should handle complete CRUD flow correctly', async () => {
      // Create item
      const createResponse = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({
          title: 'Integration Test Item',
          description: 'Test Description'
        });

      expect(createResponse.status).toBe(201);
      const itemId = createResponse.body.id;

      // Get items (should contain the created item)
      const getResponse = await request(app)
        .get('/items')
        .set('Authorization', `Bearer ${VALID_TOKEN}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toHaveLength(1);
      expect(getResponse.body[0]).toEqual({
        id: itemId,
        title: 'Integration Test Item',
        description: 'Test Description'
      });

      // Update item
      const updateResponse = await request(app)
        .put(`/items/${itemId}`)
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({
          title: 'Updated Integration Item',
          description: 'Updated Description'
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body).toEqual({
        id: itemId,
        title: 'Updated Integration Item',
        description: 'Updated Description'
      });

      // Delete item
      const deleteResponse = await request(app)
        .delete(`/items/${itemId}`)
        .set('Authorization', `Bearer ${VALID_TOKEN}`);

      expect(deleteResponse.status).toBe(204);

      // Verify item is deleted
      const finalGetResponse = await request(app)
        .get('/items')
        .set('Authorization', `Bearer ${VALID_TOKEN}`);

      expect(finalGetResponse.status).toBe(200);
      expect(finalGetResponse.body).toEqual([]);
    });
  });
});
