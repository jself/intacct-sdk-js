/**
 * Copyright 2018 Sage Intacct, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "LICENSE" file accompanying this file. This file is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import * as chai from "chai";
import * as nock from "nock";
import {StatusCodeError} from "request-promise-native/errors";
import * as winston from "winston";
import ClientConfig from "../../src/ClientConfig";
import ApiSessionCreate from "../../src/Functions/ApiSessionCreate";
import RequestConfig from "../../src/RequestConfig";
import OfflineResponse from "../../src/Xml/OfflineResponse";
import OnlineResponse from "../../src/Xml/OnlineResponse";
import RequestHandler from "../../src/Xml/RequestHandler";

describe("RequestHandler", () => {
    before((done) => {
        return done();
    });
    beforeEach((done) => {
        return done();
    });
    afterEach((done) => {
        return done();
    });
    after((done) => {
        return done();
    });
    it("should return an OnlineResponse", async () => {
        const xml = `<?xml version="1.0" encoding="utf-8" ?>
<response>
      <control>
            <status>success</status>
            <senderid>testsenderid</senderid>
            <controlid>requestUnitTest</controlid>
            <uniqueid>false</uniqueid>
            <dtdversion>3.0</dtdversion>
      </control>
      <operation>
            <authentication>
                  <status>success</status>
                  <userid>testuser</userid>
                  <companyid>testcompany</companyid>
                  <locationid></locationid>
                  <sessiontimestamp>2015-12-06T15:57:08-08:00</sessiontimestamp>
            </authentication>
            <result>
                  <status>success</status>
                  <function>getAPISession</function>
                  <controlid>func1UnitTest</controlid>
                  <data>
                        <api>
                              <sessionid>unittest..</sessionid>
                              <endpoint>https://unittest.intacct.com/ia/xml/xmlgw.phtml</endpoint>
                              <locationid></locationid>
                        </api>
                  </data>
            </result>
      </operation>
</response>`;

        const headers = {
            "Content-Type": 'text/xml; encoding="UTF-8"',
        };

        nock.disableNetConnect();
        nock("https://api.intacct.com")
            .replyContentLength()
            .post("/ia/xml/xmlgw.phtml")
            .reply(200, xml, headers);

        const config = new ClientConfig();
        config.senderId = "testsenderid";
        config.senderPassword = "pass123!";
        config.sessionId = "testsession..";

        const requestConfig = new RequestConfig();
        requestConfig.controlId = "unittest";

        const contentBlock = new ApiSessionCreate();

        const requestHandler = new RequestHandler(config, requestConfig);
        const response = await requestHandler.executeOnline([contentBlock]);

        chai.assert.instanceOf(response, OnlineResponse);
    });
    it("should return an OfflineResponse", async () => {
        const xml = `<?xml version="1.0" encoding="utf-8" ?>
<response>
      <acknowledgement>
            <status>success</status>
      </acknowledgement>
      <control>
            <status>success</status>
            <senderid>testsenderid</senderid>
            <controlid>requestUnitTest</controlid>
            <uniqueid>false</uniqueid>
            <dtdversion>3.0</dtdversion>
      </control>
</response>`;

        const headers = {
            "Content-Type": 'text/xml; encoding="UTF-8"',
        };

        nock.disableNetConnect();
        nock("https://api.intacct.com")
            .replyContentLength()
            .post("/ia/xml/xmlgw.phtml")
            .reply(200, xml, headers);

        const config = new ClientConfig();
        config.senderId = "testsenderid";
        config.senderPassword = "pass123!";
        config.sessionId = "testsession..";

        const requestConfig = new RequestConfig();
        requestConfig.policyId = "policyid123";
        requestConfig.controlId = "requestUnitTest";

        const contentBlock = new ApiSessionCreate();

        const requestHandler = new RequestHandler(config, requestConfig);
        const response = await requestHandler.executeOffline([contentBlock]);

        chai.assert.instanceOf(response, OfflineResponse);
    });
    it("should throw exception when policyid is not included for offline request", async () => {
        const config = new ClientConfig();
        config.senderId = "testsenderid";
        config.senderPassword = "pass123!";
        config.sessionId = "testsession..";

        const requestConfig = new RequestConfig();
        requestConfig.controlId = "requestUnitTest";

        const contentBlock = [
            new ApiSessionCreate(),
        ];

        const requestHandler = new RequestHandler(config, requestConfig);
        try {
            await requestHandler.executeOffline(contentBlock);
            chai.assert.isOk(false, "Expected exception not thrown");
        } catch (ex) {
            chai.assert.instanceOf(ex, Error);
            chai.assert.equal(ex.message, "Required Policy ID not supplied in config for offline request");
        }
    });
    it("should return an OnlineResponse after a retry", async () => {
        const xml = `<?xml version="1.0" encoding="utf-8" ?>
<response>
      <control>
            <status>success</status>
            <senderid>testsenderid</senderid>
            <controlid>sessionProvider</controlid>
            <uniqueid>false</uniqueid>
            <dtdversion>3.0</dtdversion>
      </control>
      <operation>
            <authentication>
                  <status>success</status>
                  <userid>testuser</userid>
                  <companyid>testcompany</companyid>
                  <locationid></locationid>
                  <sessiontimestamp>2015-12-06T15:57:08-08:00</sessiontimestamp>
            </authentication>
            <result>
                  <status>success</status>
                  <function>getAPISession</function>
                  <controlid>func1UnitTest</controlid>
                  <data>
                        <api>
                              <sessionid>unittest..</sessionid>
                              <endpoint>https://unittest.intacct.com/ia/xml/xmlgw.phtml</endpoint>
                              <locationid></locationid>
                        </api>
                  </data>
            </result>
      </operation>
</response>`;

        const headers = {
            "Content-Type": 'text/xml; encoding="UTF-8"',
        };

        nock.disableNetConnect();
        nock("https://api.intacct.com")
            .replyContentLength()
            .post("/ia/xml/xmlgw.phtml")
            .reply(502);
        nock("https://api.intacct.com")
            .replyContentLength()
            .post("/ia/xml/xmlgw.phtml")
            .reply(200, xml, headers);

        const config = new ClientConfig();
        config.senderId = "testsenderid";
        config.senderPassword = "pass123!";
        config.sessionId = "testsession..";

        const requestConfig = new RequestConfig();

        const contentBlock = [
            new ApiSessionCreate(),
        ];

        const requestHandler = new RequestHandler(config, requestConfig);
        const response = await requestHandler.executeOnline(contentBlock);
        chai.assert.equal(response.control.senderId, "testsenderid");
    }).timeout(3000); // Increase the timeout for the retry test
    it("should error after multiple retries", async () => {
        nock.disableNetConnect();
        nock("https://api.intacct.com")
            .replyContentLength()
            .post("/ia/xml/xmlgw.phtml")
            .once()
            .reply(503);
        nock("https://api.intacct.com")
            .replyContentLength()
            .post("/ia/xml/xmlgw.phtml")
            .once()
            .reply(503);
        nock("https://api.intacct.com")
            .replyContentLength()
            .post("/ia/xml/xmlgw.phtml")
            .once()
            .reply(503);

        const config = new ClientConfig();
        config.senderId = "testsenderid";
        config.senderPassword = "pass123!";
        config.sessionId = "fAkESesSiOnId..";

        const requestConfig = new RequestConfig();
        requestConfig.maxRetries = 2;

        const contentBlock = [
            new ApiSessionCreate(),
        ];

        const requestHandler = new RequestHandler(config, requestConfig);
        try {
            await requestHandler.executeOnline(contentBlock);
            chai.assert.isOk(false, "Expected exception not thrown");
        } catch (ex) {
            chai.assert.instanceOf(ex, StatusCodeError);
            chai.assert.equal(ex.message, "503 - \"\"");
        }
    }).timeout(3000);
    it("should throw exception for 524 server error", async () => {
        nock.disableNetConnect();
        nock("https://api.intacct.com")
            .replyContentLength()
            .post("/ia/xml/xmlgw.phtml")
            .once()
            .reply(524);

        const config = new ClientConfig();
        config.senderId = "testsenderid";
        config.senderPassword = "pass123!";
        config.sessionId = "testsession..";

        const requestConfig = new RequestConfig();

        const contentBlock = [
            new ApiSessionCreate(),
        ];

        const requestHandler = new RequestHandler(config, requestConfig);

        try {
            await requestHandler.executeOnline(contentBlock);
            chai.assert.isOk(false, "Expected exception not thrown");
        } catch (ex) {
            chai.assert.instanceOf(ex, StatusCodeError);
            chai.assert.equal(ex.message, "524 - \"\"");
        }
    }).timeout(3000);
    it("should execute with a debug logger", async () => {
        const xml = `<?xml version="1.0" encoding="utf-8" ?>
<response>
      <control>
            <status>success</status>
            <senderid>testsenderid</senderid>
            <controlid>sessionProvider</controlid>
            <uniqueid>false</uniqueid>
            <dtdversion>3.0</dtdversion>
      </control>
      <operation>
            <authentication>
                  <status>success</status>
                  <userid>testuser</userid>
                  <companyid>testcompany</companyid>
                  <locationid></locationid>
                  <sessiontimestamp>2015-12-06T15:57:08-08:00</sessiontimestamp>
            </authentication>
            <result>
                  <status>success</status>
                  <function>getAPISession</function>
                  <controlid>func1UnitTest</controlid>
                  <data>
                        <api>
                              <sessionid>unittest..</sessionid>
                              <endpoint>https://unittest.intacct.com/ia/xml/xmlgw.phtml</endpoint>
                              <locationid></locationid>
                        </api>
                  </data>
            </result>
      </operation>
</response>`;

        const headers = {
            "Content-Type": 'text/xml; encoding="UTF-8"',
        };

        nock("https://api.intacct.com")
            .replyContentLength()
            .post("/ia/xml/xmlgw.phtml")
            .reply(200, xml, headers);

        const logger = new winston.Logger({
            transports: [
                new winston.transports.Console({ level: "debug" }),
            ],
        });

        const config = new ClientConfig();
        config.senderId = "testsenderid";
        config.senderPassword = "pass123!";
        config.sessionId = "testsession..";
        config.logger = logger;

        const requestConfig = new RequestConfig();

        const contentBlock = [
            new ApiSessionCreate(),
        ];

        const requestHandler = new RequestHandler(config, requestConfig);
        await requestHandler.executeOnline(contentBlock);

        chai.assert.isTrue(true); // TODO finish this test to check the log has the user agent in it
    });
    it("should execute offline with session credentials and log a warning", async () => {
        const xml = `<?xml version="1.0" encoding="utf-8" ?>
<response>
      <acknowledgement>
            <status>success</status>
      </acknowledgement>
      <control>
            <status>success</status>
            <senderid>testsenderid</senderid>
            <controlid>requestUnitTest</controlid>
            <uniqueid>false</uniqueid>
            <dtdversion>3.0</dtdversion>
      </control>
</response>`;

        const headers = {
            "Content-Type": 'text/xml; encoding="UTF-8"',
        };

        nock("https://api.intacct.com")
            .replyContentLength()
            .post("/ia/xml/xmlgw.phtml")
            .reply(200, xml, headers);

        const logger = new winston.Logger({
            transports: [
                new winston.transports.Console({ level: "debug" }),
            ],
        });

        const config = new ClientConfig();
        config.senderId = "testsenderid";
        config.senderPassword = "pass123!";
        config.sessionId = "testsession..";
        config.logger = logger;

        const requestConfig = new RequestConfig();
        requestConfig.controlId = "requestUnitTest";
        requestConfig.policyId = "policyid123";

        const contentBlock = [
            new ApiSessionCreate(),
        ];

        const requestHandler = new RequestHandler(config, requestConfig);
        await requestHandler.executeOffline(contentBlock);

        chai.assert.isTrue(true); // TODO finish this test to check the log has the warning in it
        // Offline execution sent to Intacct using Session-based credentials.
    });
});
