"use strict";
/**
 * @module Intacct/SDK/Functions/AccountsReceivable
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractInvoiceLine_1 = require("./AbstractInvoiceLine");
class InvoiceLineUpdate extends AbstractInvoiceLine_1.default {
    writeXml(xml) {
        xml.writeStartElement("updatelineitem");
        xml.writeAttribute("line_num", this.lineNo, true);
        if (this.accountLabel != null) {
            xml.writeElement("accountlabel", this.accountLabel);
        }
        else if (this.glAccountNumber != null) {
            xml.writeElement("glaccountno", this.glAccountNumber);
        }
        xml.writeElement("offsetglaccountno", this.offsetGlAccountNumber);
        xml.writeElement("amount", this.transactionAmount);
        xml.writeElement("allocationid", this.allocationId);
        xml.writeElement("memo", this.memo);
        xml.writeElement("locationid", this.locationId);
        xml.writeElement("departmentid", this.departmentId);
        xml.writeElement("key", this.key);
        xml.writeElement("totalpaid", this.totalPaid);
        xml.writeElement("totaldue", this.totalDue);
        xml.writeCustomFieldsExplicit(this.customFields);
        xml.writeElement("revrectemplate", this.revRecTemplateId);
        xml.writeElement("defrevaccount", this.deferredRevGlAccountNo);
        if (this.revRecStartDate != null) {
            xml.writeStartElement("revrecstartdate");
            xml.writeDateSplitElements(this.revRecStartDate);
            xml.writeEndElement(); // revrecstartdate
        }
        if (this.revRecEndDate != null) {
            xml.writeStartElement("revrecenddate");
            xml.writeDateSplitElements(this.revRecEndDate);
            xml.writeEndElement(); // revrecenddate
        }
        xml.writeElement("projectid", this.projectId);
        xml.writeElement("customerid", this.customerId);
        xml.writeElement("vendorid", this.vendorId);
        xml.writeElement("employeeid", this.employeeId);
        xml.writeElement("itemid", this.itemId);
        xml.writeElement("classid", this.classId);
        xml.writeElement("contractid", this.contractId);
        xml.writeElement("warehouseid", this.warehouseId);
        xml.writeEndElement(); // updatelineitem
    }
}
exports.default = InvoiceLineUpdate;
//# sourceMappingURL=InvoiceLineUpdate.js.map