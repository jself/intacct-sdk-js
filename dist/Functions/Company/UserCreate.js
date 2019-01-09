"use strict";
/**
 * @module Intacct/SDK/Functions/Company
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractUser_1 = require("./AbstractUser");
class UserCreate extends AbstractUser_1.default {
    writeXml(xml) {
        xml.writeStartElement("function");
        xml.writeAttribute("controlid", this.controlId, true);
        xml.writeStartElement("create");
        xml.writeStartElement("USERINFO");
        xml.writeElement("LOGINID", this.userId, true);
        xml.writeElement("USERTYPE", this.userType, true);
        xml.writeStartElement("CONTACTINFO");
        xml.writeElement("LASTNAME", this.lastName);
        xml.writeElement("FIRSTNAME", this.firstName);
        xml.writeElement("EMAIL1", this.primaryEmailAddress);
        xml.writeElement("CONTACTNAME", this.contactName);
        xml.writeEndElement(); // CONTACTINFO
        xml.writeElement("DESCRIPTION", this.userName);
        if (this.active === true) {
            xml.writeElement("STATUS", "active");
        }
        else if (this.active === false) {
            xml.writeElement("STATUS", "inactive");
        }
        xml.writeElement("LOGINDISABLED", this.webServicesOnly);
        xml.writeElement("SSO_ENABLED", this.ssoEnabled);
        xml.writeElement("SSO_FEDERATED_ID", this.ssoFederatedId);
        if (this.restrictedEntities != null && this.restrictedEntities.length > 0) {
            for (const entity of this.restrictedEntities) {
                xml.writeStartElement("USERLOCATIONS");
                xml.writeElement("LOCATIONID", entity);
                xml.writeEndElement(); // USERLOCATIONS
            }
        }
        if (this.restrictedDepartments != null && this.restrictedDepartments.length > 0) {
            for (const department of this.restrictedDepartments) {
                xml.writeStartElement("USERDEPARTMENTS");
                xml.writeElement("DEPARTMENTID", department);
                xml.writeEndElement(); // USERDEPARTMENTS
            }
        }
        xml.writeCustomFieldsImplicit(this.customFields);
        xml.writeEndElement(); // USERINFO
        xml.writeEndElement(); // create
        xml.writeEndElement(); // function
    }
}
exports.default = UserCreate;
//# sourceMappingURL=UserCreate.js.map