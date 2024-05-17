/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst auth_1 = __importDefault(__webpack_require__(/*! ./routes/auth */ \"./src/routes/auth.ts\"));\nconst http_1 = __webpack_require__(/*! http */ \"http\");\nconst repos_1 = __webpack_require__(/*! ./repos */ \"./src/repos/index.ts\");\n__webpack_require__(/*! dotenv/config */ \"dotenv/config\");\nconst users_1 = __webpack_require__(/*! ./repos/users */ \"./src/repos/users.ts\");\nconst users_2 = __importDefault(__webpack_require__(/*! ./routes/users */ \"./src/routes/users.ts\"));\nconst tspec_1 = __webpack_require__(/*! tspec */ \"tspec\");\nasync function initServer() {\n    const app = (0, express_1.default)();\n    app.use(express_1.default.json());\n    await (0, repos_1.ConnectDB)();\n    await (0, users_1.ConnectUserCollection)();\n    //Routes\n    app.use(\"/docs\", await (0, tspec_1.TspecDocsMiddleware)());\n    app.use(\"/auth\", auth_1.default);\n    app.use(\"/users\", users_2.default);\n    app.get(\"/\", (_req, res) => res.send({ status: http_1.STATUS_CODES[200], message: \"success!\" }));\n    const PORT = process.env.PORT || 3000;\n    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));\n    return 0;\n}\ninitServer();\n\n\n//# sourceURL=webpack://atiyeh_holdings/./src/index.ts?");

/***/ }),

/***/ "./src/repos/index.ts":
/*!****************************!*\
  !*** ./src/repos/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.GetCollection = exports.ConnectDB = void 0;\nconst mongodb_1 = __webpack_require__(/*! mongodb */ \"mongodb\");\n__webpack_require__(/*! dotenv/config */ \"dotenv/config\");\nconst { MONGO_CONNECTION_STRING, MONGO_DB: dbName } = process.env;\nlet db;\n// Create a MongoClient\nconst client = new mongodb_1.MongoClient(MONGO_CONNECTION_STRING);\nasync function ConnectDB() {\n    try {\n        await client.connect();\n        db = client.db(dbName);\n        await UsersSchema();\n        // await HousesSchema();\n        console.log(\"Successfully connected to MongoDB!\");\n    }\n    catch (error) {\n        console.error(error);\n    }\n    finally {\n        await client.close();\n    }\n}\nexports.ConnectDB = ConnectDB;\nasync function GetCollection(collectionName) {\n    return (await client.connect())\n        .db(process.env.MONGO_DB)\n        .collection(collectionName);\n}\nexports.GetCollection = GetCollection;\nasync function UsersSchema() {\n    await db.command({\n        collMod: process.env.USER_COLLECTION,\n        validator: {\n            $jsonSchema: {\n                bsonType: \"object\",\n                required: [\"name\", \"email\", \"password\", \"role\"],\n                additionalProperties: false,\n                properties: {\n                    _id: {},\n                    name: {\n                        bsonType: \"string\",\n                        description: \"'name' is required and is a string\",\n                    },\n                    email: {\n                        bsonType: \"string\",\n                        description: \"'email' is required and is a string\",\n                    },\n                    password: {\n                        bsonType: \"string\",\n                        description: \"'password' is required and is a string\",\n                    },\n                    houses: {\n                        bsonType: \"array\",\n                        description: \"array of houses associated with the user\",\n                    },\n                    role: {\n                        bsonType: \"string\",\n                        description: \"'role' is required and is either 'admin', 'owner', or 'tentant\",\n                    },\n                },\n            },\n        },\n    });\n}\nasync function HousesSchema() {\n    await db.command({\n        collMod: process.env.HOUSE_COLLECTION,\n        validator: {\n            $jsonSchema: {\n                bsonType: \"object\",\n                required: [\"name\", \"address\"],\n                additionalProperties: false,\n                properties: {\n                    _id: {},\n                    name: {\n                        bsonType: \"string\",\n                        description: \"'name' is required and is a string\",\n                    },\n                    address: {\n                        bsonType: \"string\",\n                        description: \"'address' is required and is a string\",\n                    },\n                    ownerIds: {\n                        bsonType: \"array\",\n                        description: \"array of user ids associated with the house\",\n                    },\n                    details: {\n                        bsonType: \"object\",\n                        properties: {\n                            bathrooms: {\n                                bsonType: \"number\",\n                            },\n                            bedrooms: {\n                                bsonType: \"number\",\n                            },\n                            currentValue: {\n                                bsonType: \"number\",\n                            },\n                            purchasePrice: {\n                                bsonType: \"number\",\n                            },\n                            sqft: {\n                                bsonType: \"number\",\n                            },\n                        },\n                    },\n                    lease: {\n                        bsonType: \"object\",\n                        properties: {\n                            deposit: {\n                                bsonType: \"number\",\n                            },\n                            end: {\n                                bsonType: \"date\",\n                            },\n                            rentPrice: {\n                                bsonType: \"number\",\n                            },\n                            start: {\n                                bsonType: \"date\",\n                            },\n                            tenantId: {\n                                bsonType: \"string\",\n                            },\n                        },\n                    },\n                },\n            },\n        },\n    });\n}\n\n\n//# sourceURL=webpack://atiyeh_holdings/./src/repos/index.ts?");

