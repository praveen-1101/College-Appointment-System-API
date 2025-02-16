// End-to-end tests for the appointment system
const { app, startServer, closeServer } = require('../src/index');
const request = require('supertest');

let studentTokenA1, studentTokenA2, professorToken;
let professorId, studentA1Id, slotT1, slotT2, appointmentId;
let server;

describe('College Appointment System E2E Test', () => {
  
  // Start server before all tests
  beforeAll(() => {
    server = startServer();
  });

  // Close server after all tests
  
  afterAll(async () => {
    await closeServer();
    await new Promise(resolve => setTimeout(resolve, 500)); // Giving server time to close
  });

  // Test user registration and authentication
  test('Student A1 signs up and logs in', async () => {
    await request(app).post('/auth/signup').send({
      email: 'studentA1@test.com',
      password: 'passwordA1',
      role: 'student',
    });
    const response = await request(app).post('/auth/login').send({
      email: 'studentA1@test.com',
      password: 'passwordA1',
    });
    console.log('Student A1 Login Response:', response.body);
    expect(response.body).toHaveProperty('token');
    studentTokenA1 = response.body.token;
    studentA1Id = response.body.userId;
  });

  test('Professor P1 signs up and logs in', async () => {
    await request(app).post('/auth/signup').send({
      email: 'professorP1@test.com',
      password: 'passwordP1',
      role: 'professor',
    });
    const response = await request(app).post('/auth/login').send({
      email: 'professorP1@test.com',
      password: 'passwordP1',
    });
    console.log('Professor P1 Login Response:', response.body);
    expect(response.body).toHaveProperty('token');
    professorToken = response.body.token;
    professorId = response.body.userId;
  });

  // Test availability management
  test('Professor P1 specifies availability', async () => {
    const response1 = await request(app)
      .post('/availability')
      .set('Authorization', `Bearer ${professorToken}`)
      .send({ startTime: '2025-01-27T10:00:00Z', endTime: '2025-01-27T11:00:00Z' });

    const response2 = await request(app)
      .post('/availability')
      .set('Authorization', `Bearer ${professorToken}`)
      .send({ startTime: '2025-01-27T11:00:00Z', endTime: '2025-01-27T12:00:00Z' });

    console.log('Availability Response 1:', response1.body);
    console.log('Availability Response 2:', response2.body);

    expect(response1.body.message).toBe('Availability set');
    slotT1 = response1.body.data._id;
    slotT2 = response2.body.data._id;
  });

  // Test viewing available slots
  test('Student A1 views available slots', async () => {
    const response = await request(app)
      .get(`/availability/${professorId}`)
      .set('Authorization', `Bearer ${studentTokenA1}`);
    console.log('Available Slots Response:', response.body);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test booking appointments
  test('Student A1 books an appointment', async () => {
    const response = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${studentTokenA1}`)
      .send({ availabilityId: slotT1 });
    console.log('Appointment Booking Response:', response.body);
    expect(response.body.message).toBe('Appointment booked');
    appointmentId = response.body.data._id;
  });

  // Test multiple student bookings
  test('Student A2 signs up and books an appointment', async () => {
    await request(app).post('/auth/signup').send({
      email: 'studentA2@test.com',
      password: 'passwordA2',
      role: 'student',
    });
    const loginResponse = await request(app).post('/auth/login').send({
      email: 'studentA2@test.com',
      password: 'passwordA2',
    });
    console.log('Student A2 Login Response:', loginResponse.body);
    expect(loginResponse.body).toHaveProperty('token');
    studentTokenA2 = loginResponse.body.token;
    
    // Book appointment for second student
    const bookingResponse = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${studentTokenA2}`)
      .send({ availabilityId: slotT2 });
    console.log('Student A2 Booking Response:', bookingResponse.body);
    expect(bookingResponse.body.message).toBe('Appointment booked');
  });

  // Test appointment cancellation
  test('Professor P1 cancels Student A1\'s appointment', async () => {
    const response = await request(app)
      .delete(`/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${professorToken}`);
    console.log('Cancel Appointment Response:', response.body);
    expect(response.body.message).toBe('Appointment cancelled');
  });

  // Test viewing appointments
  test('Student A1 checks appointments', async () => {
    const response = await request(app)
      .get(`/appointments/${studentA1Id}`)
      .set('Authorization', `Bearer ${studentTokenA1}`);
    console.log('Student A1 Appointments Response:', response.body);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});