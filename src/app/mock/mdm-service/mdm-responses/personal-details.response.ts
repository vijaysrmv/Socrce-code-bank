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

import { Title, Suffix, Gender, EmploymentStatus, LearnAboutUs, States, OccupancyStatus, IncomeSource, Year, Month } from '../../../core/models/fields-value.model';


export const respTitle = <Array<Title>>[
    { id: 'MRS', description: 'MRS' },
    { id: 'MR', description: 'MR' },
    { id: 'MS', description: 'MS' },
    { id: 'DR', description: 'DR' },
    { id: 'REV', description: 'REV' }
];

export const respSuffix = <Array<Suffix>>[
    { id: 'JR', description: 'JR' },
    { id: 'SR', description: 'SR' },
    { id: 'DDS', description: 'DDS' },
    { id: 'MD', description: 'MD' },
    { id: 'PHD', description: 'PHD' },
    // { id: 'I', description: 'I' },
    { id: 'II', description: 'II' },
    { id: 'III', description: 'III' },
    { id: 'IV', description: 'IV' },
    { id: 'V', description: 'V' },
    // { id: 'VI', description: 'VI' },
    // { id: 'VII', description: 'VII' },
    // { id: 'VIII', description: 'VIII' }
];

export const respGender = <Array<Gender>>[
    { id: 'Male', description: 'Male' },
    { id: 'Female', description: 'Female' },
    { id: 'Other', description: 'Other' },
    { id: 'I do not wish to provide this information', description: 'I do not wish to provide this information' }
];

export const respEmploymentStatus = <Array<EmploymentStatus>>[
    { id: 'Employed', value: 'Employed' },
    { id: 'Retired', value: 'Retired' },
    { id: 'Self employed', value: 'Self employed' },
    { id: 'Student', value: 'Student' },
    { id: 'Unemployed', value: 'Unemployed' }
];

export const respFilteredEmploymentStatus = <Array<EmploymentStatus>>[
    { id: 'Employed', value: 'Employed' },
    { id: 'Self employed', value: 'Self employed' },
];

export const respLearnAboutUs = <Array<LearnAboutUs>>[
    { id: 'socialmedia', value: 'Social Media' },
    { id: 'coworker', value: 'Co-worker' },
    { id: 'family', value: 'Family Member' },
    { id: 'enrollment', value: 'Open Enrollment/Benefit Meeting' },
    { id: 'directmail', value: 'Direct Mail' },
    { id: 'printadvertisement', value: 'Print Advertisement' },
    { id: 'radio', value: 'Radio' },
    { id: 'television', value: 'Television' },
    { id: 'billboard', value: 'Billboard' },
    { id: 'conlocation', value: 'Convenient Location' },
    { id: 'notice', value: 'Work Notice/Newsletter' },
    { id: 'onlineadvertisement', value: 'Online Advertisement' },
    { id: 'website', value: 'Newgen Website' },
    { id: 'autodealer', value: 'Auto Dealer' },
    { id: 'other', value: 'Other' }
];

export const respOccupancyStatus = <Array<OccupancyStatus>>[
    { id: 'rent', description: 'Rent' },
    { id: 'own', description: 'Own' }
];

export const respIncomeSource = <Array<IncomeSource>>[
    { id: 'ssi', value: 'SSI' },
    { id: 'rentalincome', value: 'Rental Income' },
    { id: 'dividendsinvestments', value: 'Dividends/Investments' },
    { id: 'pera', value: 'PERA' },
    { id: '401k', value: '401K' },
    { id: 'iraannuities', value: 'IRA/Annuities' }
];

