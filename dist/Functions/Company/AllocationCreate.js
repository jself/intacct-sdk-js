"use strict";
/**
 * @module Intacct/SDK/Functions/Company
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractAllocation_1 = require("./AbstractAllocation");
class AllocationCreate extends AbstractAllocation_1.default {
    writeXml(xml) {
        xml.writeStartElement("function");
        xml.writeAttribute("controlid", this.controlId, true);
        xml.writeStartElement("create");
        xml.writeStartElement("ALLOCATION");
        xml.writeElement("ALLOCATIONID", this.allocationId, true);
        xml.writeElement("TYPE", this.allocationBy, true);
        xml.writeElement("DESCRIPTION", this.description);
        xml.writeElement("DOCNUMBER", this.documentNo);
        xml.writeElement("SUPDOCID", this.attachmentsId);
        if (this.active === true) {
            xml.writeElement("STATUS", "active");
        }
        else if (this.active === false) {
            xml.writeElement("STATUS", "inactive");
        }
        if (this.lines != null && this.lines.length > 0) {
            xml.writeStartElement("ALLOCATIONENTRIES");
            for (const line of this.lines) {
                line.writeXml(xml);
            }
            xml.writeEndElement(); // ALLOCATIONENTRIES
        }
        xml.writeEndElement(); // ALLOCATION
        xml.writeEndElement(); // create
        xml.writeEndElement(); // function
    }
}
exports.default = AllocationCreate;
//# sourceMappingURL=AllocationCreate.js.map