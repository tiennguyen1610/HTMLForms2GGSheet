//Exact name with sheet name google sheet
const sheetName = 'Sheet1'
const scriptProp = PropertiesService.getScriptProperties()

function intialSetup() {
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost(e) {
    const lock = LockService.getScriptLock()
    lock.tryLock(10000)

    try {
        const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
        const sheet = doc.getSheetByName(sheetName)

        /*When add more field need add param in the line code bellow
            Example:
            Form contact include field:
            - Name
            - Phone
            - Address
            - Message
            Please note name of the field exact with attribute name of form HTML
            *Note: the first colum is Date will get date from system
            const headers = sheet.getRange(1, 1, 1, 1, 1, sheet.getLastColumn()).getValues()[0]
        */
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
        const nextRow = sheet.getLastRow() + 1

        const newRow = headers.map(function (header) {
            return header === 'Date' ? new Date() : e.parameter[header]
        })

        //The same like getValues
        //sheet.getRange(nextRow, 1, 1, 1, 1, 1 newRow.length).setValues([newRow])
        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
            .setMimeType(ContentService.MimeType.JSON)
    }

    catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
            .setMimeType(ContentService.MimeType.JSON)
    }

    finally {
        lock.releaseLock()
    }
}