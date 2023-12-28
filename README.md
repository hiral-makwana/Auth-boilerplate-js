# NodeAuthBase-JS

An authentication library for Node.js simplifies the implementation of authentication-related functionalities in your Express applications. It provides tools for managing Sequelize models, creating Express routes, initializing email configurations, and Swagger documentation setup.

## Installation

```bash
npx NodeAuthBase-JS <project-name>
```
## Manual Installation
Clone the repo: 
```bash
git clone --depth 1 https://github.com/hiral-makwana/NodeAuthBase-JS.git
cd NodeAuthBase-JS
npx rimraf ./.git
```
## Update environment variables
FIle path: ./config/config.json: 
```bash
{
   "PORT": 7000,
   "database": {
      "host": "localhost",
      "dbName": "database_name",
      "dbUser": "database_userName",
      "dbPassword": "database_password"
   }...
}
```
## Usage

### 1. Start the server

```
npm start
```

### 2. Expected result 
#### 1. local server
![result_1](https://raw.githubusercontent.com/hiral-makwana/NodeAuthBase-JS/auth-1.0/src/blob/result_1.png)
#### 2. Swagger APIs
![result_2](https://raw.githubusercontent.com/hiral-makwana/NodeAuthBase-JS/auth-1.0/src/blob/result_2.png)

## Additional Details
#### Types of validations (Use to add custom error message for validation in APIs)
| Type     | Description                       |
| :------- | :-------------------------------- |
| string.base         | Specifies that the value must be a string.           |
| number.base         | Specifies that the value must be a number.           |
| boolean.base        | Specifies that the value must be a boolean.          |
| object.base         | Specifies that the value must be an object.          |
| array.base          | Specifies that the value must be an array.           |
| date.base           | Specifies that the value must be a date.            |
| alternatives   | Specifies multiple valid alternatives for the value. |
| any.required   | Specifies that the property is required.             |
| any.optional   | Specifies that the property is optional.             |
| any.forbidden  | Specifies that the property is forbidden.            |
| any.allow      | Specifies the allowed values for the property.       |
| any.valid      | Specifies the valid values for the property.         |
| any.invalid    | Specifies the invalid values for the property.       |
| any.default    | Specifies the default value for the property.        |
| string.email   | Specifies that the string must be a valid email.     |
| string.min     | Specifies the minimum length of the string.          |
| string.max     | Specifies the maximum length of the string.          |
| number.min     | Specifies the minimum value for the number.          |
| number.max     | Specifies the maximum value for the number.          |
| date.min       | Specifies the minimum date for the date.             |
| date.max       | Specifies the maximum date for the date.             |
| string.pattern | Specifies a regular expression pattern for the string.|
| any.when       | Specifies conditional validation based on another property.|
| any.error      | Specifies custom error messages for the property.    |
| any.label      | Specifies a custom label for the property in error messages.|
| any.messages   | Specifies custom validation error messages.         |

## Acknowledgements

 - 

## Contributing

We welcome contributions! Please follow the guidelines outlined in our [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
