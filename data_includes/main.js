
PennController.ResetPrefix(null); // Shorten command names (keep this line here))

DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// First show instructions, then experiment trials, send results and show end screen
Sequence("consent", "instructions","paid", "practice", "main", "items", SendResults(), "end")
//Sequence("items", SendResults(), "end")


// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
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
        .checkboxWarning("You must consent before continuing. Otherwise you cannot participate in the experiment.")
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
    newText("main-text", "You will read the beginning of <b>What Mrs Simpson Knows About Immigrants</b> by Kinneson Lalor.")
    .center()
    .print(),
    newButton("next", "Start the experiment")
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
    // Question: Check whether prior or posterior Q in item table and present corresponding question
    newVar("showQuestion")
           .set( row.Type )  
           .test.is( "prior")
           .success(
        newText("inputHelpPrior", "Which question <b>will the next chunk</b> answer?")
            .css("margin-top", "20px")
            .center()
            .print()
            )
           .failure(
        newText("inputHelpost", "Which question <b>does this chunk</b> answer?")
            .css("margin-top", "20px")
            .center()
            .print()
        )
        ,
    // Text input
    newTextInput("qud", "")
        .css("margin-top", "10px")
        .log()
        .center()
        .lines(1)
        .size(600, 20)
        .print()        ,
    // Submit button or proceed with Keypress (ENTER)
    newButton("submitQuDButton", "Submit question")
        .css("margin-top", "20px")
        .log()
        .center()
        .print()
        .wait(getTextInput("qud").test.text(/^\w{1}.*$/))
//    newKey("sendQuD", "Enter")
//        .css("margin-top", "20px")
//        .print()
//        .wait()
    )
    // Write type of question produced and sentence ID to results table
    .log("type", row.Type)
    .log("sentence", row.ID)

// Run trials
Template("stimuli.csv", customTrial("items") )

// Final screen
newTrial("end",
    newText("Thank you for your participation!")
        .center()
        .print()
    ,
    // Prolific Code
    newText("<p style='text-align:center'>Please enter this code on Prolific! <br/><b>INSERT PROLIFIC CODE HERE</b></p>")
        .center()
        .print()
    ,
    // Trick: stay on this trial forever (until tab is closed)
    newButton().wait()
)
.setOption("countsForProgressBar",false)
