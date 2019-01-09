"use strict";
/**
 * @module Intacct/SDK/Functions/Common/Query/Comparison/GreaterThanOrEqualTo
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
const AbstractInteger_1 = require("../AbstractInteger");
class GreaterThanOrEqualToInteger extends AbstractInteger_1.default {
    toString() {
        let clause = "";
        if (this.negate === true) {
            clause = "NOT ";
        }
        clause = clause + this.field + " >= " + this.value.toString();
        return clause;
    }
}
exports.default = GreaterThanOrEqualToInteger;
//# sourceMappingURL=GreaterThanOrEqualToInteger.js.map