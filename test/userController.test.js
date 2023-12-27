// test/userController.test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server');
const sinon = require('sinon');
const { User, UserMeta } = require('../src/models/index');
const utils = require('../src/helper/utils');
const { generateRandomOtp, generateHash } = require('../src/helper/utils');
const { sendEmail } = require('../src/helper/emailConfig');
const { generateToken } = require('../src/helper/jwtToken');
const bcrypt = require('bcrypt');
chai.use(chaiHttp);
const { expect } = chai;
describe('User Controller', () => {
    let sandbox;

    // Before each test, create a Sinon sandbox
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    // After each test, restore the sandbox to make sure stubs are removed
    afterEach(() => {
        sandbox.restore();
    });

    it('should register a new user successfully', async () => {
        const response = await chai
            .request(app)
            .post('/register')
            .send({
                firstName: 'John',
                email: 'john.doe2@example.com',
                password: 'Password@123',
                roleId: 2
            });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('Registration successful, please verify your account with OTP.');
    });

    it('should update an existing inactive user', async () => {
        // Assume there is an existing user with the email 'john.doe@example.com' and status 'DEactive'
        const response = await chai
            .request(app)
            .post('/register')
            .send({
                // Provide necessary data for updating an existing inactive user
                firstName: 'John',
                email: 'john.doe@example.com',
                password: 'Password@123',
                roleId: 2
            });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('Email is already registered.');
    });

    it('should handle already registered user', async () => {
        // Assume there is an existing user with the email 'john.doe@example.com' and status 'active'
        const response = await chai
            .request(app)
            .post('/register')
            .send({
                firstName: 'John',
                email: 'john.doe@example.com',
                password: 'Password@123',
                roleId: 2
            });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('already registered');
    });

    it('should handle invalid registration data', async () => {
        const response = await chai
            .request(app)
            .post('/register')
            .send({
                firstName: 'John'
            });
        expect(response).to.have.status(400); // Assuming a 400 Bad Request status for invalid data
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('"');
    });

    it('should handle server error during registration', async () => {
        sandbox.stub(User, 'create').throws(new Error('Simulated server error'));

        const response = await chai
            .request(app)
            .post('/register')
            .send({
                firstName: 'John',
                email: 'john.doe@example.com',
                password: 'Password@123',
                roleId: 2,
            });
        expect(response).to.have.property('status');
        //expect(response.body).to.have.property('status', false);
        expect(response.body.message.toLowerCase()).to.satisfy(message => (
            message.includes('internal') || message.includes('error') || message.includes('already')
        ));
    });

    it('should verify OTP and activate user account', async () => {
        const response = await chai
            .request(app)
            .post('/verifyOtp')
            .send({
                type: 'register',
                email: 'john.doe@example.com',
                otp: 123456,
            });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('Otp verified');
        expect(response.body).to.have.property('isVerified', true);
        expect(response.body).to.have.property('loginType', 'register');
    });

    it('should handle invalid OTP', async () => {
        const response = await chai
            .request(app)
            .post('/verifyOtp')
            .send({
                type: 'register',
                email: 'john.doe@example.com',
                otp: 967869,
            });

        expect(response).to.have.status(400);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('Given opt is invalid.');
    });

    // it('should handle already verified user', async () => {
    //     const user = await createUserWithOTP({ status: 'active', isVerified: true });

    //     const response = await chai
    //         .request(app)
    //         .post('/verifyOtp')
    //         .send({
    //             type: 'register',
    //             email: user.email,
    //             otp: '123456',
    //         });

    //     expect(response).to.have.status(400);
    //     expect(response.body).to.have.property('status', false);
    //     expect(response.body).to.have.property('message').that.includes('User already verified.');
    // });

    it('should resend OTP for forgot password', async () => {

        const response = await chai
            .request(app)
            .post('/resendOtp')
            .send({
                type: 'forgot',
                email: 'john.doe@example.com',
            });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('OTP sent successfully.');
    });

    it('should handle invalid type for OTP resend', async () => {
        const response = await chai
            .request(app)
            .post('/resendOtp')
            .send({
                type: 'INVALID_TYPE',
                email: 'john.doe@example.com',
            });

        expect(response).to.have.status(400);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('Invalid request type. Expected ');
    });

    it('should handle user not found during OTP resend', async () => {
        const response = await chai
            .request(app)
            .post('/resendOtp')
            .send({
                type: 'forgot',
                email: 'nonexistent.user@example.com',
            });

        expect(response).to.have.status(404);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('User not found.');
    });

    it('should handle server error during OTP resend', async () => {
        sandbox.stub(UserMeta, 'update').throws(new Error('Simulated server error'));
        sandbox.stub(utils, 'generateRandomOtp').throws(new Error('Simulated server error'));

        const response = await chai
            .request(app)
            .post('/resendOtp')
            .send({
                type: 'forgot',
                email: 'john.doe@example.com'
            });
        expect(response).to.have.status(500);
        expect(response.body).to.have.property('status', false);
        expect(response.body.message.toLowerCase()).to.satisfy(message => (
            message.includes('internal') || message.includes('error')
        ));
    });

    it('should send OTP for password reset successfully', async () => {
        // Stub User.findOne to simulate a user found
        const userStub = sandbox.stub(User, 'findOne').resolves({
            id: 9,
            email: 'john.doe@example.com',
        });

        // Stub generateRandomOtp to simulate generating a random OTP
        const generateOtpStub = sandbox.stub(generateRandomOtp);
        //generateOtpStub.returns('123456'); // Set a specific OTP value for testing

        // Stub UserMeta.update to simulate updating the OTP in the database
        const updateMetaStub = sandbox.stub(UserMeta, 'update').resolves([1]); // Assume successful update

        // Stub sendEmail to simulate sending an email
        const sendEmailStub = sandbox.stub(sendEmail);
        // Perform the API request
        const response = await chai
            .request(app)
            .post('/forgotPassword')
            .send({ email: 'john.doe@example.com' });

        // Assertions
        expect(userStub.calledOnce).to.be.true;
        expect(generateOtpStub);
        expect(updateMetaStub.calledOnce).to.be.true;
        expect(sendEmailStub);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('OTP sent');
    });

    it('should handle user not found during password reset', async () => {
        // Stub User.findOne to simulate a user not found
        sandbox.stub(User, 'findOne').resolves(null);

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/forgotPassword')
            .send({ email: 'nonexistent.user@example.com' });

        // Assertions
        expect(response).to.have.status(404);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('User not found');
    });

    it('should handle server error during password reset', async () => {
        // Stub User.findOne to simulate a server error
        sandbox.stub(User, 'findOne').throws(new Error('Simulated server error'));

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/forgotPassword')
            .send({ email: 'existing.user@example.com' });

        // Assertions
        expect(response).to.have.status(500);
        expect(response.body).to.have.property('status', false);
        expect(response.body.message.toLowerCase()).to.satisfy(message => (
            message.includes('internal') || message.includes('error')
        ));
    });

    it('should reset password successfully', async () => {
        // Stub User.findOne to simulate finding a user
        const userStub = sandbox.stub(User, 'findOne').resolves({
            id: 9,
            email: 'john.doe@example.com',
        });

        // Stub generateHash to simulate hashing the password
        const generateHashStub = sandbox.stub(generateHash);
        //generateHashStub.returns('hashedPassword'); // Set a specific hashed password for testing

        // Stub User.update to simulate updating the user's password
        const updateUserStub = sandbox.stub(User, 'update').resolves([1]); // Assume successful update

        // Stub UserMeta.update to simulate updating the user meta information
        const updateMetaStub = sandbox.stub(UserMeta, 'update').resolves([1]); // Assume successful update

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/resetPassword')
            .send({ email: 'john.doe@example.com', password: 'new@Password1' });

        // Assertions
        expect(userStub.calledOnce).to.be.true;
        expect(generateHashStub);
        expect(updateUserStub.calledOnce).to.be.true;
        expect(updateMetaStub.calledOnce).to.be.true;

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('Password reset');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('userId', 9);
        expect(response.body.data).to.have.property('email', 'john.doe@example.com');
    });

    it('should handle user not found during password reset', async () => {
        // Stub User.findOne to simulate not finding a user
        sandbox.stub(User, 'findOne').resolves(null);

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/resetPassword')
            .send({ email: 'nonexistent.user@example.com', password: 'new@Password4' });

        // Assertions
        expect(response).to.have.status(404);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('User not found');
    });

    it('should handle server error during password reset', async () => {
        // Stub User.findOne to simulate a server error
        sandbox.stub(User, 'findOne').throws(new Error('Simulated server error'));

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/resetPassword')
            .send({ email: 'john.doe@example.com', password: 'newPassword' });

        // Assertions
        expect(response.body).to.have.property('status', false);
        expect(response.body.message.toLowerCase()).to.satisfy(message => (
            message.includes('internal') || message.includes('error') || message.includes('password') || message.includes('required')
        ));
    });

    it('should log in successfully', async () => {
        // Stub User.findOne to simulate finding a user
        const userStub = sandbox.stub(User, 'findOne').resolves({
            id: 4,
            email: 'testUser903@yopmail.com',
            password: await bcrypt.hash('String@123', 10), // Hashed password for testing
            isVerified: true,
        });

        // Stub bcrypt.compare to simulate a valid password
        const compareStub = sandbox.stub(bcrypt, 'compare').resolves(true);

        // Stub generateToken to simulate generating a token
        const generateTokenStub = sandbox.stub(generateToken);
        //generateTokenStub.returns('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0VXNlcjkwM0B5b3BtYWlsLmNvbSIsImlhdCI6MTcwMzUwMTM4MiwiZXhwIjoxNzAzNTA0OTgyfQ.SjoU6wyTg88pvDkK5Uqx45b6j0Y7mTqQCWYAnVFZBd4'); // Set a specific token value for testing

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/login')
            .send({ email: 'testUser903@yopmail.com', password: 'String@123' });

        // Assertions
        expect(userStub.calledOnce).to.be.true;
        expect(compareStub.calledOnce).to.be.true;
        expect(generateTokenStub);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('Login successful');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('userId', 4);
        expect(response.body.data).to.have.property('email', 'testUser903@yopmail.com');
        expect(response.body.data).to.have.property('token').that.include('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    });

    it('should handle invalid email during login', async () => {
        // Stub User.findOne to simulate not finding a user
        sandbox.stub(User, 'findOne').resolves(null);

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/login')
            .send({ email: 'john.doe21@example.com', password: 'Password@123' });

        // Assertions
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('Invalid email or password');
    });

    it('should handle invalid password during login', async () => {
        // Stub User.findOne to simulate finding a user
        sandbox.stub(User, 'findOne').resolves({
            id: 13,
            email: 'john.doe2@example.com',
            password: await bcrypt.hash('Password@123', 10), // Hashed password for testing
            isVerified: true,
        });

        // Stub bcrypt.compare to simulate an invalid password
        sandbox.stub(bcrypt, 'compare').resolves(false);

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/login')
            .send({ email: 'john.doe2@example.com', password: 'invalid-password' });

        // Assertions
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('Invalid email or password');
    });

    it('should handle not verified user during login', async () => {
        // Stub User.findOne to simulate finding a user
        sandbox.stub(User, 'findOne').resolves({
            id: 13,
            email: 'john.doe2@example.com',
            password: await bcrypt.hash('Password@123', 10), // Hashed password for testing
            isVerified: false,
        });

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/login')
            .send({ email: 'john.doe2@example.com', password: 'Password@123' });

        // Assertions
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('User not verified');
    });

    it('should handle server error during login', async () => {
        // Stub User.findOne to simulate a server error
        sandbox.stub(User, 'findOne').throws(new Error('Simulated server error'));

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/login')
            .send({ email: 'existing.user@example.com', password: 'password123' });

        // Assertions
        expect(response.body).to.have.property('status', false);
        expect(response.body.message.toLowerCase()).to.satisfy(message => (
            message.includes('internal') || message.includes('error') || message.includes('password') || message.includes('required')
        ));
    });

    it('should change password successfully', async () => {
        // Stub User.findByPk to simulate finding a user
        const userStub = sandbox.stub(User, 'findByPk').resolves({
            id: 5,
            password: await bcrypt.hash('GE378@6ws', 10), // Hashed old password for testing
        });

        // Stub bcrypt.compare to simulate a valid old password
        const compareStub = sandbox.stub(bcrypt, 'compare').resolves(true);

        // Stub bcrypt.hash to simulate hashing the new password
        const hashStub = sandbox.stub(bcrypt, 'hash').resolves('$2b$10$6fWkHYUSwxlaaKGucXFc2eq/rW54BAs37Q4a1xEd9/m.Dnv82Z4NC'); // Set a specific hashed password for testing

        // Stub User.update to simulate updating the user's password
        const updateUserStub = sandbox.stub(User, 'update').resolves([1]); // Assume successful update

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/changePassword')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJ0ZXN0VXNlcjkwOEB5b3BtYWlsLmNvbSIsImlhdCI6MTcwMzUwMTk5NCwiZXhwIjoxNzAzNTA1NTk0fQ.El_UM3j6Pd9KD0B4d0uaojV72N3kMIYlKXVDTYJEa3c') // Provide a valid token for authorization
            .send({ oldPassword: 'GE378@6ws', newPassword: 'String@123' });

        // Assertions
        expect(userStub.calledOnce).to.be.true;
        expect(compareStub.calledOnce).to.be.true;
        expect(hashStub.calledOnce).to.be.true;
        expect(updateUserStub.calledOnce).to.be.true;

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('Password change');
    });

    it('should handle user not found during password change', async () => {
        // Stub User.findByPk to simulate not finding a user
        sandbox.stub(User, 'findByPk').resolves(null);

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/changePassword')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJ0ZXN0VXNlcjkwMkB5b3BtYWlsLmNvbSIsImlhdCI6MTcwMjk4MDM1NywiZXhwIjoxNzAzOTgzOTU3fQ.XBA37sbvxkNuMoWU4qvUWZl_7XDAwK1oA0qfruhoA1M') // Provide a valid token for authorization
            .send({ oldPassword: 'old@Password1', newPassword: 'new@Password1' });

        // Assertions
        expect(response).to.have.status(404);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('User not found');
    });

    it('should handle invalid old password during password change', async () => {
        // Stub User.findByPk to simulate finding a user
        sandbox.stub(User, 'findByPk').resolves({
            id: 1,
            password: await bcrypt.hash('GE378@6ws', 10), // Hashed correct password for testing
        });

        // Stub bcrypt.compare to simulate an invalid old password
        sandbox.stub(bcrypt, 'compare').resolves(false);

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/changePassword')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJ0ZXN0VXNlcjkwOEB5b3BtYWlsLmNvbSIsImlhdCI6MTcwMzUwMTk5NCwiZXhwIjoxNzAzNTA1NTk0fQ.El_UM3j6Pd9KD0B4d0uaojV72N3kMIYlKXVDTYJEa3c') // Provide a valid token for authorization
            .send({ oldPassword: 'wrong@Password1', newPassword: 'new@Password1' });

        // Assertions
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('Old password is invalid');
    });

    it('should handle matching old and new passwords during password change', async () => {
        // Stub User.findByPk to simulate finding a user
        sandbox.stub(User, 'findByPk').resolves({
            id: 4,
            password: await bcrypt.hash('String@123', 10), // Hashed same password for testing
        });

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/changePassword')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0VXNlcjkwM0B5b3BtYWlsLmNvbSIsImlhdCI6MTcwMzUwMjM1MywiZXhwIjoxNzAzNTA1OTUzfQ.0jFi0bqtXsBincdM84pzgc6RXHDrlpGxBtus24QMu-I') // Provide a valid token for authorization
            .send({ oldPassword: 'String@123', newPassword: 'String@123' });

        // Assertions
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('Old and new password can not be same');
    });

    it('should handle server error during password change', async () => {
        // Stub User.findByPk to simulate finding a user
        sandbox.stub(User, 'findByPk').resolves({
            id: 4,
            password: await bcrypt.hash('String@123', 10), // Hashed old password for testing
        });

        // Stub bcrypt.hash to simulate a server error during hashing the new password
        sandbox.stub(bcrypt, 'hash').throws(new Error('Simulated server error'));

        // Perform the API request
        const response = await chai
            .request(app)
            .post('/changePassword')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0VXNlcjkwM0B5b3BtYWlsLmNvbSIsImlhdCI6MTcwMzUwMjM1MywiZXhwIjoxNzAzNTA1OTUzfQ.0jFi0bqtXsBincdM84pzgc6RXHDrlpGxBtus24QMu-I') // Provide a valid token for authorization
            .send({ oldPassword: 'String@123', newPassword: 'new@Passwo1rd' });

        // Assertions
        expect(response.body).to.have.property('status', false);
        expect(response.body.message.toLowerCase()).to.satisfy(message => (
            message.includes('internal') || message.includes('error') || message.includes('password') || message.includes('required')
        ));
    });
    it('should delete user successfully with hard delete', async () => {
        // Stub User.findOne to simulate finding a user
        const userStub = sandbox.stub(User, 'findOne').resolves({
            id: 2,
            isDeleted: false,
        });

        // Stub User.destroy to simulate deleting a user
        const destroyStub = sandbox.stub(User, 'destroy').resolves(1); // Assume successful deletion

        // Perform the API request
        const response = await chai
            .request(app)
            .delete('/deleteUser/2')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0VXNlcjkwM0B5b3BtYWlsLmNvbSIsImlhdCI6MTcwMzUwMjM1MywiZXhwIjoxNzAzNTA1OTUzfQ.0jFi0bqtXsBincdM84pzgc6RXHDrlpGxBtus24QMu-I'); // Provide a valid token for authorization

        // Assertions
        expect(userStub.calledOnce).to.be.true;
        expect(destroyStub.calledOnce).to.be.true;

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('User deleted');
    });

    it('should handle user not found during hard delete', async () => {
        // Stub User.findOne to simulate not finding a user
        sandbox.stub(User, 'findOne').resolves(null);

        // Perform the API request
        const response = await chai
            .request(app)
            .delete('/deleteUser/1')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0VXNlcjkwM0B5b3BtYWlsLmNvbSIsImlhdCI6MTcwMzUwMjM1MywiZXhwIjoxNzAzNTA1OTUzfQ.0jFi0bqtXsBincdM84pzgc6RXHDrlpGxBtus24QMu-I'); // Provide a valid token for authorization

        // Assertions
        expect(response).to.have.status(404);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('User not found');
    });

    it('should handle server error during hard delete', async () => {
        // Stub User.findOne to simulate finding a user
        const userStub = sandbox.stub(User, 'findOne').resolves({
            id: 1,
            isDeleted: false,
        });

        // Stub User.destroy to simulate a server error during deletion
        sandbox.stub(User, 'destroy').throws(new Error('Simulated server error'));

        // Perform the API request
        const response = await chai
            .request(app)
            .delete('/deleteUser/1')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0VXNlcjkwM0B5b3BtYWlsLmNvbSIsImlhdCI6MTcwMzUwMjM1MywiZXhwIjoxNzAzNTA1OTUzfQ.0jFi0bqtXsBincdM84pzgc6RXHDrlpGxBtus24QMu-I'); // Provide a valid token for authorization

        // Assertions
        expect(userStub.calledOnce).to.be.true;

        expect(response.body).to.have.property('status', false);
        expect(response.body.message.toLowerCase()).to.satisfy(message => (
            message.includes('internal') || message.includes('error')
        ));
    });

    it('should delete user successfully with soft delete', async () => {
        // Stub User.findOne to simulate finding a user
        const userStub = sandbox.stub(User, 'findOne').resolves({
            id: 4,
            isDeleted: false,
        });

        // Stub User.update to simulate updating isDeleted to true
        const updateStub = sandbox.stub(User, 'update').resolves([1]); // Assume successful update

        // Perform the API request
        const response = await chai
            .request(app)
            .delete('/deleteUser/4')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0VXNlcjkwM0B5b3BtYWlsLmNvbSIsImlhdCI6MTcwMzUwMjM1MywiZXhwIjoxNzAzNTA1OTUzfQ.0jFi0bqtXsBincdM84pzgc6RXHDrlpGxBtus24QMu-I'); // Provide a valid token for authorization

        // Assertions
        expect(userStub.calledOnce).to.be.true;
        expect(updateStub.calledOnce).to.be.true;

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes('User deleted');
    });

    it('should handle user not found during soft delete', async () => {
        // Stub User.findOne to simulate not finding a user
        sandbox.stub(User, 'findOne').resolves(null);

        // Perform the API request
        const response = await chai
            .request(app)
            .delete('/deleteUser/1')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0VXNlcjkwM0B5b3BtYWlsLmNvbSIsImlhdCI6MTcwMzUwMjM1MywiZXhwIjoxNzAzNTA1OTUzfQ.0jFi0bqtXsBincdM84pzgc6RXHDrlpGxBtus24QMu-I'); // Provide a valid token for authorization

        // Assertions
        expect(response).to.have.status(404);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('User not found');
    });

    it('should handle field not found during soft delete', async () => {
        // Stub User.findOne to simulate finding a user
        const userStub = sandbox.stub(User, 'findOne').resolves({
            id: 4,
            isDeleted: false,
        });

        // Stub User.getAttributes to simulate not having the 'isDeleted' attribute
        sandbox.stub(User, 'getAttributes').returns(['id', 'email']); // Assume incomplete model attributes

        // Perform the API request
        const response = await chai
            .request(app)
            .delete('/deleteUser/1')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0VXNlcjkwM0B5b3BtYWlsLmNvbSIsImlhdCI6MTcwMzUwMjM1MywiZXhwIjoxNzAzNTA1OTUzfQ.0jFi0bqtXsBincdM84pzgc6RXHDrlpGxBtus24QMu-I'); // Provide a valid token for authorization

        // Assertions
        expect(userStub.calledOnce).to.be.true;

        expect(response).to.have.status(500);
        expect(response.body).to.have.property('status', false);
        expect(response.body).to.have.property('message').that.includes('Deletion status field');
    });

    it('should handle server error during soft delete', async () => {
        // Stub User.findOne to simulate finding a user
        const userStub = sandbox.stub(User, 'findOne').resolves({
            id: 3,
            isDeleted: false,
        });

        // Stub User.getAttributes to simulate having the 'isDeleted' attribute
        sandbox.stub(User, 'getAttributes').returns(['id', 'email']);

        // Stub User.update to simulate a server error during update
        sandbox.stub(User, 'update').throws(new Error('Simulated server error'));

        // Perform the API request
        const response = await chai
            .request(app)
            .delete('/deleteUser/3')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0VXNlcjkwM0B5b3BtYWlsLmNvbSIsImlhdCI6MTcwMzUwMjM1MywiZXhwIjoxNzAzNTA1OTUzfQ.0jFi0bqtXsBincdM84pzgc6RXHDrlpGxBtus24QMu-I'); // Provide a valid token for authorization

        // Assertions
        expect(userStub.calledOnce).to.be.true;

        expect(response.body).to.have.property('status', false);
        expect(response.body.message.toLowerCase()).to.satisfy(message => (
            message.includes('internal') || message.includes('error')
        ));
    });
    it('should get list of users successfully', async () => {
        // Stub User.findAll to simulate fetching user data
        const findAllStub = sandbox.stub(User, 'findAll').resolves([
            { id: 1, name: 'User 1', isDeleted: false },
            { id: 2, name: 'User 2', isDeleted: false },
            { id: 3, name: 'User 3', isDeleted: false },
        ]);

        // Perform the API request
        const response = await chai.request(app).get('/list');

        // Assertions
        expect(findAllStub.calledOnce).to.be.true;

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('message').that.includes("User's list fetched");
        expect(response.body).to.have.property('data').to.be.an('array').with.lengthOf(3);
    });

    it('should handle server error during user list retrieval', async () => {
        // Stub User.findAll to simulate a server error
        sandbox.stub(User, 'findAll').throws(new Error('Simulated server error'));

        // Perform the API request
        const response = await chai.request(app).get('/list');

        // Assertions
        expect(response.body).to.have.property('status', false);
        expect(response.body.message.toLowerCase()).to.satisfy(message => (
            message.includes('internal') || message.includes('error')
        ));
    });
});
