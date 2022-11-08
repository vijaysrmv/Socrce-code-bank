/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        errorList.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        13/08/2018
Description            :        This file contains enum for error messages used throughout the application
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

export enum ERRORLIST {
	"ERR-1000" = "Something went wrong. Please try again later.",
	"ERR-1001" = "Please save or discard these changes",
	"ERR-1002" = "Error sending OTP. Please try again later.",
	"ERR-1003" = "Incorrect OTP. Please try again later.",
	"ERR-1004" = "We notice that you have an application in progress. To resume your application, please click continue.",
	"ERR-1005" = "Please verify you have accepted all required terms and conditions.",
	"ERR-1006" = "Please provide an identification document.",
	"ERR-1007" = "Please note that you have already selected the maximum number of allowed products.",
	"ERR-1008" = "Browser back button has been disabled for security reasons.",
	"ERR-1009" = "Page refresh has been disabled for security reasons.",
	"ERR-1010" = "Overdraft disclosure must be selected before proceeding to next step.",
	"ERR-1011" = "Please add an applicant who is 55 years or older. This is a mandatory requirement for opening a <b>Senior Checking account</b>.",
	"ERR-1012" = "Your request for funding could not be processed. Please try again.",
	"ERR-1013" = "You have exceeded maximum number of attempts. Please contact the bank to proceed.",
	"ERR-1014" = "Please verify the information provided before proceeding back.",
	"ERR-1015" = "Please enter required details in identification section.",
	"ERR-1016" = "We are unable to prefill the application with the provided document. Please verify if the uploaded document is valid.",
	"ERR-1017" = "Insufficient data. You cannot resume this application.",
	"ERR-1018" = "Health Saving Account (HSA) product can have maximum 2 joints. Please delete a joint to proceed.",
	"ERR-2001" = "Malformed Request = User Id is Null or Empty",
	"ERR-2003" = "ARN mismatch found in request header and request Body",
	"ERR-2002" = "Error converting object to AddressValidateResponse",
	"ERR-2004" = "Image data to be extracted not found.",
	"ERR-2005" = "We are unable to extract information with the provided document. Please try using another document or type your information below.",
	"ERR-2006" = "The ip is blocked",
	"ERR-2007" = "Request is not valid to access this API",
	"ERR-2008" = "This call is suppose to generate the token but ARN not found in response header",
	"ERR-2009" = "Please check proxy configuration specified in application.yml",
	"ERR-2014" = "Token is invalid",
	"ERR-2015" = "Validations failed for the following property paths: {0}",
	"ERR-2016" = "ARN does not exist in system",
	"ERR-2017" = "Application already exists with the data provided. Kindly resume your application.",
	"ERR-2018" = "Customer is restricted",
	"ERR-2019" = "No Product Ids found for this arn.",
	"ERR-2020" = "Account Type is invalid.",
	"ERR-2021" = "Invalid UI State",
	"ERR-2022" = "The verification code you entered has expired and is no longer valid. Please request a new verification code or contact us at 000-000-1234.",
	"ERR-2023" = "Primary signer not found",
	"ERR-2024" = "Application pdf generation failed for some reason.",
	"ERR-2025" = "Invalid data",
	"ERR-2026" = "The information you entered does not match what we have on file. Please check the information you entered and try again.",
	"ERR-2027" = "Token has been expired",
	"ERR-2028" = "OTP is expired",
	"ERR-2029" = "Not allowed to create new application",
	"ERR-2030" = "Your application is currently locked by a user at the bank. Please try again after some time.",
	"ERR-2031" = "Unable to create application in ibps",
	"ERR-2032" = "Exception occured during review processing",
	"ERR-2033" = "Checkout amount is less than mimimum checkout amount",
	"ERR-2034" = "Could not fetch data from MDM",
	"ERR-2035" = "Unable to create in bridge api",
	"ERR-2036" = "Unable to create card in bridge api",
	"ERR-2037" = "Unable to send the welcome email",
	"ERR-2038" = "Unable to send the mail to ACH",
	"ERR-2039" = "Unable to send the mail to WireRequest",
	"ERR-2040" = "Invalid date of birth exception",
	"ERR-2041" = "Token does not exists in the header.",
	"ERR-2042" = "Could not generate hash from String",
	"ERR-2043" = "Hashcode does not match to the existing user",
	"ERR-2044" = "Please enter a valid Zip Code.",
	"ERR-2045" = "You cannot select Teen N Charge Account as you have already selected Youth Savings Account.",
	"ERR-2046" = "You cannot select Youth Savings Account as you have already selected Teen N Charge Account.",
	"ERR-2047" = "You do not have any checking product with your account.",
	"ERR-2088" = "Applicant is not existing customer of Citizen Community Federal Bank.",
	"ERR-2089" = "Your application is currently locked by a user at the bank. Please try again after some time.",
	"ERR-2085" = "Link for OTP is invalid. Please generate new link.",
	"ERR-2157" = "Mandatory documents need to be uploaded before proceeding further.",
	"ERR-2158" = "Too many verification attempts. Please try any other funding method.",
	"ERR-2159" = "Incorrect Funding details.",
	"ERR-3000" = "The total funding amount you have entered exceeds the one time Debit/Credit Card transaction limit. Please enter a lower funding amount.",
	"ERR-3001" = "The total funding amount you have entered exceeds the one time Internal Funding limit. Please enter a lower funding amount.",
	"ERR-3002" = "The total funding amount you have entered exceeds the one time ACH transaction limit. Please enter a lower funding amount.",
	"ERR-3003" = "The total funding amount you have entered exceeds the one time transaction limit. Please enter a lower funding amount.",
	"ERR-3004" = "The total funding amount you have entered exceeds the one time Wire transaction limit. Please enter a lower funding amount.",
	"ERR-3005" = "The total funding amount you have entered exceeds the one time Check transaction limit. Please enter a lower funding amount.",
}
