/**
 * The monnify service
 * This class is meant to perform the following.
 * 
 * Create reserved bank accounts for the wallets of the users
 * Setup webhook jobs which would run when a transaction is being processed.
 * Provide service to call monnity to confirm funds acceptance.
 */
require('dotenv').config()
import moment from "moment"
import  axios, * as Axios from "axios"
import crypto from "crypto"
import sha512 from "js-sha512"

export default class MonnifyService {
    // Private key setting up
    private apiKey: String  
    private apiSecret: String 
    private apiURL: String 
    private expiryDate: Date | null;
    private apiToken: String | null = null
    private apiAxiosClient: Axios.AxiosInstance 

    constructor(){
        // this.authenticate()
        console.log( process.env.MONNIFY_PRODUCTION, process.env.MONNIFY_API_KEY_TEST)
        this.apiKey = process.env.MONNIFY_PRODUCTION == 'true' ? process.env.MONNIFY_API_KEY : process.env.MONNIFY_API_KEY_TEST; 
        this.apiSecret = process.env.MONNIFY_PRODUCTION == 'true' ? process.env.MONNIFY_API_SECRET : process.env.MONNIFY_API_SECRET_TEST; 
        this.apiURL = process.env.MONNIFY_PRODUCTION == 'true' ? process.env.MONNIFY_URL : process.env.MONNIFY_URL_TEST; 
        this.apiAxiosClient= axios.create({
            baseURL: process.env.MONNIFY_PRODUCTION == 'true' ? process.env.MONNIFY_URL : process.env.MONNIFY_URL_TEST
        })

    }

    private timeExpired(){
        if(this.expiryDate){
            return (new Date()) > this.expiryDate 
        }else{
            return true
        }
    }

    public async authenticate () {
        // authenticate into monnify
        let authString = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString("base64")
        try {
            let response = await this.apiAxiosClient.post('/api/v1/auth/login', {}, {
                headers: {
                    "Authorization": `Basic ${authString}`
                }
            })
            // console.log(response.data)
            this.apiToken = response.data.responseBody.accessToken
            this.expiryDate = moment().add(response.data.responseBody.expiresIn, 'seconds').toDate();
            return response.data;
        }catch(e){
            throw e
        }
    }

    // Let's reserve a cool account no
    public async send({ url, method, data = {}, headers = {}}: { url: string; method: Axios.Method; data: object; headers: object }) {
        try {
            // a call function to create the 
            if(this.apiToken && !this.timeExpired()) {
                // make the api call
                let response = await this.apiAxiosClient(url, {
                    method: method,
                    data: data,
                    headers: {
                        ...headers,
                        Authorization: `Bearer ${this.apiToken}`
                    }
                })
                return response
            }else{
                // authenticate and then make the call
                await this.authenticate()
                let response = await this.apiAxiosClient(url, {
                    method: method,
                    data: data,
                    headers: {
                        ...headers,
                        Authorization: `Bearer ${this.apiToken}`
                    }
                })
                return response
            }
        } catch (e) {
            throw e
        }
    }

    /**
     * Reserve account numbers through monnify
     * @param param0 
     */
    public async reserveAccount({
        accountRef, accountName, clientEmail, clientName
    }:
    {
        accountRef: string,
        accountName: string,
        clientEmail: string,
        clientName: string
    }
    ){
        try {
            let response = await this.send({
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
            })
            if(response){
                return response.data
            }
        } catch (e) {
            throw e
        }
    }

    /**
     * Delete the reserved account no
     * @param accountNo 
     */
    public async deleteReservedAccount(accountNo: string){
        try {
            let response = await this.send({
                url: `/api/v1/bank-transfer/reserved-accounts/${accountNo}`,
                method: "DELETE",
                data: {},
                headers: {}
            })
            if(response){
                return response.data
            }
        } catch (e) {
            throw e
        }
    }

    public generateTransactionHash(hashString: string){
        const generator = sha512.sha512(hashString)
        return generator
    }
}
