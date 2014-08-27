(function ($, fluid) {
    fluid.defaults("gpii.pcp.starter", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        events: {
            onRenderRquest: null,
            renderPCP: null
        },
        listeners: {
            "onRenderRquest.populateGradeNames": {
                "funcName": "gpii.pcp.populateGradeNames",
                "args": ["{that}", "{that}.options.metaGradeNames", "{that}.options.groupsData", "{arguments}.0"]
            },
            "renderPCP.create": {
                "listener": "gpii.pcp.renderPCP",
                "args": ["{arguments}.0"]
            }
        },
        invokers: {
            renderAdjusters: {
                "func": "{that}.events.onRenderRquest.fire",
                "args": ["{arguments}.0"]
            }
        },
        metaGradeNames: [
            "visualAlternatives",
            "visualAlternativesMoreLess",
            "volumeGroup",
            "languageGroup",
            "addContrast",
            "increaseSize"
        ],
        groupsData: [[{"0":["visualAlternatives"],"1":["visualAlternatives","speakText"],"2":["visualAlternatives","speakText","visualAlternativesMoreLess"]},[["speakText","screenReaderBrailleOutput"],["wordsSpokenPerMinute","volume"],["voicePitch","screenReaderLanguage","punctuationVerbosity","announceCapitals","speakTutorialMessages","keyEcho","wordEcho","textHighlighting","screenReaderFollows"]]],[{"0":["volumeGroup"]},[["volume"]]],[{"0":["languageGroup"]},[["universalLanguage"]]],[{"0":["addContrast"],"1":["addContrast","contrastEnabled"]},[["contrastEnabled"],["contrastTheme"]]],[{"0":["increaseSize"],"1":["increaseSize","magnifierEnabled"]},[["fontSize","cursorSize","magnifierEnabled"],["magnifier","magnifierPosition","magnifierFollows","showCrosshairs"]]]]
    });

    // TODO: Rewrite this function more declaratively

    gpii.pcp.populateGradeNames = function (that, metaGradeNames, groups, preferences) {

        var levelOfAdjuster = function (adjuster, groupLevels) {
            for (i = 0; i < groupLevels.length; i++) {
                if ($.inArray(adjuster, groupLevels[i]) > -1) {
                    return i;
                };
            };
            return -1;
        };

        var deepestLevel = function (adjusters, groupLevels) {
            return Math.max.apply(null, adjusters.map(function (adj) {
                return levelOfAdjuster(adj, groupLevels);
            }));
        };

        // used for adding gradeNames that:
        // 1) aren't part of the model, e.g. grade names for groups (called "metaGradeNames")
        // 2) have been missed in the preferences set, but should be there,
        //    e.g. if speechRate value is given, but screenReaderTTSEnabled value is not.

        var determineAdditionalGradeNames = function (modelAdjusters) {
            var commonModelPartLength = "gpii_primarySchema_".length;

            var baseAdjusters = fluid.transform(modelAdjusters, function (adjuster) {
                return adjuster.substr(commonModelPartLength);
            });

            var additionals = [];

            fluid.each(groups, function (group) {
                additionals = additionals.concat(group[0][deepestLevel(baseAdjusters, group[1])]);
            });

            fluid.each(additionals, function (grade) {
                if ($.inArray(grade, baseAdjusters) < 0) {
                    baseAdjusters.push(grade);  // add every additional adjuster needed for rendering (including meta grade names)
                    if (metaGradeNames.indexOf(grade) < 0) {  // if it's not a meta grade name, then there has been an ebaled switch missed in the prefs set supplied to PCP
                        modelToRender["gpii_primarySchema_" + grade] = true; // used to update primarySchema with true values for enabling switches (since they've been missed)
                    };
                };
            });

            var additionalSchemaAdjusters = fluid.transform(baseAdjusters, function (adjuster) {
                return "gpii.pcp.auxiliarySchema." + adjuster;
            });

            return additionalSchemaAdjusters;
        };

        var required = [
            "gpii.pcp.auxiliarySchema.mergePolicy",
            "gpii.pcp.progressiveEnhancement",
            "gpii.pcp.auxiliarySchema.common",
            "gpii.pcp.auxiliarySchema.followingElement"
        ];

        var modelToRender = fluid.model.transform(preferences, gpii.prefs.commonTermsInverseTransformationRules);
        var modelKeys = Object.keys(modelToRender);
        var additionalGradeNames = determineAdditionalGradeNames(modelKeys);

        for (var key in modelToRender) {
            if (modelToRender.hasOwnProperty(key)) {
                var schemaKey = key.replace(/_/g, ".");
                gpii.primarySchema[schemaKey]["default"] = modelToRender[key];
            };
        };

        var finalGradeNames = required.concat(additionalGradeNames);
        that.events.renderPCP.fire(finalGradeNames);
    };


    gpii.pcp.renderPCP = function (finalGradeNames) {

        fluid.prefs.create("#gpiic-pcp", {
            build: {
                gradeNames: finalGradeNames,
                primarySchema: gpii.primarySchema
            },
            prefsEditor: {
                gradeNames: ["demo.pcp"]
            }
        });
    };
})(jQuery, fluid);
