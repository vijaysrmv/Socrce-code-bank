/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :
File Name              :
Author                 :
Date (DD/MM/YYYY)      :
Description            :
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

export const respOtp = {
    hashcode: 'sample hashcode'
};

export const respValidateOtp = {
    arninfo: [
        {
            accounttype: 'consumer-deposit',
            applicationstate: 'personal-details',
            arn: '772486f8-a45a-a605-0d9d-14b1626e253b',
            createdon: '11/23/2018',
            lastmodifiedon: '12/15/2018',
            products: ['PremierChecking'],
            uistate: 'personalInfo',
        }
    ],
    firstname: 'amir',
    lastname: 'masood'
};

export const respUniqueness = {
    message: 'success'
};


export const respApplication = {
    isolb: true,
    jointcustomerexists: false,
    customerexists: false,
    arn: 'F532DD93-4840-4F68-BE97-87C446405437',
    accounttype: '',
    applicationtype: 'consumerDeposit',
    products: [
        {
            productid: 'share_01'
        },
        {
            productid: 'insured_money_11'
        },
        {
            productid: 'standard_checking_08'
        },
        {
            productid: 'premier_checking_03'
        },
        {
            productid: 'premier_plus_checking_05'
        }
    ],
    personaldetails: {
        extension: '',
        pid: 1,
        applicanttype: 'primary',
        title: '',
        firstname: 'amir',
        middlename: '',
        lastname: 'testa',
        primaryphonenumber: '4045049006',
        phonetype: 'mobile',
        email: 'amir@test.com',
        preferredcontact: 'mobile',
        dob: '03/18/2011',
        suffix: '',
        ssn: '899-01-0001',
        gender: 'Female',
        uscitizen: true,
        country: 'US',
        mothermaiden: 'fdgfdg',
        address: [
            {
                pid: 1,
                country: 'US',
                addresstype: 'physicalAddress',
                zipcode: '30326',
                numberandstreet: '100 acorn',
                aptorsuite: '',
                city: 'ATLANTA',
                state: 'GA'
            },
            {
                pid: 1,
                country: 'US',
                addresstype: 'mailingAddress',
                zipcode: '30326',
                numberandstreet: '100 acorn',
                aptorsuite: '',
                city: 'ATLANTA',
                state: 'GA'
            }
        ],
        identification: {
            insertionorderid: '1122',
            type: 'MC/OT',
            number: '23423423',
            issuestate: 'AR',
            issuedate: '04/01/2019',
            expirydate: '04/29/2019'
        },
        employment: {
            employmentstatus: 1,
            employername: 'dfsdsdf',
            occupation: 'vcv',
            incomelist: [
                {
                    grossmonthlyincome: 23423
                }
            ]
        },
        mailingsameasphysical: true,
        addresssameasprimary: false
    },
    jointdetails: [],
    qualifications: {
        qualificationtype: 'gov',
        zipcode: '',
        collegetype: '',
        otherselection: ''
    },
    uistate: 'review',
    updateuistate: false,
    iscustomerexists: false,
    isjointcustomerexists: false,
};
