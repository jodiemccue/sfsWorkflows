import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveMultipleWorkRecords from '@salesforce/apex/CreateMultipleWorkRecordsController.saveMultipleWorkRecords';
import { CloseActionScreenEvent } from 'lightning/actions';
import getPicklistValues from '@salesforce/apex/CreateMultipleWorkRecordsController.getTypePicklistValues';

import DEFICIENCY_NAME from '@salesforce/schema/ozbeellc__Deficiency__c.Name';
import DEFICIENCY_DESCRIPTION from '@salesforce/schema/ozbeellc__Deficiency__c.ozbeellc__Description__c';
import DEFICIENCY_Id from '@salesforce/schema/ozbeellc__Deficiency__c.Id';
const DEFICIENCY_FIELD_LIST = [DEFICIENCY_NAME, DEFICIENCY_DESCRIPTION, DEFICIENCY_Id];

export default class CreateMultipleWorkRecords extends LightningElement {
    @api recordId;
    @api deficiencyId;
    @track work = [];
    @track typeOptions = [];


    connectedCallback() {
        this.fetchPicklistValues();
        this.addRow();
    }

    deficiencyId
    get showDeficiency() {
        return this.deficiencyId != null;
    }

    @wire(getRecord, { recordId: '$deficiencyId', fields: DEFICIENCY_FIELD_LIST })
        deficiencyDetail;

        displayInfo = {
            primaryField: 'Name',
            additionalFields: ['ozbeellc__Description__c'],
        };
        matchingInfo = {
            primaryField: {fieldPath: 'Name'}
        };
        get deficiencyName() {
            return getFieldValue(this.deficiencyDetail.data, DEFICIENCY_NAME);
        }

        get deficiencyDescription() {
            return getFieldValue(this.deficiencyDetail.data, DEFICIENCY_DESCRIPTION);
        }

    async fetchPicklistValues() {
        try {
            const result = await getPicklistValues();
            this.typeOptions = result.map(val => ({ label: val, value: val }));
        } catch (error) {
            this.showToast('Failed to load Type picklist values', 'Error', 'error');
        }
    }

    addRow() {
        this.work = [
            ...this.work,
            {
                tempId: Date.now(),
                Type__c: '',
                ozbeellc__Location__c: '',
                ozbeellc__Quantity__c: null,
                Man_Hours_To_Repair__c: null,
                ozbeellc__Deficiency__c: this.deficiencyId || null
            }
        ];
    }

    deleteRow(event) {
        const tempId = event.target.dataset.tempId;
        this.work = this.work.filter(row => row.tempId != tempId);
    }

    elementChangeHandler(event) {
        const tempId = event.target.dataset.tempId;
        const fieldName = event.target.dataset.field;
        const value = event.detail?.recordId || event.target.value;
        
        const workRow = this.work.find(item => item.tempId == tempId);

        if (workRow && fieldName) {
            workRow[fieldName] = value;
            console.log('Updated work row:', workRow);
        }
    }

    checkControlsValidity() {
        let isValid = true;
        this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-record-picker')
            .forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    isValid = false;
                }
            });
        return isValid;
    }

    async submitClickHandler() {
        if (this.checkControlsValidity()) {
            this.work.forEach(item => {
                item.ozbeellc__Work_Order__c = this.recordId;
            });

            try {
                const response = await saveMultipleWorkRecords({ work: this.work });
                if (response.isSuccess) {
                    this.showToast('Work Records Created Successfully', 'Success', 'success');
                    this.dispatchEvent(new CloseActionScreenEvent());
                } else {
                    this.showToast('Error: ' + response.message, 'Error', 'error');
                }
            } catch (error) {
                this.showToast('Unexpected Error: ' + (error.body?.message || error.message), 'Error', 'error');
            }
        } else {
            this.showToast('Please fill out all required fields.', 'Error', 'error');
        }
    }

    showToast(message, title = 'Notification', variant = 'info') {
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        }));
    }
}