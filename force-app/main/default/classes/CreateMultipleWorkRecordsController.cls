public with sharing class CreateMultipleWorkRecordsController {
// Method to insert multiple Work_Performed__c records
@AuraEnabled(cacheable=false)
    public static ResponseWrapper saveMultipleWorkRecords(List<ozbeellc__Work_Performed__c> work) {
        ResponseWrapper response = new ResponseWrapper();
        try {
            if (work != null && !work.isEmpty()) {
                insert work;
                response.isSuccess = true;
                response.message = 'Records inserted successfully.';
            } else {
                response.isSuccess = false;
                response.message = 'No work records provided.';
            }
        } catch (Exception e) {
            response.isSuccess = false;
            response.message = 'Insert failed: ' + e.getMessage();
        }
        return response;
    }

    // Method to get picklist values for 'Type__c'
    @AuraEnabled(cacheable=true)
    public static List<String> getTypePicklistValues() {
        List<String> values = new List<String>();
        // Get the describe result for the 'Type__c' field
        Schema.DescribeFieldResult fieldResult = ozbeellc__Work_Performed__c.Type__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry entry : ple) {
            // Only add active picklist values
            if (entry.isActive()) {
                values.add(entry.getLabel());
            }
        }
        return values;
    }

    // Wrapper class to return success/failure status and message
    public class ResponseWrapper {
        @AuraEnabled public Boolean isSuccess { get; set; }
        @AuraEnabled public String message { get; set; }
    }
}