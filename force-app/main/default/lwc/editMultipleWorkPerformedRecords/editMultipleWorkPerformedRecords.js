import { LightningElement, api, track, wire } from 'lwc';
import { getRecords } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveWorkPerformedRecords from '@salesforce/apex/editMultipleWorkPerformedRecords.saveWorkPerformedRecords'; // Assuming Apex method to save work records

export default class EditMultipleWorkPerformedRecords extends LightningElement {
    @track workRecords = [];
    @api recordIds; // Array of record IDs to be edited
    error;

    @wire(getRecords, { recordIds: '$recordIds' })
    wiredRecords({ error, data }) {
        if (data) {
            this.workRecords = data.records;
        } else if (error) {
            this.error = error;
            this.showToast('Error', 'Unable to retrieve work records.', 'error');
        }
    }

    handleUploadFinished(event) {
        const recordId = event.target.recordId;
        const uploadedFiles = event.detail.files;

        // Logic to associate the uploaded file with the corresponding work record
        const workRecord = this.workRecords.find(record => record.id === recordId);
        if (workRecord) {
            workRecord.imageUrl = uploadedFiles.map(file => file.documentId); // Store image reference
        }
    }

    handleMassUpdate() {
        const updatedRecords = this.workRecords.map(record => ({
            Id: record.id,
            Status__c: record.Status__c,
            Type__c: record.Type__c,
            ozbeellc__Location__c: record.ozbeellc__Location__c,
            ozbeellc__Quantity__c: record.ozbeellc__Quantity__c,
            ozbeellc__Deficiency__c: record.ozbeellc__Deficiency__c,
            imageUrl: record.imageUrl,
        }));

        saveWorkPerformedRecords({ records: updatedRecords })
            .then(result => {
                this.showToast('Success', 'Work records updated successfully!', 'success');
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    onSuccess(event) {
        this.showToast('Success', 'Work record updated successfully!', 'success');
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    dismiss() {
        // Logic to close the modal or navigate away
        window.history.back();
    }
}