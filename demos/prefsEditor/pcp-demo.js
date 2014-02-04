/*!
Cloud4all Preferences Management Tools

Copyright 2013 OCAD University
Copyright 2013 CERTH/HIT

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/prefsEditors/LICENSE.txt
*/

/*global demo:true, fluid, jQuery, navigator, gpii*/
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, regexp: true, browser: true, forin: true, continue: true, maxerr: 100, indent: 4 */

var demo = demo || {};

(function ($, fluid) {

    fluid.defaults("gpii.pcp.progressiveEnhancement", {
        gradeNames: ["fluid.progressiveCheckerForComponent"],
        componentName: "gpii.pcp.progressiveEnhancement",
        progressiveCheckerOptions: {
            checks: [
                {
                    feature: "{gpii.os.isWindowsPlatform}",
                    contextName: "gpii.pcp.auxiliarySchema.windows"
                },
                {
                    feature: "{gpii.os.isLinuxPlatform}",
                    contextName: "gpii.pcp.auxiliarySchema.linux"
                }
            ]
        }
    });
    
    $(document).ready(function () {
        fluid.prefs.create("#gpiic-pcp", {
            build: {
                gradeNames: ["gpii.pcp.progressiveEnhancement", "gpii.pcp.auxiliarySchema.common"],
                primarySchema: gpii.primarySchema
            },
            prefsEditor: {
                prefsEditorType: "gpii.prefsEditor",
                components: {
                    prefsEditorLoader: {
                        options: {
                            messagePrefix: "../../src/shared/adjusters/messages/" + gpii.prefs.i18n.getDefaultLanguage() + "/"
                        }
                    }
                }
            }
        });
    });

})(jQuery, fluid);