/***/ }),

/***/ "./src/repos/users.ts":
/*!****************************!*\
  !*** ./src/repos/users.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DeleteUser = exports.UpdateUser = exports.GetUsers = exports.CreateUser = exports.GetUserByEmail = exports.GetUserById = exports.ConnectUserCollection = void 0;\nconst mongodb_1 = __webpack_require__(/*! mongodb */ \"mongodb\");\nconst _1 = __webpack_require__(/*! . */ \"./src/repos/index.ts\");\nconst bcrypt_1 = __importDefault(__webpack_require__(/*! bcrypt */ \"bcrypt\"));\n__webpack_require__(/*! dotenv/config */ \"dotenv/config\");\nlet userCollection;\nasync function ConnectUserCollection() {\n    userCollection = await (0, _1.GetCollection)(process.env.USER_COLLECTION);\n}\nexports.ConnectUserCollection = ConnectUserCollection;\n// Get User\nasync function GetUserById(userId) {\n    const user = await userCollection.findOne({\n        _id: new mongodb_1.ObjectId(userId),\n    });\n    if (!user)\n        return null;\n    return user;\n}\nexports.GetUserById = GetUserById;\n// Get User\nasync function GetUserByEmail(email) {\n    const user = await userCollection.findOne({ email });\n    if (!user)\n        return null;\n    return user;\n}\nexports.GetUserByEmail = GetUserByEmail;\n// GetUsers\nasync function GetUsers() {\n    const users = await userCollection.find({}).toArray();\n    if (!users.length)\n        return null;\n    return users;\n}\nexports.GetUsers = GetUsers;\n// Create User\nasync function CreateUser(name, email, password, role) {\n    // Make object dynamic depending on role\n    const hashedPassword = await bcrypt_1.default.hash(password, 10);\n    const userCreated = await userCollection.insertOne({\n        name,\n        email,\n        password: hashedPassword,\n        role,\n    });\n    return userCreated;\n}\nexports.CreateUser = CreateUser;\n// UpdateUser\nasync function UpdateUser(userId, updateData) {\n    const userUpdated = await userCollection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $set: updateData });\n    const { acknowledged, modifiedCount } = userUpdated;\n    if (!acknowledged && modifiedCount === 0)\n        return false;\n    return true;\n}\nexports.UpdateUser = UpdateUser;\n// DeleteUser\nasync function DeleteUser(userId) {\n    const userDeleted = await userCollection.deleteOne({\n        _id: new mongodb_1.ObjectId(userId),\n    });\n    return userDeleted.acknowledged;\n}\nexports.DeleteUser = DeleteUser;\n\n\n//# sourceURL=webpack://atiyeh_holdings/./src/repos/users.ts?");

/***/ }),

