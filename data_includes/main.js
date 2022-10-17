
PennController.ResetPrefix(null); // Shorten command names (keep this line here))

DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// First show instructions, then experiment trials, send results and show end screen
// Sequence("consent", "instructions","paid", "practice", "main", shuffle(randomize("items"), randomize("filler"), randomize("sluicing")), SendResults(), "end")
Sequence("items", SendResults(), "end")


// This is run at the beginning of each trial
Header(
    // Declare a global Va r element "ID" in which we will store the participant's ID
    newVar("ID").global()    
)
.log( "id" , getVar("ID") ) // Add the ID to all trials' results lines

// Instructions
newTrial("instructions",
    // Instructions
    newHtml("intro", "intro.html")
    .print(),
    newButton("next", "Continue")
        .center()
        .print()
        .wait()
    )
    
// Prolific ID
newTrial("paid",
    // Remove instructions after button press
    newText("paid-text", "Please type in your Prolific ID below before starting the practice phase.")
        .center()
        .print()
    ,
    newTextInput("inputID", "")
        .center()
        .css("margin","1em")    // Add a 1em margin around this element
       .print()
    ,
    newButton("start", "Start the practice phase")
        .center()
        .print()
        // Only validate a click on Start when inputID has been filled
        .wait( getTextInput("inputID").testNot.text("") )
    ,
    // Store the text from inputID into the Var element
    getVar("ID").set( getTextInput("inputID") )
)

// Consent form
newTrial("consent",
    newHtml("consent_form", "consent.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("You must consent before continuing.")
        .center()
        .print()
    ,
    newButton("consent-next", "Click to continue")
        .center()
        .print()
        .wait(getHtml("consent_form").test.complete()
                  .failure(getHtml("consent_form").warn())
        )
)

// Instructions
newTrial("main",
    // Instructions
    newText("main-text", "You have completed the practice phase. Please click on the button to start the main experiment.")
    .center()
    .print(),
    newButton("next", "Start the main experiment")
        .center()
        .print()
        .wait()
    )

// Trials
customTrial = label => row =>
    newTrial(label,
        // SPR
        newText("item", row.Stim)
            .css("margin-bottom", "20px")
            .left()
            .print()
        ,
    newText("inputHelpPrior", "Which question will the next text chunk address?")
        .css("margin-top", "20px")
        .center()
        .print()
        ,
    newTextInput("qudPrior", "")
        .log()
        .center()
        .lines(1)
        .size(400, 20)
        .print()
        ,
    newButton("submitQuDButton", "Submit question")
        .css("margin-top", "20px")
        .log()
        .center()
        .print()
        .wait()
        ,
     getText("inputHelpPrior")
        .remove()
        ,
     getTextInput("qudPrior")
        .remove()
        ,
     getButton("submitQuDButton")
        .remove()
        ,
     newText("inputHelpPost", "Which did the last text chunk address?")
        .css("margin-top", "20px")
        .center()
        .print()
        ,
    newTextInput("qudPost", "")
        .log()
        .center()
        .lines(1)
        .size(400, 20)
        .print()
        ,
    getButton("submitQuDButton")
        .css("margin-top", "20px")
        .log()
        .center()
        .print()
        .wait()
//    newKey("sendQuD", "Enter")
//        .css("margin-top", "20px")
//        .print()
//        .wait()
    )
    // Speichere auch Bedingung, Token Set und Liste in der Antworttabelle
    .log("condition", row.Condition)
    .log("tokenset", row.TokenSet)
    .log("group", row.List)

// Übungsphase, Items und Filler ausführen
Template("items_spr.csv", customTrial("items") )

// Final screen
newTrial("end",
    newText("Thank you for your participation!")
        .center()
        .print()
    ,
    // Prolific Code
    newText("<p style='text-align:center'>Please enter this code on Prolific! <br/><b>82AA09AC</b></p>")
        .center()
        .print()
    ,
    // Trick: stay on this trial forever (until tab is closed)
    newButton().wait()
)
.setOption("countsForProgressBar",false)
