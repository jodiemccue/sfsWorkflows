import { LightningElement, track, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import WORK_OBJECT from '@salesforce/schema/ozbeellc__Work_Performed__c';
import TYPE_FIELD from  '@salesforce/schema/ozbeellc__Work_Performed__c.Type__c';

export default class CreateMultipleWorkRecords extends LightningElement {

@track work = [];

    @wire(getObjectInfo, { objectApiName: WORK_OBJECT })
    workObjectInfo;

    @wire(getPicklistValues, { recordTypeId:'$workobjectInfo.data.defaultRecordTypeId', fieldApiName: TYPE_FIELD })
    typePicklistValues; 

    get getTypePicklistValues() {
        return this.typePicklistValues?.data?.values;
    }

    connectedCallback() {
        this.addNewClickHandler();
        }    

    addNewClickHandler(event) {
    this.work.push({
        tempId: Date.now()
    })
        
    }
}