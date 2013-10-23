/*!
Cloud4all Preferences Management Tools

Copyright 2013 CERTH/HIT

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/prefsEditors/LICENSE.txt
*/

/*global fluid, jQuery*/
/*jslint white: true, onevar: true, funcinvoke: true, forvar: true, undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4 */

(function ($, fluid) {
    
    fluid.defaults("gpii.uiOptions.panels.cursorSize", {
        gradeNames: ["fluid.uiOptions.panels", "gpii.uiOptions.pmt.previewPerSettingEnhanced", "autoInit"],
        preferenceMap: {
            "http://registry.gpii.org/common/cursorSize": {
                "model.value": "default",
                "controlValues.cursorSize.min": "minimum",
                "controlValues.cursorSize.max": "maximum",
                "controlValues.cursorSize.divisibleBy": "divisibleBy"
            }
        },
        components: {
            cursorSizePreview: {
                type: "fluid.uiOptions.preview",
                createOnEvent: "afterRender",
                container: ".flc-uiOptions-cursor-size .flc-uiOptions-preview-per-setting-frame",
                options: {
                    templateUrl: "../../src/shared/preview/html/uiOptionsCursorPreview.html"
                }
            }
        },
        selectors: {
            cursorSize: ".flc-uiOptions-cursor-size",
            cursorSizeLabel: ".flc-uiOptions-cursor-size-label",
            multiplier: ".flc-uiOptions-multiplier"
        },
        sliderOptions: {
            orientation: "horizontal",
            step: 0.2,
            range: "min"
        },
        
        distributeOptions: [{
            source: "{that}.options.outerPreviewEnhancerOptions",
            //removeSource: true,
            target: "{that cursorSizePreview enhancer}.options"
        }, {
            source: "{that}.options.emptyComponentType",
            target: "{that cursorSizePreview enhancer textSize}.type"
        }, {
            source: "{that}.options.emptyComponentType",
            //removeSource: true,
            target: "{that cursorSizePreview enhancer magnifier}.type"
        }]
    });
    
})(jQuery, fluid);