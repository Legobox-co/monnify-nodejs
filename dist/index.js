"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The monnify service
 * This class is meant to perform the following.
 *
 * Create reserved bank accounts for the wallets of the users
 * Setup webhook jobs which would run when a transaction is being processed.
 * Provide service to call monnity to confirm funds acceptance.
 */
require('dotenv').config();
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
class MonnifyService {
    constructor() {
        this.apiToken = null;
        // this.authenticate()
        console.log(process.env.MONNIFY_PRODUCTION, process.env.MONNIFY_API_KEY_TEST);
        this.apiKey = process.env.MONNIFY_PRODUCTION == 'true' ? process.env.MONNIFY_API_KEY : process.env.MONNIFY_API_KEY_TEST;
        this.apiSecret = process.env.MONNIFY_PRODUCTION == 'true' ? process.env.MONNIFY_API_SECRET : process.env.MONNIFY_API_SECRET_TEST;
        this.apiURL = process.env.MONNIFY_PRODUCTION == 'true' ? process.env.MONNIFY_URL : process.env.MONNIFY_URL_TEST;
        this.apiAxiosClient = axios_1.default.create({
            baseURL: process.env.MONNIFY_PRODUCTION == 'true' ? process.env.MONNIFY_URL : process.env.MONNIFY_URL_TEST
        });
    }
    timeExpired() {
        if (this.expiryDate) {
            return (new Date()) > this.expiryDate;
        }
        else {
            return true;
        }
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            // authenticate into monnify
            let authString = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString("base64");
            try {
                let response = yield this.apiAxiosClient.post('/api/v1/auth/login', {}, {
                    headers: {
                        "Authorization": `Basic ${authString}`
                    }
                });
                // console.log(response.data)
                this.apiToken = response.data.responseBody.accessToken;
                this.expiryDate = moment_1.default().add(response.data.responseBody.expiresIn, 'seconds').toDate();
                return response.data;
            }
            catch (e) {
                throw e;
            }
        });
    }
    // Let's reserve a cool account no
    send({ url, method, data = {}, headers = {} }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // a call function to create the 
                if (this.apiToken && !this.timeExpired()) {
                    // make the api call
                    let response = yield this.apiAxiosClient(url, {
                        method: method,
                        data: data,
                        headers: Object.assign({}, headers, { Authorization: `Bearer ${this.apiToken}` })
                    });
                    return response;
                }
                else {
                    // authenticate and then make the call
                    yield this.authenticate();
                    let response = yield this.apiAxiosClient(url, {
                        method: method,
                        data: data,
                        headers: Object.assign({}, headers, { Authorization: `Bearer ${this.apiToken}` })
                    });
                    return response;
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    /**
     * Reserve account numbers through monnify
     * @param param0
     */
    reserveAccount({ accountRef, accountName, clientEmail, clientName }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this.send({
                    url: "/api/v1/bank-transfer/reserved-accounts",
                    method: "POST",
                    data: {
                        "accountReference": accountRef,
                        "accountName": accountName,
                        "currencyCode": "NGN",
                        "contractCode": process.env.MONNIFY_CONTRACT_CODE,
                        "customerEmail": clientEmail,
                        "customerName": clientName
                    },
                    headers: {}
                });
                if (response) {
                    return response.data;
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    /**
     * Delete the reserved account no
     * @param accountNo
     */
    deleteReservedAccount(accountNo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this.send({
                    url: `/api/v1/bank-transfer/reserved-accounts/${accountNo}`,
                    method: "DELETE",
                    data: {},
                    headers: {}
                });
                if (response) {
                    return response.data;
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.default = MonnifyService;
