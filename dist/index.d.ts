import * as Axios from "axios";
export default class MonnifyService {
    private apiKey;
    private apiSecret;
    private apiURL;
    private expiryDate;
    private apiToken;
    private apiAxiosClient;
    constructor();
    private timeExpired;
    authenticate(): Promise<any>;
    send({ url, method, data, headers }: {
        url: string;
        method: Axios.Method;
        data: object;
        headers: object;
    }): Promise<Axios.AxiosResponse<any>>;
    /**
     * Reserve account numbers through monnify
     * @param param0
     */
    reserveAccount({ accountRef, accountName, clientEmail, clientName }: {
        accountRef: string;
        accountName: string;
        clientEmail: string;
        clientName: string;
    }): Promise<any>;
    /**
     * Delete the reserved account no
     * @param accountNo
     */
    deleteReservedAccount(accountNo: string): Promise<any>;
}
