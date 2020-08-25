# Monnify Integration library for nodejs
> A cool library for working with monnify
> for more information take a look at monnify's docs [click here](https://confluence.teamapt.com/display/MON/Monnify+API+Docs)

## Getting started
To install
First of all you have to set the following from your monnify account.
```env
# MONNIFY SUPPORT
MONNIFY_PRODUCTION=false
MONNIFY_API_KEY_TEST=
MONNIFY_API_SECRET_TEST=
MONNIFY_API_KEY=
MONNIFY_API_SECRET=

MONNIFY_URL_TEST=https://sandbox.monnify.com
MONNIFY_URL=https://api.monnify.com

MONNIFY_CONTRACT_CODE=
```
Then you can install the package with the command.
```shell
npm i @legobox/monnify-nodejs
```

## How to use
At the moment these are the following functions provided by the module.

### Authenticate
Authenticate with the monnify api.
```
import Monnify from "@legobox/monnify-nodejs
let monnifyService = new Monnify()

const autheticateWithMonnify = async () => {
    let response = await monnifyService.authenticate();
}
```

All internal functions of the service already use the authenticate method to perform calls to any of the operations so, you don't have to call it again.

### Reserve Account no
Reserve an account no for a customer.
```
import Monnify from "@legobox/monnify-nodejs
let monnifyService = new Monnify()

const reserveAccountWithMonnify = async () => {
    try{
        let response = await monnifyService.reserveAccount({
            "accountRef": "yourAccountReference",
            "accountName": "YourAccountName",
            "clientEmail": "user@email.com",
            "clientName": "YourClientName"
        });
    }catch(e){
        // handle your errors here
    }
}
```

### Delete a Reserved account no
Reserve an account no for a customer.
```
import Monnify from "@legobox/monnify-nodejs
let monnifyService = new Monnify()

const deleteAccountWithMonnify = async (accountNo: string) => {
    try{
        let response = await monnifyService.deleteReservedAccount(accountNo);
    }catch(e){
        // handle your errors here
    }
}
```
## Conclusion.
This module is still under active development
