/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        prevent-events.directive.spec.ts
Author                 :        Prince Kakkar
Date (DD/MM/YYYY)      :        18/09/2018
Description            :        Test file for prevent-events.directive.ts
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { PreventEventsDirective } from './prevent-events.directive';

describe('PreventEventsDirective', () => {
    it('should create an instance', () => {
        const directive = new PreventEventsDirective();
        expect(directive).toBeTruthy();
    });
});
