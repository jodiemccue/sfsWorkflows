public with sharing class editMultipleWorkPerformedRecords {
    @AuraEnabled(cacheable=false)
    public static void saveWorkPerformedRecords(List<ozbeellc__Work_Performed__c> records) {
        try {
            upsert records;
        } catch (Exception e) {
            throw new AuraHandledException('Error: ' + e.getMessage());
        }
    }
}