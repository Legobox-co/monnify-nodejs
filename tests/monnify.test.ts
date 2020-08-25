require('dotenv').config()
import Monnify from "../src/index"


describe("test monnify service", () => {
    let monnifyService: Monnify;
    monnifyService = new Monnify()
    let accountNo: string | null = null
    // beforeAll(() => {
    // })

    it("Test the authentication", async () => {
        // let monifyService = new Monnify
        try{
            let response = await monnifyService.authenticate()
            console.log(response)
        }catch(e){
            console.log(e.message)
        }
    })

    it("Test that we can reserve accounts", async (done) => {
        // let monifyService = new Monnify
        try{
            let response = await monnifyService.reserveAccount({
                "accountRef": "somedubub2386y",
                "accountName": "Spincrow/@Chibuike",
                "clientEmail": "mozart@legobox.io",
                "clientName": "Chibuike Emmanuel Osita"
            })
            console.log(response)
            if(response.requestSuccessful == true){
                accountNo = response.responseBody.accountNumber
            }
            done()
        }catch(e){
            console.log(e.message)
            done()
        }
    })

    it("should be able to delete account no", async (done) => {
        // let monifyService = new Monnify
        try{
            if(accountNo){
                let response = await monnifyService.deleteReservedAccount(accountNo)
                console.log(response)
                done()
            }else{
                throw new Error("account number wasn't created")
            }
        }catch(e){
            console.log(e.message)
            done()
        }
    })
})