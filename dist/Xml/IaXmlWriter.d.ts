/// <reference types="xmlbuilder" />
import { XMLElementOrXMLNode } from "xmlbuilder";
export default class IaXmlWriter {
    static readonly intacctDateFormat: string;
    static readonly intacctDateTimeFormat: string;
    static readonly intacctMultiSelectGlue: string;
    private _writer;
    constructor(xml: XMLElementOrXMLNode);
    flush(pretty?: boolean): string;
    writeStartElement(localName: string): void;
    writeEndElement(): void;
    writeElement(localName: string, value: any, writeNull?: boolean): void;
    writeElementDate(localName: string, value: Date, format?: string, writeNull?: boolean): void;
    writeAttribute(localName: string, value: any, writeNull?: boolean): void;
    writeDateSplitElements(date: Date, writeNull?: boolean): void;
    writeCustomFieldsExplicit(customFields: Array<[string, any]>): void;
    writeCustomFieldsImplicit(customFields: Array<[string, any]>): void;
}
