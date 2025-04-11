public with sharing class editMultipleWorkPerformedRecords {

    // Method to get Work Performed Records
    @AuraEnabled(cacheable=true)
    public static List<ozbeellc__Work_Performed__c> getWorkRecordsForWorkOrder(Id workOrderId) {
        // Check Read access on the object
        if (!Schema.sObjectType.ozbeellc__Work_Performed__c.isAccessible()) {
            throw new AuraHandledException('You do not have access to view Work Performed records.');
        }

        return [
            SELECT Id, Status__c, Type__c, ozbeellc__Location__c, ozbeellc__Quantity__c, ozbeellc__Deficiency__c
            FROM ozbeellc__Work_Performed__c
            WHERE ozbeellc__Work_Order__c = :workOrderId
        ];
    }

    // Method to upsert Multiple Work Performed Records
    @AuraEnabled
    public static void saveWorkPerformedRecords(List<ozbeellc__Work_Performed__c> records) {
        if (!Schema.sObjectType.ozbeellc__Work_Performed__c.isUpdateable()) {
            throw new AuraHandledException('You do not have permission to update Work Performed records.');
        }

        // Optional: Check field-level access (Status__c specifically)
        // We assume you're only editing Status__c from the UI.
        if (!Schema.sObjectType.ozbeellc__Work_Performed__c.fields.Status__c.isUpdateable()) {
            throw new AuraHandledException('You do not have permission to update the Status field.');
        }

        try {
            update records; // Don't use upsert unless you're also creating records
        } catch (Exception e) {
            throw new AuraHandledException('Error: ' + e.getMessage());
        }
    }
}
