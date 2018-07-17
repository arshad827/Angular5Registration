"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var dom_helper_1 = require("./dom.helper");
var linkedin_service_1 = require("./linkedin.service");
var zone_helper_1 = require("./zone.helper");
var window_helper_1 = require("./window.helper");
var LinkedInSdkModule = (function () {
    function LinkedInSdkModule() {
    }
    return LinkedInSdkModule;
}());
LinkedInSdkModule.decorators = [
    { type: core_1.NgModule, args: [{
                imports: [
                    common_1.CommonModule
                ],
                declarations: [],
                providers: [
                    { provide: 'window', useFactory: window_helper_1.getWindow },
                    zone_helper_1.ZoneHelper,
                    dom_helper_1.DomHelper,
                    linkedin_service_1.LinkedInService
                ],
                exports: []
            },] },
];
/** @nocollapse */
LinkedInSdkModule.ctorParameters = function () { return []; };
exports.LinkedInSdkModule = LinkedInSdkModule;
