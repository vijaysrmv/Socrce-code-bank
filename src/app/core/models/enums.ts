/*--------------------------------------------------------------------------------------------------------
				NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        core
File Name              :        enums.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :        06/09/2019
Description            :        enums for various purposes
-------------------------------------------------------------------------------------------------------
				CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


export enum PRODUCTLIST {
	primarySavings = 'Primary Share Saving',
	secondarySavings = 'Secondary Share Saving',
	FreeCheckings = 'Standard Free Checking',
	PremierChecking = 'Premier Checking',
	PremierPlusChecking = 'Premier Plus Checking',
	TeenAccount = 'Teens "N" Charge Account',
	WorryFreeChecking = 'Worry Free Checking',
	PrimarySaving = 'Primary Savings',
	SecondarySaving = 'Secondary Savings',
	HolidaySaving = 'Holiday Savings',
	YouthSaving = 'Youth Savings',
	MoneyMarket = 'IMMP (Insured Money Market Plus)',
	MoneyManage = 'IMMF (Insured Money Management Fund)',
	MoneyMarketSavings = 'Money Market Savings',
	'CertificateOfDeposits-90days' = 'Certificate Of Deposits - 90 days',
	'CertificateOfDeposits-90daysAddOn' = 'Certificate Of Deposits - 90 days Add-On',
	'CertificateOfDeposits-6months' = 'Certificate Of Deposits - 6 months',
	'CertificateOfDeposits-6monthsAddOn' = 'Certificate Of Deposits - 6 months Add-On',
	'CertificateOfDeposits-12months' = 'Certificate Of Deposits - 12 months',
	'CertificateOfDeposits-18months' = 'Certificate Of Deposits - 18 months',
	'CertificateOfDeposits-24months' = 'Certificate Of Deposits - 24 days',
	'CertificateOfDeposits-36months' = 'Certificate Of Deposits - 36 months',
	'CertificateOfDeposits-48months' = 'Certificate Of Deposits - 48 months',
	'CertificateOfDeposits-60months' = 'Certificate Of Deposits - 60 months',
	FreeBusinessChecking = 'Free Business Checking',
	BusinessSavings = 'Business Savings',
	BusinessLoyaltyMoneyMarketSavings = 'Business Loyalty Money Market Savings',
	'share_01' = 'share saving',
	'premier_checking_03' = 'premier checking',
	'holiday_account_04' = 'holiday account',
}

export enum IDSCAN_ID_TYPES {
	'DL' = 'DRIVER_LICENSE',
	'PS' = 'PASSPORT',
	'ST' = 'STATE_ID',
	'OTHERS' = 'OTHERS'
}

export enum UPLOAD_ID_TYPES {
	'DL' = 'Drivers License',
	'PS' = 'Passport',
	'ST' = 'State ID',
	'OTHERS' = 'OTHERS'
}

export enum BACKEND_ID_TYPES {
	'Drivers License' = 'DL',
	'Passport' = 'PS',
	'State ID' = 'ST',
	'OTHERS' = 'OTHERS'
}

export enum UI_STATE {
	'getting-started' = 'gettingStarted',
	'select-product' = 'selectProduct',
	'personal-details' = 'personalInfo',
	'joint-details' = 'jointInfo',
	'beneficiary-details' = 'beneficiaryInfo',
	'responsible-details' = 'responsibleInfo',
	'additional-responsible-details' = 'additionalResponsibleInfo',
	'authorizer-details' = 'authorizerInfo',
	'business-details' = 'businessInfo',
	'additional-business-details' = 'additionalBusinessInfo',
	'review' = 'review',
	'disclosure' = 'servicesOffered',
	'upload-documents' = 'documentUpload',
	// 'due-diligence-questionnaire' = 'additionalDetails',
	'due-diligence-questionnaire' = 'consumerDueDiligence',
	'account-funding' = 'accountFunding'
}

export enum ACCOUNT_TYPE {
	'consumer-deposit' = 'consumerDeposit',
	'business-deposit' = 'businessDeposit',
}

export enum BACKEND_ACCOUNT {
	'consumerDeposit' = 'consumer-deposit',
	'businessDeposit' = 'business-deposit',
}

export enum APPLICANT_TYPE {
	'businessApplicant' = 'INDIVIDUAL',
	'consumerPrimary' = 'PRIMARY',
	'consumerJoint' = 'JOINT',
}

export enum APPLICATION_TYPE {
	// 'consumerDeposit' = 'Deposit',
	// 'businessDeposit' = 'Small Business Deposit',
	'consumerDeposit' = 'Consumer Deposit',
	'businessDeposit' = 'Business Deposit',
}

export enum BACKEND_STATE {
	'gettingStarted' = 'getting-started',
	'selectProduct' = 'select-product',
	'personalInfo' = 'personal-details',
	'jointInfo' = 'joint-details',
	'beneficiaryInfo' = 'beneficiary-details',
	'review' = 'review',
	'responsibleInfo' = 'responsible-details',
	'additionalResponsibleInfo' = 'additional-responsible-details',
	'businessInfo' = 'business-details',
	'additionalBusinessInfo' = 'additional-business-details',
	'authorizerInfo' = 'authorizer-details',
	'servicesOffered' = 'disclosure',
	'documentUpload' = 'upload-documents',
	'consumerDueDiligence' = 'due-diligence-questionnaire',
	// 'additionalDetails' = 'due-diligence-questionnaire',
	'accountFunding' = 'account-funding',
	'success' = 'finish/success',
	'applicationCompleted' = 'finish/success',
	'fundingInprogress' = 'finish/funding-inprogress',
	'MDInProgress' = 'account-funding',
	'FundingLocked' = 'finish/funding-locked',
	'achInProgress' = 'funding/ach-inprogress',
	'referred' = 'finish/review',
	'declined' = 'finish/denied',
	'declinedQualifile' = 'finish/denied-qualifile',
	'saveAndExit' = 'finish/save-exit',
	'additionalSignPending' = 'finish/additional-sign-pending',
	'documentUploadSuccess' = 'finish/document-upload-success',
	'documentUploadExit' = 'finish/document-upload-exit',
}

export enum IBPS_STATUS {
	'PENDING' = 'Pending',
	'PENDING_SUBMISSION' = 'Pending Submission',
	'HOLD' = 'Hold',
	'PENDING_ACCEPTANCE' = 'Pending Acceptance',
	'PENDING_DOCSIGN' = 'Pending Docusign',
	'PENDING_FUNDING' = 'Pending Funding',
	'PENDING_REVIEW' = 'Pending Review',
	'SUBMIT_FAILED' = 'Submit Failed',
	'INSTANT_DECLINED' = 'Instant Declined',
	'OPERATIONS_DECLINED' = 'Operations Declined',
	'CANCELLED' = 'Cancelled',
	'DISCARDED' = 'Discarded',
	'COMPLETED' = 'Completed',
	'ADDITIONAL_DOCUSIGN_PENDING' = 'Additional Docusign Pending',
	'DOCUSIGN_DECLINE' = 'Docusign Decline',
	'IN_PROCESSING' = 'In Processing',
	'COUNTER_OFFER' = 'Counter Offer',
	'PENDING_DISBURSEMENT' = 'Pending Disbursement',
	'COMMUNICATION_HOLD' = 'Pending Documents',
	'EXCEPTION' = 'Exception Occurred'
}

export enum SUFFIX {
	'JR' = 'Junior',
	'SR' = 'Senior',
	'DDS' = 'Doctor of Dental Surgery',
	'MD' = 'Doctor of Medicine',
	'PHD' = 'Doctor of Philosophy',
	// 'I' = 'First',
	'II' = 'Second',
	'III' = 'Third',
	'IV' = 'Fourth',
	'V' = 'Fifth',
	// 'VI' = 'Sixth',
	// 'VII' = 'Seventh',
	// 'VIII' = 'Eighth'
}

export enum TITLE {
	'MRS' = 'Mistress',
	'MR' = 'Mister',
	'MS' = 'Miss',
	'DR' = 'Doctor',
	'REV' = 'Reverend'
}

export enum ELAVON_RESPONSE {
	APPROVAL = 'APPROVAL',
	DECLINED = 'DECLINED',
	ERROR = 'ERROR'
}

export enum EMPLOYER_FIELD_NAME {
	'EMPLOYED' = 'Employer Name',
	'RETIRED' = 'Previous Employer',
	'SELF EMPLOYED' = 'Business Name',
	'STUDENT' = 'Student',
	'UNEMPLOYED' = 'Unemployed',
	'MINOR' = 'Minor'
}

export enum OCCUPATION_FIELD_NAME {
	'EMPLOYED' = 'Occupation/Title',
	'RETIRED' = 'Previous Occupation',
	'SELF EMPLOYED' = 'Nature of Business',
	'STUDENT' = 'Student',
	'UNEMPLOYED' = 'Previous Occupation',
	'MINOR' = 'Minor'
}

export enum EMPLOYER_STATUS_VALUE {
	'EMPLOYED' = 'Employed',
	'RETIRED' = 'Retired',
	'SELF EMPLOYED' = 'Self Employed',
	'STUDENT' = 'Student',
	'UNEMPLOYED' = 'Unemployed',
	'MINOR' = 'Minor'
}

export enum OCCUPATION_STATUS_VALUE {
	'EMPLOYED' = 'Employed',
	'RETIRED' = 'Retired',
	'SELF EMPLOYED' = 'Self Employed',
	'STUDENT' = 'Student',
	'UNEMPLOYED' = 'Unemployed',
	'MINOR' = 'Minor'
}
