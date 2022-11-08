/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        core module
File Name              :        due-diligence-questionnaire.response.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        23/01/2020
Description            :        mock data for due diligence questionnaire
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

export const respQuestionnaire = [
    {
      'questionid': 'q1',
      'questiontext': 'What is the anticipated Annual Gross Revenue for the business?',
      'answertype': 'Text',
      'textanswer': '',
      'category': 'Account',
      'visible': true,
      'answers': [
        {

        }
      ]
    },
    {
      'questionid': 'q2',
      'questiontext': 'Does the Business make cash deposits or withdrawals?',
      'answertype': 'Single',
      'category': 'Account',
      'visible': true,
      'answers': [
        {
          'optiontext': 'Yes',
          'selected': false
        },
        {
          'optiontext': 'No',
          'selected': false
        }
      ]
    },
    {
      'questionid': 'q3',
      'questiontext': 'What is the anticipated monthly average of Cash Deposits?',
      'parentqueid': 'q2',
      'category': 'Account',
      'answertype': 'Single',
      'visible': false,
      'answers': [
        {
          'optiontext': '$1-$10,000',
          'selected': false
        },
        {
          'optiontext': '$10,001-$100,000',
          'selected': false
        },
        {
          'optiontext': '$100,001 and above',
          'selected': false
        }
      ]
    },
    {
      'questionid': 'q4',
      'questiontext': 'What is the anticipated monthly average of Cash Withdrawals?',
      'parentqueid': 'q2',
      'answertype': 'Multi',
      'category': 'Account',
      'visible': false,
      'answers': [
        {
          'optiontext': '$1-$10,000',
          'selected': false
        },
        {
          'optiontext': '$10,001-$100,000',
          'selected': false
        },
        {
          'optiontext': '$100,001 and above',
          'selected': false
        }
      ]
    },
    {
      'questionid': 'q5',
      'questiontext': 'Does the Business plan on performing wire transactions?',
      'answertype': 'Single',
      'category': 'Account',
      'visible': true,
      'answers': [
        {
          'optiontext': 'Yes',
          'selected': false
        },
        {
          'optiontext': 'No',
          'selected': false
        }
      ]
    },
    {
      'questionid': 'q6',
      'questiontext': 'What is the anticipated monthly average of incoming domestic wires?',
      'parentqueid': 'q5',
      'answertype': 'Single',
      'category': 'Account',
      'visible': false,
      'answers': [
        {
          'optiontext': '$1-$10,000',
          'selected': false
        },
        {
          'optiontext': '$10,001-$100,000',
          'selected': false
        },
        {
          'optiontext': '$100,001 and above',
          'selected': false
        }
      ]
    },
    {
      'questionid': 'q7',
      'questiontext': 'What is the anticipated monthly average of outgoing domestic wires?',
      'parentqueid': 'q5',
      'answertype': 'Single',
      'category': 'Account',
      'visible': false,
      'answers': [
        {
          'optiontext': '$1-$10,000',
          'selected': false
        },
        {
          'optiontext': '$10,001-$100,000',
          'selected': false
        },
        {
          'optiontext': '$100,001 and above',
          'selected': false
        }
      ]
    },
    {
      'questionid': 'q8',
      'questiontext': 'What is the anticipated monthly average of incoming foreign wires?',
      'parentqueid': 'q5',
      'answertype': 'Single',
      'category': 'Account',
      'visible': false,
      'answers': [
        {
          'optiontext': '$1-$10,000',
          'selected': false
        },
        {
          'optiontext': '$10,001-$100,000',
          'selected': false
        },
        {
          'optiontext': '$100,001 and above',
          'selected': false
        }
      ]
    },
    {
      'questionid': 'q9',
      'questiontext': 'What is the anticipated monthly average of outgoing foreign wires?',
      'parentqueid': 'q5',
      'answertype': 'Single',
      'category': 'Account',
      'visible': false,
      'answers': [
        {
          'optiontext': '$1-$10,000',
          'selected': false
        },
        {
          'optiontext': '$10,001-$100,000',
          'selected': false
        },
        {
          'optiontext': '$100,001 and above',
          'selected': false
        }
      ]
    },
    {
      'questionid': 'q10',
      'questiontext': 'Does the Business authorize ACH Transactions?',
      'answertype': 'Single',
      'category': 'Account',
      'visible': true,
      'answers': [
        {
          'optiontext': 'Yes',
          'selected': false
        },
        {
          'optiontext': 'No',
          'selected': false
        }
      ]
    },
    {
      'questionid': 'q11',
      'questiontext': 'What is the anticipated monthly average of Incoming ACH transactions?',
      'parentqueid': 'q10',
      'answertype': 'Single',
      'category': 'Account',
      'visible': false,
      'answers': [
        {
          'optiontext': '$1-$10,000',
          'selected': false
        },
        {
          'optiontext': '$10,001-$100,000',
          'selected': false
        },
        {
          'optiontext': '$100,001 and above',
          'selected': false
        }
      ]
    },
    {
      'questionid': 'q12',
      'questiontext': 'What is the anticipated monthly average of outgoing ACH transactions?',
      'parentqueid': 'q10',
      'answertype': 'Single',
      'category': 'Account',
      'visible': false,
      'answers': [
        {
          'optiontext': '$1-$10,000',
          'selected': false
        },
        {
          'optiontext': '$10,001-$100,000',
          'selected': false
        },
        {
          'optiontext': '$100,001 and above',
          'selected': false
        }
      ]
    },
    {
      'questionid': 'q13',
      'questiontext': 'What is the anticipated monthly average of Check Deposits?',
      'parentqueid': 'q10',
      'answertype': 'Single',
      'category': 'Account',
      'visible': false,
      'answers': [
        {
          'optiontext': '$1-$10,000',
          'selected': false
        },
        {
          'optiontext': '$10,001-$100,000',
          'selected': false
        },
        {
          'optiontext': '$100,001 and above',
          'selected': false
        }
      ]
    },
    {
      'questionid': 'q14',
      'questiontext': 'What is the anticipated monthly average of Check withdrawals?',
      'parentqueid': 'q10',
      'answertype': 'Single',
      'category': 'Account',
      'visible': false,
      'answers': [
        {
          'optiontext': '$1-$10,000',
          'selected': false
        },
        {
          'optiontext': '$10,001-$100,000',
          'selected': false
        },
        {
          'optiontext': '$100,001 and above',
          'selected': false
        }
      ]
    }
  ];
