// test/userController.test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server'); // Import your Express app
const { expect } = chai;

chai.use(chaiHttp);

describe('User Controller', () => {
    it('should register a new user successfully', async () => {
        const response = await chai
            .request(app)
            .post('/register')
            .send({
                // Provide necessary data for successful registration
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phoneNumber: '1234567890',
                roleId: 2,
            });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('SUCCESS_CREATE');
    });

    it('should update an existing inactive user', async () => {
        // Assume there is an existing user with the email 'john.doe@example.com' and status 'DEACTIVE'
        const response = await chai
            .request(app)
            .post('/register')
            .send({
                // Provide necessary data for updating an existing inactive user
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'newpassword123',
                phoneNumber: '1234567890',
                roleId: 2,
            });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('SUCCESS_UPDATE');
    });

    it('should handle already registered user', async () => {
        // Assume there is an existing user with the email 'john.doe@example.com' and status 'ACTIVE'
        const response = await chai
            .request(app)
            .post('/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phoneNumber: '1234567890',
                roleId: 2,
            });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('ALREADY_REGISTERED');
    });

    it('should handle invalid registration data', async () => {
        const response = await chai
            .request(app)
            .post('/register')
            .send({
                // Provide incomplete or invalid data
                // (e.g., missing required fields or invalid email)
            });

        expect(response).to.have.status(400); // Assuming a 400 Bad Request status for invalid data
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('Validation error');
    });

    it('should handle server error during registration', async () => {
        // Mock the User.create method to simulate a server error
        sandbox.stub(User, 'create').throws(new Error('Simulated server error'));

        const response = await chai
            .request(app)
            .post('/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phoneNumber: '1234567890',
                roleId: 2,
            });

        expect(response).to.have.status(500);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('SERVER_ERR');
    });
});
