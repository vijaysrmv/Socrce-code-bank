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

import { Relationship } from '../../../core/models/fields-value.model';

export const respRelationship = <Array<Relationship>>[
    { id: 1, value: 'Brother'},
    { id: 2, value: 'Sister'},
    { id: 3, value: 'Parent'},
    { id: 4, value: 'Spouse'},
    { id: 5, value: 'Cousin'},
    { id: 6, value: 'Child'},
    { id: 7, value: 'Grandchild'},
    { id: 8, value: 'Grandparent'},
    { id: 9, value: 'Stepchild'}
];
