import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getWorkRecordsForWorkOrder from '@salesforce/apex/editMultipleWorkPerformedRecords.getWorkRecordsForWorkOrder';
import saveWorkPerformedRecords from '@salesforce/apex/editMultipleWorkPerformedRecords.saveWorkPerformedRecords'; // Assuming Apex method to save work records

export default class EditMultipleWorkPerformedRecords extends LightningElement {
    @api recordId; // This should be the ID of the Work Order
    @track workRecords = [];
    error;
    
    get workOrderId() {
        return this.recordId;
    }

    set workOrderId(value) {
        this.recordId = value;
        if (value) {
            this.loadWorkRecords();
        }
    }

    connectedCallback() {
        this.loadWorkRecords();
    }

    loadWorkRecords() {
        getWorkRecordsForWorkOrder({ workOrderId: this.recordId })
            .then(result => {
                this.workRecords = result;
            })
            .catch(error => {
                this.error = error;
                this.showToast('Error', 'Unable to retrieve work records.', 'error');
            });
    }

    handleMassUpdate() {
        const updatedRecords = this.workRecords.map(record => ({
            Id: record.Id,
            Status__c: record.Status__c
        }));

        saveWorkPerformedRecords({ records: updatedRecords })
            .then(() => {
                this.showToast('Success', 'Work records updated successfully!', 'success');
                this.loadWorkRecords(); // Refresh list after save
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    onSuccess(event) {
        this.showToast('Success', 'Work record updated successfully!', 'success');
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(event);
    }

    dismiss() {
        window.history.back(); // Close or navigate away
    }
}