export const respStates = <Array<States>>[
    {
        'statename': 'Alabama',
        'statecode': 'AL'
    }, {
        'statename': 'Alaska',
        'statecode': 'AK'
    }, {
        'statename': 'American Samoa',
        'statecode': 'AS'
    }, {
        'statename': 'Arizona',
        'statecode': 'AZ'
    }, {
        'statename': 'Arkansas',
        'statecode': 'AR'
    }, {
        'statename': 'California',
        'statecode': 'CA'
    }, {
        'statename': 'Colorado',
        'statecode': 'CO'
    }, {
        'statename': 'Connecticut',
        'statecode': 'CT'
    }, {
        'statename': 'Delaware',
        'statecode': 'DE'
    }, {
        'statename': 'District Of Columbia',
        'statecode': 'DC'
    }, {
        'statename': 'Federated States Of Micronesia',
        'statecode': 'FM'
    }, {
        'statename': 'Florida',
        'statecode': 'FL'
    }, {
        'statename': 'Georgia',
        'statecode': 'GA'
    }, {
        'statename': 'Guam',
        'statecode': 'GU'
    }, {
        'statename': 'Hawaii',
        'statecode': 'HI'
    }, {
        'statename': 'Idaho',
        'statecode': 'ID'
    }, {
        'statename': 'Illinois',
        'statecode': 'IL'
    }, {
        'statename': 'Indiana',
        'statecode': 'IN'
    }, {
        'statename': 'Iowa',
        'statecode': 'IA'
    }, {
        'statename': 'Kansas',
        'statecode': 'KS'
    }, {
        'statename': 'Kentucky',
        'statecode': 'KY'
    }, {
        'statename': 'Louisiana',
        'statecode': 'LA'
    }, {
        'statename': 'Maine',
        'statecode': 'ME'
    }, {
        'statename': 'Marshall Islands',
        'statecode': 'MH'
    }, {
        'statename': 'Maryland',
        'statecode': 'MD'
    }, {
        'statename': 'Massachusetts',
        'statecode': 'MA'
    }, {
        'statename': 'Michigan',
        'statecode': 'MI'
    }, {
        'statename': 'Minnesota',
        'statecode': 'MN'
    }, {
        'statename': 'Mississippi',
        'statecode': 'MS'
    }, {
        'statename': 'Missouri',
        'statecode': 'MO'
    }, {
        'statename': 'Montana',
        'statecode': 'MT'
    }, {
        'statename': 'Nebraska',
        'statecode': 'NE'
    }, {
        'statename': 'Nevada',
        'statecode': 'NV'
    }, {
        'statename': 'New Hampshire',
        'statecode': 'NH'
    }, {
        'statename': 'New Jersey',
        'statecode': 'NJ'
    }, {
        'statename': 'New Mexico',
        'statecode': 'NM'
    }, {
        'statename': 'New York',
        'statecode': 'NY'
    }, {
        'statename': 'North Carolina',
        'statecode': 'NC'
    }, {
        'statename': 'North Dakota',
        'statecode': 'ND'
    }, {
        'statename': 'Northern Mariana Islands',
        'statecode': 'MP'
    }, {
        'statename': 'Ohio',
        'statecode': 'OH'
    }, {
        'statename': 'Oklahoma',
        'statecode': 'OK'
    }, {
        'statename': 'Oregon',
        'statecode': 'OR'
    }, {
        'statename': 'Palau',
        'statecode': 'PW'
    }, {
        'statename': 'Pennsylvania',
        'statecode': 'PA'
    }, {
        'statename': 'Puerto Rico',
        'statecode': 'PR'
    }, {
        'statename': 'Rhode Island',
        'statecode': 'RI'
    }, {
        'statename': 'South Carolina',
        'statecode': 'SC'
    }, {
        'statename': 'South Dakota',
        'statecode': 'SD'
    }, {
        'statename': 'Tennessee',
        'statecode': 'TN'
    }, {
        'statename': 'Texas',
        'statecode': 'TX'
    }, {
        'statename': 'Utah',
        'statecode': 'UT'
    }, {
        'statename': 'Vermont',
        'statecode': 'VT'
    }, {
        'statename': 'Virgin Islands',
        'statecode': 'VI'
    }, {
        'statename': 'Virginia',
        'statecode': 'VA'
    }, {
        'statename': 'Washington',
        'statecode': 'WA'
    }, {
        'statename': 'West Virginia',
        'statecode': 'WV'
    }, {
        'statename': 'Wisconsin',
        'statecode': 'WI'
    }, {
        'statename': 'Wyoming',
        'statecode': 'WY'
    }
];

// export const respCountry = <Array<CountryOfCitizenship>> [
//     { id: 'country1', description: 'Country 1'},
//     { id: 'country2', description: 'Country 2'},
//     { id: 'country3', description: 'Country 3'}
// ];

export const respYear = <Array<Year>>[
    { id: '0', description: '0' },
    { id: '1', description: '1' },
    { id: '2', description: '2' },
    { id: '3', description: '3' },
    { id: '4', description: '4' },
    { id: '>5', description: '>5' }
];

export const respMonth = <Array<Month>>[
    { id: '0', description: '0' },
    { id: '1', description: '1' },
    { id: '2', description: '2' },
    { id: '3', description: '3' },
    { id: '4', description: '4' },
    { id: '5', description: '5' },
    { id: '6', description: '6' },
    { id: '7', description: '7' },
    { id: '8', description: '8' },
    { id: '9', description: '9' },
    { id: '10', description: '10' },
    { id: '11', description: '11' },
];