/***/ "./src/routes/auth.ts":
/*!****************************!*\
  !*** ./src/routes/auth.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst bcrypt_1 = __importDefault(__webpack_require__(/*! bcrypt */ \"bcrypt\"));\nconst jsonwebtoken_1 = __importDefault(__webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\"));\nconst users_1 = __webpack_require__(/*! ../repos/users */ \"./src/repos/users.ts\");\n__webpack_require__(/*! dotenv/config */ \"dotenv/config\");\nconst AuthRoutes = express_1.default.Router();\nAuthRoutes.use(express_1.default.json());\n// Login route\nAuthRoutes.post(\"/login\", async (req, res) => {\n    const { email, password } = req.body;\n    try {\n        const user = await (0, users_1.GetUserByEmail)(email);\n        if (!user) {\n            return res.status(401).json({ error: \"Invalid email or password\" });\n        }\n        if (user.password && (await bcrypt_1.default.compare(password, user.password))) {\n            const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;\n            const accessToken = jsonwebtoken_1.default.sign({ email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });\n            res.cookie(\"accessToken\", accessToken, {\n                maxAge: 900000,\n                httpOnly: true,\n            });\n            return res.status(200).json({ userId: user._id });\n        }\n        else {\n            return res.status(401).json({ error: \"Invalid email or password\" });\n        }\n    }\n    catch (error) {\n        return res.status(500).json({ error });\n    }\n});\n// Logout\n// Refresh Token\nexports[\"default\"] = AuthRoutes;\n\n\n//# sourceURL=webpack://atiyeh_holdings/./src/routes/auth.ts?");

/***/ }),

/***/ "./src/routes/users.ts":
/*!*****************************!*\
  !*** ./src/routes/users.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst users_1 = __webpack_require__(/*! ../repos/users */ \"./src/repos/users.ts\");\nconst UserRoutes = express_1.default.Router();\nUserRoutes.use(express_1.default.json());\nUserRoutes.get(\"/\", async (_req, res) => {\n    const users = await (0, users_1.GetUsers)();\n    if (!users)\n        return res.status(404).json({ message: \"No users found\" });\n    const returnUsers = users.map((user) => delete user.password);\n    return res.status(200).json({ users: returnUsers });\n});\nUserRoutes.post(\"/\", async (req, res) => {\n    const { name, email, password, role } = req.body;\n    if (!email || !password || !name) {\n        return res\n            .status(400)\n            .json({ message: \"Name, email, and password are required\" });\n    }\n    try {\n        const existingUser = await (0, users_1.GetUserByEmail)(email);\n        if (existingUser) {\n            return res.status(400).json({ error: \"Username already exists\" });\n        }\n        const user = await (0, users_1.CreateUser)(name, email, password, role);\n        if (!user.acknowledged)\n            return res.status(500).json({ message: \"Error creating user\" });\n        return res.status(201).json({ userId: user.insertedId.toString() });\n    }\n    catch (error) {\n        return res.status(500).json({ message: \"User not created\", error });\n    }\n});\nUserRoutes.route(\"/:userId\")\n    .get(async (req, res) => {\n    try {\n        const user = await (0, users_1.GetUserById)(req.params.userId);\n        if (!user)\n            return res.status(404).json({ message: \"User not found\" });\n        delete user.password;\n        return res.status(200).json({ user });\n    }\n    catch (error) {\n        return res.status(500).json({ message: \"Couldn't get user\", error });\n    }\n})\n    .put(async (req, res) => {\n    try {\n        const userUpdated = await (0, users_1.UpdateUser)(req.params.userId, req.body.updateData);\n        if (!userUpdated)\n            return res.status(400).json({ message: \"Error updating user\" });\n        return res.status(200).json({ message: \"User updated successfully\" });\n    }\n    catch (error) {\n        return res.status(500).json({ message: \"User not updated\", error });\n    }\n})\n    .delete(async (req, res) => {\n    try {\n        const userDeleted = await (0, users_1.DeleteUser)(req.params.userId);\n        if (!userDeleted)\n            return res.status(400).json({ message: \"User not deleted\" });\n        return res.status(200).json({ message: \"User deleted successfully\" });\n    }\n    catch (error) {\n        return res.status(500).json({ message: \"User not deleted\", error });\n    }\n});\nexports[\"default\"] = UserRoutes;\n\n\n//# sourceURL=webpack://atiyeh_holdings/./src/routes/users.ts?");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "dotenv/config":
/*!********************************!*\
  !*** external "dotenv/config" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ "tspec":
/*!************************!*\
  !*** external "tspec" ***!
  \************************/
/***/ ((module) => {

module.exports = require("tspec");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;