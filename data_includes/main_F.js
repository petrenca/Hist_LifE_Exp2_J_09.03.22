PennController.ResetPrefix(null);
PennController.AddHost("https://amor.cms.hu-berlin.de/~petrenca/Hist_LE_stimuliV/"); // loads pictures from external server
PennController.DebugOff() // use for the final version

// --------------------------------------------------------------------------------------------------------------
// Preamble

// create cumulative function
cumulative = (sentence, remove) => {
    let words = sentence.split('*'),  blanks = words.map(w=>w.split('').map(c=>'_').join('') ); // 'sentence.split('*')' = '*' defines the chunk boundaries (in the .csv)
    let textName = 'cumulative'+words.join('');
    // We'll return cmds: the first command consists in creating (and printing) a Text element with dashes
    let cmds = [ newText(textName, blanks.join(' '))
    //.print()
    //.css({"font-family":"courier","font-size":"20px","white-space":"pre-line"})
    .settings.css("font-family","courier")
    .settings.css("font-size", "20px")
    //.cssContainer({"width": "70vw"})
    .print("center at 50%","40vh")
    //.settings.css("font-size", "0.5em")  
    //.cssContainer({"width": "90%"})
    ];
    // COURIER as font
    // We'll go through each word, and add two command blocks per word
    for (let i = 0; i <= words.length; i++)
    cmds = cmds.concat([ newKey('cumulative'+i+'_'+words[i], " ").log().wait() , // Wait for (and log) a press on Space; will log "cumulative"+number-of-region_sentence-chunk
    //getText(textName).text(blanks.map((w,n)=>(n<=i?words[n]:w)).join(' ')) ]); // Show word; to make cumulative changed n==i?words to n<=i?words (print words less than or equal to i-region)
    getText(textName).text(blanks.map((w,n)=>(n<=i?words[n]:w).replace(/\s/,"&nbsp;")).join(' ')) ]);
    if (remove)  // Remove the text after the last key.wait() is parameter specified
    cmds.push(getText(textName).remove());
    return cmds;
};

// --------------------------------------------------------------------------------------------------------------
//Create picking function
function Pick(set,n) {
    assert(set instanceof Object, "First argument of pick cannot be a plain string" );
    n = Number(n);
    if (isNaN(n) || n<0)
        n = 0;
    this.args = [set];
    this.runSet = null;
    set.remainingSet = null;
    this.run = arrays => {
        if (this.runSet!==null) return this.runSet;
        const newArray = [];
        if (set.remainingSet===null) {
        if (set.runSet instanceof Array) set.remainingSet = [...set.runSet];
        else set.remainingSet = arrays[0];
    }
        for (let i = 0; i < n && set.remainingSet.length; i++)
            newArray.push( set.remainingSet.shift() );
    this.runSet = [...newArray];
    return newArray;
}
}
    function pick(set, n) { return new Pick(set,n); }
        
        criticalyes = randomize("critical_yes")
        criticalno = randomize("critical_no")
        fillersyes = randomize("filler_yes")
        fillersno = randomize("filler_no");

// --------------------------------------------------------------------------------------------------------------
// sequence
// test run:
//PennController.Sequence( "post_instructions", "post_ques", "post_task_intro", "post_task_prac", "post_task_start", randomize("post_task"), "final");


// FOR REAL PARTICIPANTS; check: # of trials, DebugOff, DELETE results file
PennController.Sequence("demographics","requirements","pre_task_intro","pre_task_practice","pre_task_start",
                         "preloadPractice", "preloadCritical_yes", "preloadCritical_no", "preloadFillers_yes", "preloadFillers_no",
                         shuffle(randomize("pre_task_crit"), randomize("pre_task_fill")), "instructions1", "practice", "instructions2",
                         rshuffle(pick(criticalyes,4),pick(fillersyes,6),pick(criticalno,4),pick(fillersno,5)),"break",
                         rshuffle(pick(criticalyes,4),pick(fillersyes,5),pick(criticalno,4),pick(fillersno,6)),"break",
                         rshuffle(pick(criticalyes,4),pick(fillersyes,6),pick(criticalno,4),pick(fillersno,5)),
                         "post_instructions", "post_ques", "post_task_intro", "post_task_prac", "post_task_start", randomize("post_task"), "send", "final");


//====================================================================================================================================================================================================================
// 1. Welcome page/demographics

PennController("demographics",
               // ENTER PROLIFIC ID
               newText("welcometext", "<p><b>Welcome to our experiment!</b><p>")
               .settings.css("font-size", "30px")
               ,
               newCanvas("welcomecanvas", 1000, 125)
               .settings.add("center at 50%", 0, getText("welcometext") )
               .print()
               ,
               newTextInput("proID", "")
               .before(newText("proID", "Before we begin, please enter your Prolific ID: ")
                       .settings.css("font-size", "20px"))
               .size(100, 20)
               .settings.center()
               .print()
               ,
               newText("blank","<p>")
               .print()
               ,
               newButton("start", "Continue")
               .settings.center()
               .print()
               .wait(getTextInput("proID")
                     .test.text(/[^\s]+/)
                     .success()
                     .failure(
                         newText("IDerror","Please enter your Prolific ID in order to continue.")
                         .settings.color("red")
                         .settings.center()
                         .print()
                     ))
               ,   
               getCanvas("welcomecanvas")
               .remove()
               ,
               getTextInput("proID")
               .remove()
               ,
               getButton("start")
               .remove()
               ,
               getText("IDerror")
               .remove()
               ,
               // ENTER DEMOGRAPHICS
               newText("demo", "<p>Before you continue to the instructions, we need to know a few things about you."
                       +" This information will remain anonymous. You can read more about how we handle your data in our Information Sheet below.<p>")              
               .settings.css("font-size", "20px")
               ,
               newCanvas("democanvas", 1000, 95)
               .settings.add(0, 0, getText("demo") )
               .print()
               ,
               newDropDown("age", "")
               .settings.add( "26 or younger" , "27" , "28" , "29", "30" , "31" , "32 or older" )
               ,
               newText("agetext", "Age:")
               .settings.css("font-size", "20px")
               .settings.bold()   
               ,
               newCanvas("agecanvas", 1000, 45)
               .settings.add(0, 10, getText("agetext") )
               .settings.add(100, 8, getDropDown("age") )
               .print()    
               ,
               newText("sex", "Gender:")
               .settings.css("font-size", "20px")
               .settings.bold()
               ,
               newDropDown("sex", "" )
               .settings.add( "female", "male", "other")
               ,
               newCanvas("sexcanvas", 1000, 40)
               .settings.add(0, 0, getText("sex") )
               .settings.add(120, 3, getDropDown("sex") )
               .print()
               ,
               newText("nativeEng", "<b>Were you raised monolingually in English?</b><br>(i.e., in English and only English?)")
               .settings.css("font-size", "20px")
               ,
               newTextInput("L2", "")
               .settings.hidden()
               ,
               newText("label input", "")
               .settings.after( getTextInput("L2") )
               ,
               newDropDown("language", "")
               .settings.log()
               .settings.add(  "yes", "no, I was (also) raised in:")    
               .settings.after(  getText("label input") )
               .settings.callback( //whenever an option is selected, do this:
                   getDropDown("language")
                   .test.selected("no, I was (also) raised in:") //reveal the input box
                   .success( getTextInput("L2").settings.visible() ) //hide the input box
                   .failure( getTextInput("L2").settings.hidden()  )   
               )        
               ,
               newCanvas("languagecanvas", 1000, 25)
               .settings.add(0, 0, getText("nativeEng") )
               .settings.add(400, 2, getDropDown("language") )
               .print()
               ,
               newText("<p> ")
               .print()
               ,    
               newText("information", "<p>Before continuing the experiment, please read our"
                       +" <a href='https://amor.cms.hu-berlin.de/~petrenca/Hist_LE/EN_info_sheet_ONLINE_Exp2.pdf' target='_blank' >Participant's Information Sheet</a> and"
                       +" <a href='https://amor.cms.hu-berlin.de/~petrenca/Hist_LE/EN_consentAgreement_ONLINE_Exp2.pdf' target='_blank'>Consent Form</a>.<p>")    
               .settings.css("font-size", "20px")
               ,
               newCanvas("infocanvastwo", 1000, 70)
               .settings.add(0, 0, getText("information") )
               .print()
               ,
               newText("browser_info", "<p>Please note that this experiment should only be run on <b>Mozilla Firefox</b> or <b>Google Chrome</b> and should <i>not</i> be run on a mobile phone.<p>")
               .settings.css("font-size", "20px")
               ,
               newCanvas("infocanvasthree", 1000, 105)
               .settings.add(0, 0, getText("browser_info") )
               .print()
               ,
               newText("consent", "By ticking the button below, I declare I have fully read and <br>understood the Participant's Information Sheet and Consent Form.<p>")
               .settings.css("font-size", "15px")  
               .settings.center()      
               .print()
               ,
               newButton("consent","Yes, I have read them.")
               .settings.center()
               .print()
               .wait()
               ,
               getDropDown("age")
               .test.selected()
               .success()
               .failure(
                   newText("ageerror","Please enter your age.")
                   .settings.color("red")
                   .print())   
               ,
               getDropDown("sex")
               .test.selected()
               .success()
               .failure(
                   newText("sexerror","Please ender your gender.")
                   .settings.color("red")
                   .print())
               ,
               getDropDown("language")
               .test.selected()
               .success()
               .failure(
                   newText("langerror","Please answer the question about your language history.")                   
                   .settings.color("red")
                   .print())      
               ,
               getDropDown("age").wait("first")
               ,
               getDropDown("sex").wait("first")
               ,
               getDropDown("language").wait("first")
               ,
               newButton("continue", "Continue to experiment")
               .settings.center()
               .print()
               .wait()
               
               ,
               getButton("consent")
               .remove()
               ,
               getButton("continue")
               .remove()
               ,
               getText("consent")
               .remove()
               ,
               getCanvas("infocanvastwo")
               .remove()
               ,
               newText("<p> ")
               .print()  
               ,
               // Create new variables from input
               newVar("IDage")
               .settings.global()
               .set( getDropDown("age") )
               ,
               newVar("IDsex")
               .settings.global()
               .set( getDropDown("sex") )
               ,
               newVar("IDling")
               .settings.global()
               .set( getDropDown("language") )
               ,
               newVar("whichL2")
               .settings.global()
               .set( getTextInput("L2") )
               ,
               newVar("proID")
               .settings.global()
               .set( getTextInput("proID") )
               ,
               // set 'yes' and 'no' keys
               newVar("yes_key")
               .settings.global()
               .set( "F" ) // for F-version
               //.set( "J" ) // for J-version
               ,
               // set 'no' key; this is necessary for the conditional in the practice round (for feedback)
               newVar("no_key")
               .settings.global()
               .set( "J" ) // for F-version
               //.set( "F" ) // for J-version
              )                                   //end of welcome screen
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "demo")
    .log("item_id" , "demo" )
    .log("type", "demo")
    
    .log("life_status" , "demo")
    .log("lifetime" , "demo")
    .log("died" , "demo")
    
    .log("tense", "demo")  
    .log("mismatch", "demo")
    .log("match", "demo")
    .log("condition" , "demo")
    .log("sentence_rating", "demo")
    
    .log("occupation" , "demo")  
    .log("nationality" , "demo")  
    
    .log( "sentence" , "demo")
    .log("list", "demo")
    .log("name" , "demo")
    .log("file_name" , "demo")   
    
    .log("bare_verb", "demo")  
    .log("life_status_year_verb", "demo")
    .log("life_status_year_before", "demo")
    .log("life_status_year_after", "demo")
    .log("life_status_year_before_match", "demo")
    .log("life_status_year_correct", "demo")   
    
    .log( "notice", "demo")  
    .log( "about", "demo")     
    .log( "easyhard", "demo")  
    .log( "strategy", "demo")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
//2. Participants who don’t meet the pre-determined criteria, get an‘exclude’value in ‘demo_req’

PennController( "requirements"
                ,
                newVar("demo_req")
                .settings.global()
                ,
                getVar("IDage")
                .testNot.is("26 or younger")  // if particpant is NOT under 17
                .and( getVar("IDage")
                      .testNot.is("32 or older")  // AND if particpant is NOT over 32
                     )
                .and(getVar("IDling")
                     .testNot.is("no, I was (also) raised in:")   // AND participant is NOT bi-lingual
                    )
                
                .success(getVar ("demo_req").set(newText("include")))  
                .failure(getVar ("demo_req").set(newText("exclude")))  
               )// END    
    
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "requirements" )
    .log("item_id" , "requirements" )
    .log("type", "requirements")
    
    .log("life_status" , "requirements")
    .log("lifetime" , "requirements")
    .log("died" , "requirements")
    
    .log("tense", "requirements")  
    .log("mismatch", "requirements")
    .log("match", "requirements")
    .log("condition" , "requirements")
    .log("sentence_rating", "requirements")
    
    .log("occupation" , "requirements")  
    .log("nationality" , "requirements")
    
    .log("sentence" , "requirements")
    .log("list", "requirements")
    .log("name" , "requirements")
    .log("file_name" , "requirements")
    
    .log("bare_verb", "requirements")  
    .log("life_status_year_verb", "requirements")
    .log("life_status_year_before", "requirements")
    .log("life_status_year_after", "requirements")
    .log("life_status_year_before_match", "requirements")
    .log("life_status_year_correct", "requirements")   
    
    .log( "notice", "requirements")  
    .log( "about", "requirements")     
    .log( "easyhard", "requirements")  
    .log( "strategy", "requirements")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 2. Intro/instructions

PennController( "pre_task_intro",
                
                getVar("IDage")
                .testNot.is("26 or younger")   // if particpant is NOT under 27
                .and( getVar("IDage")
                      .testNot.is("32 or older")   // AND if particpant is NOT over 32
                     )
                .and(getVar("IDling")
                     .testNot.is("no, I was (also) raised in:")    // AND participant is NOT bi-lingual
                    )
                .success()   // continue as normal
                .failure(    // otherwise, send results and end prematurely
                    SendResults()  // for this to work within a PC, I changed the PC.js file (Edit your file PennController.js and replace occurrences of e=window.items.indexOf(n); (there should be 2) with e=window.items&&window.items.indexOf(n);)
                    ,
                    newText("bye", "<p>You are ineligible for this study, as you have provided information which is inconsistent with your Prolific prescreening responses. "
                            + "<p>Please return your submission on Prolific by selecting the 'Stop without completing' button."
                           )
                    .settings.css("font-size", "20px")
                    .settings.color("red")
                    .settings.bold()
                    .print()
                    ,
                    newText("bye2", "<p><b>Why was I excluded?</b><p>We used Prolific's prescreening options in order to recruit participants who are "
                            + "between the <b>ages of 27-31</b>, whose <b>first/native language is English</b>,<br> and who <b>grew up speaking only "
                            + "their native language</b> (which in this case should be English).<p> You must have indicated on the previous "
                            + "page that one of these is not true. If you think there has been a mistake, please let the researchers know via Prolific. <br>We have saved "
                            + "your responses and will gladly check them and pay you if there has been an error!"
                           )
                    .center()
                    .print()
                    .wait()
                )
                ,
                newText("intro", "<p><b>Thank you for taking part in our experiment!</b><p> The experiment consists of four parts: a pre-experiment task, the experiment itself, and then two short post-experiment questionnaires. The whole process should take around 15 minutes.<p><p> Press the <b>spacebar</b> to continue to the instructions.<p><p>")
                .settings.css("font-size", "20px")
                ,
                newCanvas("introcanvas",900, 450)
                .settings.add(0,0, getText("intro"))
                .print()   
                ,
                newKey("intro"," ")
                .wait()
                ,
                getCanvas("introcanvas")
                .remove()
                ,
                newTimer("intro", 500)
                .start()
                .wait()
                ,                
                newText("set-up", "<p>Because <b>this is an experiment</b>, we would appreciate if you could take the following steps to ensure concentration:<p><t>&nbsp;&nbsp;&nbsp;&nbsp;&bull; <b>turn off any music</b>/audio you may be listening to<p>&nbsp;&nbsp;&nbsp;&nbsp;&bull; <b>refrain from Googling</b> or looking up information during the experiment<p><t>&nbsp;&nbsp;&nbsp;&nbsp;&bull; put your <b>phone on silent</b> and leave it face down or out of reach<p><t>&nbsp;&nbsp;&nbsp;&nbsp;&bull; <b>attend to the experiment until it is over</b> (the main part consists of three blocks with two short breaks in between)<p><t>&nbsp;&nbsp;&nbsp;&nbsp;&bull; in general behave as if you were in our laboratory!<p>These steps will help ensure the data we collect from you is high quality. Please <b>press the spacebar</b> if you agree to take these steps.")
                .settings.css("font-size", "20px")
                ,
                newCanvas("set-upcanvas",900, 450)
                .settings.add(0,0, getText("set-up"))
                .print()   
                ,
                newKey("set-up"," ")
                .wait()
                ,     
                getCanvas("set-upcanvas")
                .remove()
                ,
                newTimer("intro", 500)
                .start()
                .wait()
                ,
                newButton("fullscreen","Start the experiment and go fullscreen")
                .center()
                .print()
                .wait()
                ,
                fullscreen()
                ,
                getButton("fullscreen")
                .remove()
                ,
                newText("instructions_a", "<b>Pre-experiment task</b><p>"
                        + "In this task, you will be looking at photos of cultural figures."
                        + "<br>You may be very familiar with some cultural figures, and not very familiar with others."
                        + "<p>(1) <b>A photo and a name</b> of a cultural figure from around the world will appear. "
                        + "<p>Once you looked at the photo and read the name,<p>"
                        + "(2) indicate <b>whether you are familiar with them</b> by pressing <b>'F'</b>= <i>'yes, I am'</i> or <b>'J'</b>=<i>'no, I am not'</i>.<br>"  //F-Version
                        //+ "indicate whether you are familiar with them by pressing <b>'F'</b> = <i>'no, I am not'</i> or <b>'J'</b> = <i>'yes, I am'</i>.<br>" //J-Version
                        + "<p>Once you've made your decision, you will continue to the next cultural figure."
                        + "<br> You only have a few seconds to make this selection, otherwise it will time out."
                        + "<p>You’ll now start start a practice round with instructions in red to help you.<p>"
                        + "When you’re ready to start, <b>press the yes-key</b> to continue.")
                .settings.css("font-size", "20px")
                .print()   
                ,
                newKey("yes","F") //F-Version
                //newKey("yes","J") //J-Version
                .wait()
                
               )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "pre_task_intro" )
    .log("item_id" , "pre_task_intro" )
    .log("type", "pre_task_intro")
    
    .log("life_status" , "pre_task_intro")
    .log("lifetime" , "pre_task_intro")
    .log("died" , "pre_task_intro")
    
    .log("tense", "pre_task_intro")  
    .log("mismatch", "pre_task_intro")
    .log("match", "pre_task_intro")
    .log("condition" , "pre_task_intro")
    .log("sentence_rating", "pre_task_intro")
    
    .log("occupation" , "pre_task_intro")  
    .log("nationality" , "pre_task_intro")
    
    .log("sentence" , "pre_task_intro")
    .log("list", "pre_task_intro")
    .log("name" , "pre_task_intro")
    .log("file_name" , "pre_task_intro")
    
    .log("bare_verb", "pre_task_intro")  
    .log("life_status_year_verb", "pre_task_intro")
    .log("life_status_year_before", "pre_task_intro")
    .log("life_status_year_after", "pre_task_intro")
    .log("life_status_year_before_match", "pre_task_intro")
    .log("life_status_year_correct", "pre_task_intro")   
    
    .log( "notice", "pre_task_intro")  
    .log( "about", "pre_task_intro")     
    .log( "easyhard", "pre_task_intro")  
    .log( "strategy", "pre_task_intro")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 0. Preloading

CheckPreloaded( "practice",5000)
    .label( "preloadPractice" )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "preload1" )
    .log("item_id" , "preload1" )
    .log("type", "preload1")
    
    .log("life_status" , "preload1")
    .log("lifetime" , "preload1")
    .log("died" , "preload1")
    
    .log("tense", "preload1")  
    .log("mismatch", "preload1")
    .log("match", "preload1")
    .log("condition" , "preload1")
    .log("sentence_rating", "preload1")
    
    .log("occupation" , "preload1")  
    .log("nationality" , "preload1")
    
    .log("sentence" , "preload1")
    .log("list", "preload1")
    .log("name" , "preload1")
    .log("file_name" , "preload1")
    
    .log("bare_verb", "preload1")  
    .log("life_status_year_verb", "preload1")
    .log("life_status_year_before", "preload1")
    .log("life_status_year_after", "preload1")
    .log("life_status_year_before_match", "preload1")
    .log("life_status_year_correct", "preload1")   
    
    .log( "notice", "preload1")  
    .log( "about", "preload1")     
    .log( "easyhard", "preload1")  
    .log( "strategy", "preload1")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


CheckPreloaded( "critical_yes", 10000)
    .label( "preloadCritical_yes" )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "preload2" )
    .log("item_id" , "preload2" )
    .log("type", "preload2")
    
    .log("life_status" , "preload2")
    .log("lifetime" , "preload2")
    .log("died" , "preload2")
    
    .log("tense", "preload2")  
    .log("mismatch", "preload2")
    .log("match", "preload2")
    .log("condition" , "preload2")
    .log("sentence_rating", "preload2")
    
    .log("occupation" , "preload2")  
    .log("nationality" , "preload2")
    
    .log("sentence" , "preload2")
    .log("list", "preload2")
    .log("name" , "preload2")
    .log("file_name" , "preload2")
    
    .log("bare_verb", "preload2")  
    .log("life_status_year_verb", "preload2")
    .log("life_status_year_before", "preload2")
    .log("life_status_year_after", "preload2")
    .log("life_status_year_before_match", "preload2")
    .log("life_status_year_correct", "preload2")   
    
    .log( "notice", "preload2")  
    .log( "about", "preload2")     
    .log( "easyhard", "preload2")  
    .log( "strategy", "preload2")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


CheckPreloaded( "critical_no", 10000)
    .label( "preloadCritical_no" )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "preload3" )
    .log("item_id" , "preload3" )
    .log("type", "preload3")
    
    .log("life_status" , "preload3")
    .log("lifetime" , "preload3")
    .log("died" , "preload3")
    
    .log("tense", "preload3")  
    .log("mismatch", "preload3")
    .log("match", "preload3")
    .log("condition" , "preload3")
    .log("sentence_rating", "preload3")
    
    .log("occupation" , "preload3")  
    .log("nationality" , "preload3")
    
    .log("sentence" , "preload3")
    .log("list", "preload3")
    .log("name" , "preload3")
    .log("file_name" , "preload3")
    
    .log("bare_verb", "preload3")  
    .log("life_status_year_verb", "preload3")
    .log("life_status_year_before", "preload3")
    .log("life_status_year_after", "preload3")
    .log("life_status_year_before_match", "preload3")
    .log("life_status_year_correct", "preload3")   
    
    .log( "notice", "preload3")  
    .log( "about", "preload3")     
    .log( "easyhard", "preload3")  
    .log( "strategy", "preload3")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


CheckPreloaded( "filler_yes", 15000)
    .label( "preloadFillers_yes" )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "preload4" )
    .log("item_id" , "preload4" )
    .log("type", "preload4")
    
    .log("life_status" , "preload4")
    .log("lifetime" , "preload4")
    .log("died" , "preload4")
    
    .log("tense", "preload4")  
    .log("mismatch", "preload4")
    .log("match", "preload4")
    .log("condition" , "preload4")
    .log("sentence_rating", "preload4")
    
    .log("occupation" , "preload4")  
    .log("nationality" , "preload4")
    
    .log("sentence" , "preload4")
    .log("list", "preload4")
    .log("name" , "preload4")
    .log("file_name" , "preload4")
    
    .log("bare_verb", "preload4")  
    .log("life_status_year_verb", "preload4")
    .log("life_status_year_before", "preload4")
    .log("life_status_year_after", "preload4")
    .log("life_status_year_before_match", "preload4")
    .log("life_status_year_correct", "preload4")   
    
    .log( "notice", "preload4")  
    .log( "about", "preload4")     
    .log( "easyhard", "preload4")  
    .log( "strategy", "preload4")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


CheckPreloaded( "filler_no", 15000)
    .label( "preloadFillers_no" )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "preload5" )
    .log("item_id" , "preload5" )
    .log("type", "preload5")
    
    .log("life_status" , "preload5")
    .log("lifetime" , "preload5")
    .log("died" , "preload5")
    
    .log("tense", "preload5")  
    .log("mismatch", "preload5")
    .log("match", "preload5")
    .log("condition" , "preload5")
    .log("sentence_rating", "preload5")
    
    .log("occupation" , "preload5")  
    .log("nationality" , "preload5")
    
    .log("sentence" , "preload5")
    .log("list", "preload5")
    .log("name" , "preload5")
    .log("file_name" , "preload5")
    
    .log("bare_verb", "preload5")  
    .log("life_status_year_verb", "preload5")
    .log("life_status_year_before", "preload5")
    .log("life_status_year_after", "preload5")
    .log("life_status_year_before_match", "preload5")
    .log("life_status_year_correct", "preload5")   
    
    .log( "notice", "preload5")  
    .log( "about", "preload5")     
    .log( "easyhard", "preload5")  
    .log( "strategy", "preload5")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


//====================================================================================================================================================================================================================
// 11. Pre-task practice
PennController. Template( PennController.GetTable( "Crit_Stimuli_HistLifetime.csv")// change this line for the appropriate experimental list
                          .filter("type" , "practice")
                          .filter("pre_task" , "yes")
                          ,
                          variable => ["pre_task_practice",
                                       "PennController", PennController(
                                           defaultText
                                           .css({"font-size":"20px"})
                                           .center()
                                           ,
                                           defaultSelector
                                           .once()
                                           .log()
                                           ,
                                           defaultCanvas
                                           .log()
                                           .center()
                                           // NEW TEXT
                                           ,
                                           newImage("pre_photo",  variable.file_name)
                                           .size(370)
                                           ,
                                           newText("pre_name", variable.name)
                                           ,
                                           newText("F_text", "F")
                                           ,
                                           newText("J_text", "J")
                                           ,
                                           newText("yes_text_familiar", "<i>(familiar)")
                                           .settings.color("green").settings.css("font-size", "18px")          
                                           ,
                                           newText("no_text_unfamiliar", "<i>(unfamiliar)")
                                           .settings.color("red").settings.css("font-size", "18px")
                                           ,
                                           // PHOTO + NAME
                                           newCanvas("pre_photo", "70vw" , "70vh")
                                           .add("center at 50%", "center at 4%", newText("Are you familiar with this person?<p><br>")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add("center at 50%", "center at 44%", getImage("pre_photo"))
                                           .add( "center at 50%", "center at 92%", getText("pre_name")
                                                 .settings.css("font-family","courier","font-size","20px"))                                        
                                           .add( "center at 20%", "center at 44%", getText("F_text"))
                                           .add( "center at 81%", "center at 44%", getText("J_text"))
                                           .add("center at 18%", "center at 48%", getText("yes_text_familiar"))// F-version
                                           //.add("center at 18%", "center at 48%", getText("no_text_unfamiliar"))// J-version
                                           .add("center at 83%", "center at 48%", getText("no_text_unfamiliar"))// F-version
                                           //.add("center at 83%", "center at 48%", getText("yes_text_familiar"))// J-version                                                                                   
                                           .print()
                                           ,                                         
                                           newKey("pre_photo_rating", "FJ")                                          
                                           .callback( getTimer("time_out").stop() )
                                           .log("all")  
                                           ,
                                           newTimer("time_out", 5000)
                                           .start()
                                           .log()
                                           .wait()
                                           ,     
                                           // clear everything
                                           getCanvas("pre_photo").remove()
                                           ,                                 
                                           getKey("pre_photo_rating")
                                           .disable()
                                           ,
                                           // create variable for rating response
                                           newVar("pre_photo_rating")
                                           .global().set(0) // makes sure values are defined in the column 'pre_photo_rating' and prevents cross-trial value contamination
                                           .set(getKey("pre_photo_rating") )
                                           ,
                                           // check if timedout
                                           getKey("pre_photo_rating")
                                           .test.pressed()
                                           .failure(
                                               newText("time-out", "Oops! Try to be faster.")
                                               .settings.css("font-size", "20px")
                                               .settings.css("font-family","times new roman")
                                               .settings.color("red")
                                               .settings.center()
                                               .print("40vh")
                                               ,
                                               newText("spacebar", "Press the spacebar to continue.")
                                               .settings.css("font-size", "15px")
                                               .settings.css("font-family","times new roman")
                                               .settings.center()
                                               .settings.color("red")
                                               .print("55vh")
                                               ,
                                               newKey("time-out", " ")
                                               .wait()
                                               ,
                                               getText("time-out")
                                               .remove()
                                               ,
                                               getText("spacebar")
                                               .remove()
                                           )
                                           .success(
                                           )                                          
                                           ,
                                           // WAIT
                                           newCanvas("dots", "70vw" , "70vh")
                                           .add("center at 50%", "center at 35%", newText("pleasewait_post2", "...").bold())
                                           .print()
                                           ,
                                           newTimer("wait_post2", 1000)
                                           .start()
                                           .wait()
                                           ,
                                           getCanvas("dots").remove()
                                       )
                                       .log("prolificID", getVar("proID"))
                                       .log("age", getVar("IDage"))
                                       .log("sex", getVar("IDsex"))
                                       .log("L2", getVar("IDling"))
                                       .log("whichL2", getVar("whichL2"))
                                       
                                       .log( "yes_key" , getVar("yes_key"))
                                       .log( "no_key" , getVar("no_key"))
                                       
                                       .log("number", variable.number)
                                       .log("item_id" , variable.item_id )
                                       .log("type", variable.type)
                                       
                                       .log("life_status" , variable.life_status)
                                       .log("lifetime" , variable.lifetime)
                                       .log("died" , variable.died)
                                       
                                       .log("tense", variable.tense)  
                                       .log("mismatch", variable.mismatch)
                                       .log("match", variable.match)
                                       .log("condition" , variable.condition)
                                       .log("sentence_rating", getVar("sentence_rating"))
                                       
                                       .log("occupation" , variable.occupation)  
                                       .log("nationality" , variable.nationality)
                                       
                                       .log("sentence" , variable.critical)
                                       .log("list", variable.list)
                                       .log("name" , variable.name) 
                                       .log("file_name" , variable.file_name)   
                                       
                                       .log("bare_verb", variable.bare_verb)  
                                       .log("life_status_year_verb", variable.life_status_year_verb)
                                       .log("life_status_year_before", variable.life_status_year_before)
                                       .log("life_status_year_after", variable.life_status_year_after)
                                       .log("life_status_year_before_match", variable.life_status_year_before_match)
                                       .log("life_status_year_correct", variable.life_status_year_correct) 
                                       
                                       .log( "notice", "pre_prac")  
                                       .log( "about", "pre_prac")     
                                       .log( "easyhard", "pre_prac")  
                                       .log( "strategy", "pre_prac")  
                                       
                                       .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                       
                                      ]);  
//====================================================================================================================================================================================================================
// 7. Pre-Task explanation screen

PennController( "pre_task_start",
                newText("pre_start", "<p>That was the practice round. When you're ready to continue, press the yes-key.")
                .settings.css("font-size", "20px")
                .print()   
                ,
                newKey("yes","F") //F-Version
                //newKey("yes","J") //J-Version
                .wait()
               )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "pre_task_intro2" )
    .log("item_id" , "pre_task_intro2" )
    .log("type", "pre_task_intro2")
    
    .log("life_status" , "pre_task_intro2")
    .log("lifetime" , "pre_task_intro2")
    .log("died" , "pre_task_intro2")
    
    .log("tense", "pre_task_intro2")  
    .log("mismatch", "pre_task_intro2")
    .log("match", "pre_task_intro2")
    .log("condition" , "pre_task_intro2")
    .log("sentence_rating", "pre_task_intro2")
    
    .log("occupation" , "pre_task_intro2")  
    .log("nationality" , "pre_task_intro2")
    
    .log("sentence" , "pre_task_intro2")
    .log("list", "pre_task_intro2")
    .log("name" , "pre_task_intro2")
    .log("file_name" , "pre_task_intro2")
    .log("file_name" , "pre_task_intro2" )
    
    .log("bare_verb", "pre_task_intro2")  
    .log("life_status_year_verb", "pre_task_intro2")
    .log("life_status_year_before", "pre_task_intro2")
    .log("life_status_year_after", "pre_task_intro2")
    .log("life_status_year_before_match", "pre_task_intro2")
    .log("life_status_year_correct", "pre_task_intro2")   
    
    .log( "notice", "pre_task_intro2")  
    .log( "about", "pre_task_intro2")     
    .log( "easyhard", "pre_task_intro2")  
    .log( "strategy", "pre_task_intro2")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 11. Pre-task Critical
PennController. Template( PennController.GetTable( "Crit_Stimuli_HistLifetime.csv")// change this line for the appropriate experimental list
                          .filter("type" , "critical")
                          ,
                          variable => ["pre_task_crit",
                                       "PennController", PennController(
                                           defaultText
                                           .css({"font-family":"courier","font-size":"20px"})
                                           .center()
                                           ,
                                           defaultSelector
                                           .once()
                                           .log()
                                           ,
                                           defaultCanvas
                                           .log()
                                           .center()
                                           // NEW TEXT
                                           ,
                                           newImage("pre_photo",  variable.file_name)
                                           .size(370)
                                           ,
                                           newText("pre_name", variable.name)
                                           ,
                                           
                                           newText("F_text", "F")
                                           ,
                                           newText("J_text", "J")
                                           ,
                                           newText("yes_text_familiar", "<i>(familiar)")
                                           .settings.color("green").settings.css("font-size", "18px")          
                                           ,
                                           newText("no_text_unfamiliar", "<i>(unfamiliar)")
                                           .settings.color("red").settings.css("font-size", "18px")
                                           ,
                                           // PHOTO + NAME
                                           newCanvas("pre_photo", "70vw" , "70vh")
                                           .add("center at 50%", "center at 40%", getImage("pre_photo"))
                                           .add( "center at 50%", "center at 88%", getText("pre_name"))                                           
                                           .add( "center at 18%", "center at 40%", getText("F_text"))
                                           .add( "center at 83%", "center at 40%", getText("J_text"))
                                           .add("center at 16%", "center at 44%", getText("yes_text_familiar"))// F-version
                                           //.add("center at 16%", "center at 44%", getText("no_text_unfamiliar"))// J-version
                                           .add("center at 85%", "center at 44%", getText("no_text_unfamiliar"))// F-version
                                           //.add("center at 85%", "center at 44%", getText("yes_text_familiar"))// J-version                                                                                   
                                           .print()
                                           ,
                                           
                                           newKey("pre_photo_rating", "FJ")
                                           .log()                                          
                                           .wait()
                                           ,     
                                           // clear everything
                                           getCanvas("pre_photo").remove()
                                           ,                                 
                                           getKey("pre_photo_rating")
                                           .disable()
                                           ,
                                           // create variable for rating response
                                           newVar("pre_photo_rating")
                                           .global().set(0) // makes sure values are defined in the column 'pre_photo_rating' and prevents cross-trial value contamination
                                           .set(getKey("pre_photo_rating") )
                                           ,
                                           // WAIT
                                           newCanvas("dots", "70vw" , "70vh")
                                           .add("center at 50%", "center at 35%", newText("pleasewait_post2", "...").bold())
                                           .print()
                                           ,
                                           newTimer("wait_post2", 1000)
                                           .start()
                                           .wait()
                                           ,
                                           getCanvas("dots").remove()
                                       )
                                       
                                       .log("prolificID", getVar("proID"))
                                       .log("age", getVar("IDage"))
                                       .log("sex", getVar("IDsex"))
                                       .log("L2", getVar("IDling"))
                                       .log("whichL2", getVar("whichL2"))   
                                       .log( "yes_key" , getVar("yes_key"))
                                       .log( "no_key" , getVar("no_key"))
                                       
                                       .log("item_id" , variable.item_id )
                                       .log("type", variable.type)
                                       .log("life_status" , variable.life_status)
                                       .log("lifetime" , variable.lifetime)
                                       .log("died" , variable.died)
                                       
                                       .log("tense", variable.tense)  
                                       .log("mismatch", variable.mismatch)
                                       .log("match", variable.match)
                                       .log( "condition" , variable.condition)
                                       .log("pre_photo_rating", getVar("pre_photo_rating"))
                                       .log("sentence_rating", "pre_crit")
                                       
                                       .log("occupation" , variable.occupation)
                                       .log("nationality" , variable.nationality)
                                       
                                       .log( "sentence" , variable.critical)
                                       .log("list", variable.list)
                                       .log("name" , variable.name)
                                       .log("file_name" , variable.file_name)  
                                       
                                       .log("bare_verb", variable.bare_verb)  
                                       .log("life_status_year_verb", variable.life_status_year_verb)
                                       .log("life_status_year_before", variable.life_status_year_before)
                                       .log("life_status_year_after", variable.life_status_year_after)
                                       .log("life_status_year_before_match", variable.life_status_year_before_match)
                                       .log("life_status_year_correct", variable.life_status_year_correct)   
                                       
                                       .log( "notice", "pre_crit")  
                                       .log( "about", "pre_crit")     
                                       .log( "easyhard", "pre_crit")  
                                       .log( "strategy", "pre_crit")  
                                       
                                       
                                       .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                       
                                      ]);       


//====================================================================================================================================================================================================================
// 11. Pre-task Filler
PennController. Template( PennController.GetTable( "Fillers_HistLifetime.csv")// change this line for the appropriate experimental list
                          //.filter("pre_task" , "yes")
                          ,
                          variable => ["pre_task_fill",
                                       "PennController", PennController(
                                           defaultText
                                           .css({"font-family":"courier","font-size":"20px"})
                                           .center()
                                           ,
                                           defaultSelector
                                           .once()
                                           .log()
                                           ,
                                           defaultCanvas
                                           .log()
                                           .center()
                                           // NEW TEXT
                                           ,
                                           newImage("pre_photo",  variable.file_name)
                                           .size(370)
                                           ,
                                           newText("pre_name", variable.name)
                                           ,
                                           newText("F_text", "F")
                                           ,
                                           newText("J_text", "J")
                                           ,
                                           newText("yes_text_familiar", "<i>(familiar)")
                                           .settings.color("green").settings.css("font-size", "18px")          
                                           ,
                                           newText("no_text_unfamiliar", "<i>(unfamiliar)")
                                           .settings.color("red").settings.css("font-size", "18px")
                                           ,
                                           // PHOTO + NAME
                                           newCanvas("pre_photo", "70vw" , "70vh")
                                           .add("center at 50%", "center at 40%", getImage("pre_photo"))
                                           .add( "center at 50%", "center at 88%", getText("pre_name"))                                           
                                           .add( "center at 18%", "center at 40%", getText("F_text"))
                                           .add( "center at 83%", "center at 40%", getText("J_text"))
                                           .add("center at 16%", "center at 44%", getText("yes_text_familiar"))// F-version
                                           //.add("center at 16%", "center at 44%", getText("no_text_unfamiliar"))// J-version
                                           .add("center at 85%", "center at 44%", getText("no_text_unfamiliar"))// F-version
                                           //.add("center at 85%", "center at 44%", getText("yes_text_familiar"))// J-version                                                                                   
                                           .print()
                                           ,
                                           newKey("pre_photo_rating", "FJ")
                                           .log()                                         
                                           .wait()
                                           ,     
                                           // clear everything
                                           getCanvas("pre_photo").remove()
                                           ,                                 
                                           getKey("pre_photo_rating")
                                           .disable()
                                           ,
                                           // create variable for rating response
                                           newVar("pre_photo_rating")
                                           .global().set(0) // makes sure values are defined in the column 'pre_photo_rating' and prevents cross-trial value contamination
                                           .set(getKey("pre_photo_rating") )
                                           ,
                                           // WAIT
                                           newCanvas("dots", "70vw" , "70vh")
                                           .add("center at 50%", "center at 35%", newText("pleasewait_post2", "...").bold())
                                           .print()
                                           ,
                                           newTimer("wait_post2", 1000)
                                           .start()
                                           .wait()
                                           ,
                                           getCanvas("dots").remove()
                                       )
                                       
                                       .log("prolificID", getVar("proID"))
                                       .log("age", getVar("IDage"))
                                       .log("sex", getVar("IDsex"))
                                       .log("L2", getVar("IDling"))
                                       .log("whichL2", getVar("whichL2"))   
                                       .log( "yes_key" , getVar("yes_key"))
                                       .log( "no_key" , getVar("no_key"))
                                       
                                       .log("item_id" , variable.item_id )
                                       .log("type", variable.type)
                                       .log("life_status" , variable.life_status)
                                       .log("lifetime" , variable.lifetime)
                                       .log("died" , variable.died)
                                       
                                       .log("tense", variable.tense)  
                                       .log("mismatch", variable.mismatch)
                                       .log("match", variable.match)
                                       .log( "condition" , variable.condition)
                                       .log("pre_photo_rating", getVar("pre_photo_rating"))
                                       .log("sentence_rating", "pre_crit")
                                       
                                       .log("occupation" , variable.occupation)
                                       .log("nationality" , variable.nationality)
                                       
                                       .log( "sentence" , variable.critical)
                                       .log("list", variable.list)
                                       .log("name" , variable.name)
                                       .log("file_name" , variable.file_name)  
                                       
                                       .log("bare_verb", variable.bare_verb)  
                                       .log("life_status_year_verb", variable.life_status_year_verb)
                                       .log("life_status_year_before", variable.life_status_year_before)
                                       .log("life_status_year_after", variable.life_status_year_after)
                                       .log("life_status_year_before_match", variable.life_status_year_before_match)
                                       .log("life_status_year_correct", variable.life_status_year_correct)   
                                       
                                       .log( "notice", "pre_fill")  
                                       .log( "about", "pre_fill")     
                                       .log( "easyhard", "pre_fill")  
                                       .log( "strategy", "pre_fill")  
                                       
                                       
                                       .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                       
                                      ]);       


//====================================================================================================================================================================================================================
// 7. Experiment explanation screen

PennController( "instructions1",
                newText("pre_end", "<p>That concludes the pre-experiment task. You can now start the actual experiment. <p>Hit the spacebar to continue.")
                .settings.css("font-size", "20px")
                .print()
                ,
                newKey("cont", " ")
                .wait()
                ,
                getText("pre_end").remove()
                ,  
                newText("instructions_a", "<b>Description of the experiment</b><p>"
                        + "In the actual experiment, you will be looking at photos of and reading sentences about cultural figures."
                        + "<br>Some of them you have already seen in the pre-experimental task."
                        + "<p>(1) First, you will be presented with <b>a photo and a sentence </b> introducing the cultural figure.<p>"
                        + "Once you looked at the photo and read the sentence, hit the spacebar.<br>"
                       )
                .settings.css("font-size", "20px")
                ,
                newCanvas("instruccanvas",900, 95)
                .settings.add("center at 50%", "center at 0%", getText("instructions_a"))
                .print()   
                ,
                newImage("ex_photo", "https://amor.cms.hu-berlin.de/~petrenca/Hist_LE_stimuliV/Sir_David_Attenborough.png")
                .settings.size(370)                                                      
                .center()
                .print()
                ,
                newText("bio", "<p>Look at the photo of Sir David Attenborough, an English broadcaster from London.")
                .css("font-family","courier","font-size", "20px")
                .center()
                .print()
                ,
                newKey("cont_to_sent", " ")
                .wait()             
                ,
                getCanvas("instruccanvas")
                .remove(getText("instructions_a"))
                ,
                getImage("ex_photo")
                .remove()
                ,
                getText("bio")
                .remove()
                ,
                getKey("cont_to_sent")
                .disable()
                ,
                
                newText("instructions_b", "<p>(2) You will then be presented with a <b>new sentence revealed chunk-by-chunk.</b> "
                        + "Hit the <b>spacebar</b> to reveal the next sentence chunk.<br>"
                       )
                .settings.css("font-size", "20px")
                ,
                newText("example1", "<p>'He ____________ ____ _____________________ ____________ __________'")
                .settings.css("font-size", "18px")
                .settings.css("font-family","courier")
                ,
                newText("example2", "<p>'He has narrated ____ _____________________ ____________ __________'")
                .settings.css("font-size", "18px")
                .settings.css("font-family","courier")
                ,
                newText("example3", "<p>'He has narrated many _____________________ ____________ __________'")
                .settings.css("font-size", "18px")
                .settings.css("font-family","courier")
                ,
                newText("example4", "<p>'He has narrated many nature documentaries, ____________ __________'")
                .settings.css("font-size", "18px")
                .settings.css("font-family","courier")
                ,
                newText("example5", "<p>'He has narrated many nature documentaries, according to __________'")
                .settings.css("font-size", "18px")
                .settings.css("font-family","courier")
                ,
                newText("example6", "<p>'He has narrated many nature documentaries, according to Wikipedia.'")
                .settings.css("font-size", "18px")
                .settings.css("font-family","courier")
                ,
                getCanvas("instruccanvas")
                .settings.add(0,0, getText("instructions_b"))
                .settings.add(70,300, getText("example1"))
                .print()  
                ,
                newKey("ex1"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example1"))
                .settings.add(70,300, getText("example2"))
                ,
                newKey("ex2"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example2"))
                .settings.add(70,300, getText("example3"))
                .print()  
                ,                
                newKey("ex3"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example3"))
                .settings.add(70,300, getText("example4"))
                ,
                newKey("ex4"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example4"))
                .settings.add(70,300, getText("example5"))
                ,
                newKey("ex4"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example5"))
                .settings.add(70,300, getText("example6"))
                ,
                newKey("ex4"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example6"))
                .remove(getText("instructions_b"))
                ,
                newText("instructions_c", "<p>(3) After this sentence, you will decide whether it naturally described "
                        + " the person whose photo you saw, based on the description you read and what you know of them."
                        + " Press the <b>'F' key</b> for <i>'yes, it fits'</i>, or the <b>'J' key</b> for <i>'no, it doesn't'</i>." // F-version
                        //+ " Press the <b>'J' key</b> for <i>'yes, it fits'</i>, or the <b>'F' key</b> for <i>'no, it doesn't'</i>." // J-version
                        + " However, during the experiment the sentences will disappear before you can make a selection, so consider this when you reach the end of the sentences."
                        + "<p>Once you've made your decision, you will continue to the next cultural figure."
                        + "<br> You only have a few seconds to make this selection, otherwise it will time out."
                        + "<p>You’ll now start a practice round with instructions in red to help you. When you’re ready to start, press the <b>spacebar</b>. <p>")
                .settings.css("font-size", "20px")
                ,
                getCanvas("instruccanvas")
                .settings.add(0,0, getText("instructions_c"))
                .print()  
                ,
                newKey("prac_start"," ")
                .wait()
               )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "pre_task_intro2" )
    .log("type", "pre_task_intro2" )
    .log("life_status" , "pre_task_intro2" )
    .log("lifetime" , "pre_task_intro2" )
    .log("died" , "pre_task_intro2" )
    
    .log("tense", "pre_task_intro2" )
    .log("mismatch", "pre_task_intro2" )
    .log("match", "pre_task_intro2" )
    .log("condition" , "pre_task_intro2" )
    
    .log("pre_photo_rating", "pre_task_intro2" )
    .log("post_photo_rating", "pre_task_intro2" )
    .log("sentence_rating", "pre_task_intro2" )
    
    .log("occupation" , "pre_task_intro2" )
    .log("nationality" , "pre_task_intro2" )    
    .log( "sentence" , "pre_task_intro2" )
    .log("list", "pre_task_intro2" )
    .log("name" , "pre_task_intro2" )
    .log("file_name" , "pre_task_intro2" )
    
    .log("bare_verb", "pre_task_intro2")  
    .log("life_status_year_verb", "pre_task_intro2" )
    .log("life_status_year_before", "pre_task_intro2" )
    .log("life_status_year_after", "pre_task_intro2" )
    .log("life_status_year_before_match", "pre_task_intro2" )
    .log("life_status_year_correct", "pre_task_intro2" )
    
    .log( "notice", "pre_task_intro2" )
    .log( "about", "pre_task_intro2" )  
    .log( "easyhard", "pre_task_intro2" )  
    .log( "strategy", "pre_task_intro2" )
    
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


//====================================================================================================================================================================================================================
// 11. Practice
PennController. Template( PennController.GetTable( "Crit_Stimuli_HistLifetime.csv")// change this line for the appropriate experimental list
                          .filter("type" , "practice")
                          ,
                          variable => ["practice",
                                       "PennController", PennController(
                                           defaultText
                                           .css({"font-size":"20px"})
                                           //.center()
                                           //.cssContainer({"width": "78vw"})
                                           ,
                                           defaultSelector
                                           .once()
                                           .log()
                                           ,
                                           defaultCanvas
                                           .log()
                                           .center()
                                           ,
                                           newImage("checkmark", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/checkmark.jpeg")
                                           .size(30,30)
                                           ,
                                           newImage("crossmark", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/crossmark.png")
                                           .size(30,30)
                                           ,
                                           // NEW TEXT
                                           
                                           /*newImage("practice_photo",  variable.file_name)
                                           .size(390)
                                           ,
                                           newText("intro_sent", variable.bio_pic)
                                           .css("font-family","courier","font-size","20px")
                                           ,
                                           */newVar("match")
                                           .set(variable.match)
                                           ,                                      
                                           // WAIT
                                           newCanvas("dots", "70vw" , "70vh")
                                           .add("center at 50%", "center at 35%", newText("pleasewait_post2", "...").bold())
                                           .print()
                                           ,
                                           newTimer("wait_post2", 1000)
                                           .start()
                                           .wait()
                                           ,
                                           getCanvas("dots").remove()
                                           ,
                                           // PHOTO + NAME
                                           newCanvas("pre_prac_photo", "70vw" , "1vh")
                                           .add("center at 50%", "center at 0%", newText("look", "Look at the photo and read the sentence.<p>")
                                                .settings.css("font-size", "18px") .settings.color("red")) 
                                           .print()
                                           ,
                                           newImage("practice_photo", variable.file_name)
                                           .size(370).center()
                                           .print()
                                           ,
                                           newText("intro_sent", "<p>" + variable.bio_pic)
                                           .css("font-family","courier","font-size","20px").center()
                                           .print()
                                           ,
                                           newText("space", "Press 'spacebar' to continue.")
                                           .settings.css("font-size", "18px").settings.color("red").center()                                            
                                           .print()
                                           ,
                                           newKey("cont_to_crit", " ")                                          
                                           .wait()
                                           ,
                                           // clear everything
                                           getCanvas("pre_prac_photo")
                                           .remove()
                                           ,   
                                           getImage("practice_photo")
                                           .remove()
                                           ,
                                           getText("intro_sent") 
                                           .remove()
                                           ,
                                           getText("space") 
                                           .remove()
                                           ,
                                           getKey("cont_to_crit")
                                           .disable()                                         
                                           ,
                                           // context sentence instructions
                                           newText ("crit_instru","<i>Read the follow-up sentence sentence<p>.")
                                           .settings.css("font-size", "15px")
                                           .settings.center()
                                           .settings.css("font-family","times new roman")
                                           .settings.color("red")
                                           .print("center at 50%","32vh")
                                           ,
                                           newText ("crit_instru_2","<p><i><b>Press the spacebar</b> to reveal the next chunk.</i>")
                                           .settings.css("font-size", "15px")
                                           .settings.center()
                                           .settings.css("font-family","times new roman")
                                           .settings.color("red")
                                           .print("center at 50%","47vh")
                                           ,                                  
                                           //critical sentence
                                           ...cumulative(variable.critical_spr, "remove")    
                                       ,
                                       // clear bio and crit sentences
                                       getText("crit_instru")
                                       .remove()
                                       ,
                                       getText("crit_instru_2")
                                       .remove()         
                                       ,
                                       // present judgement task instructions
                                       newText ("rating_instru", "<i>Did the sentence fit with the preceding sentences?<p>The 'F' key = 'yes', the 'J' key = 'no'.</i>") // F-version
                                       //newText ("rating_instru", "<i>Did the last sentence fit with the preceding sentences?<p>The 'F' key = 'no', the 'J' key = 'yes'.</i>") // J-version
                                       .settings.center()
                                       .settings.css("font-size", "15px")
                                       .settings.css("font-family","times new roman")
                                       .settings.color("red")
                                       .print("center at 50%","30vh")
                                       ,
                                       // judgement task
                                       getImage("checkmark") // F-version
                                       //getImage("crossmark") // J-version
                                       .print("30vw","45vh")
                                       ,
                                       getImage("crossmark") // F-version
                                       //getImage("checkmark") // J-version
                                       .print("70vw","45vh")
                                       ,
                                       newKey("sentence_rating", "FJ")
                                       .callback( getTimer("time_out1").stop() )
                                       .log("all")  
                                       ,
                                       newTimer("time_out1", 5000)
                                       .start()
                                       .log()
                                       .wait()
                                       ,     
                                       // clear everything
                                       getText("rating_instru").remove()
                                       ,
                                       getImage("checkmark").remove()
                                       ,
                                       getImage("crossmark").remove()
                                       ,                                  
                                       getKey("sentence_rating").disable()
                                       ,
                                       // create variable for rating response
                                       newVar("sentence_rating")
                                       .global().set(0) // makes sure values are defined in the column 'sentence_rating' and prevents cross-trial value contamination
                                       .set(getKey("sentence_rating") )
                                       ,
                                       // check if timedout
                                       getKey("sentence_rating")
                                       .test.pressed()
                                       .failure(
                                           newText("time-out", "Oops! Try to be faster.")
                                           .settings.css("font-size", "20px")
                                           .settings.css("font-family","times new roman")
                                           .settings.color("red")
                                           .settings.center()
                                           .print("40vh")
                                           ,
                                           newText("spacebar", "Press the spacebar to continue.")
                                           .settings.css("font-size", "15px")
                                           .settings.css("font-family","times new roman")
                                           .settings.center()
                                           .settings.color("red")
                                           .print("55vh")
                                           ,
                                           newKey("time-out", " ")
                                           .wait()
                                       )
                                       .success(
                                           // test response and give feedback
                                           getVar("sentence_rating")
                                           .test.is( // check if the rating...
                                               getVar("yes_key")) // ...is the same as the 'yes' key
                                           .and(getVar("match") // and if the correct answer...
                                                .test.is("yes")) // is 'yes'
                                           .or( // conversely,
                                               getVar("sentence_rating") // check if the rating...
                                               .test.is(
                                                   getVar("no_key")) // ...equals 'no'
                                               .and(getVar("match") // and if the correct answer...
                                                    .test.is("no"))
                                           ) // is 'no'
                                           .success // if either of those is true, the answer was correct
                                           (      
                                               
                                               newText ("match_text", variable.prac_correct)  
                                               .settings.css("font-size", "20px")
                                               .settings.css("font-family","times new roman")
                                               .center()
                                               //.print("20vw","40vh")
                                               .print()
                                               ,
                                               newText("spacebar", "Press the spacebar to continue.")
                                               .settings.css("font-size", "15px")
                                               .settings.italic()
                                               .settings.css("font-family","times new roman")
                                               .settings.center()
                                               .settings.color("red")
                                               //.print("20vw","50vh")
                                               .print()
                                               ,
                                               newKey("feedback1", " ")
                                               .wait()    
                                           )
                                           .failure // otherwise, the answer was wrong
                                           (  
                                               newText ("mismatch_text", variable.prac_incorrect)  
                                               .settings.css("font-size", "20px")
                                               .settings.css("font-family","times new roman")
                                               .settings.color("red")
                                               .center()
                                               //.print("20vw","40vh")
                                               .print()
                                               ,
                                               newText("spacebar", "Press the spacebar to continue.")
                                               .settings.css("font-size", "15px")
                                               .settings.italic()
                                               .settings.css("font-family","times new roman")
                                               .settings.center()
                                               .settings.color("red")
                                               //.print("20vw","50vh")
                                               .print()
                                               ,
                                               newKey("feedback2", " ")
                                               .wait()   
                                           )
                                       ))
                                       
                                       .log("prolificID", getVar("proID"))
                                       .log("age", getVar("IDage"))
                                       .log("sex", getVar("IDsex"))
                                       .log("L2", getVar("IDling"))
                                       .log("whichL2", getVar("whichL2"))
                                       
                                       .log( "yes_key" , getVar("yes_key"))
                                       .log( "no_key" , getVar("no_key"))
                                       
                                       .log("number", variable.number)
                                       .log("item_id" , variable.item_id )
                                       .log("type", variable.type)
                                       
                                       .log("life_status" , variable.life_status)
                                       .log("lifetime" , variable.lifetime)
                                       .log("died" , variable.died)
                                       
                                       .log("tense", variable.tense)  
                                       .log("mismatch", variable.mismatch)
                                       .log("match", variable.match)
                                       .log("condition" , variable.condition)
                                       .log("sentence_rating", getVar("sentence_rating"))
                                       
                                       .log("occupation" , variable.occupation)  
                                       .log("nationality" , variable.nationality)
                                       
                                       .log("sentence" , variable.critical)
                                       .log("list", variable.list)
                                       .log("name" , variable.name) 
                                       .log("file_name" , variable.file_name)   
                                       
                                       .log("bare_verb", variable.bare_verb)  
                                       .log("life_status_year_verb", variable.life_status_year_verb)
                                       .log("life_status_year_before", variable.life_status_year_before)
                                       .log("life_status_year_after", variable.life_status_year_after)
                                       .log("life_status_year_before_match", variable.life_status_year_before_match)
                                       .log("life_status_year_correct", variable.life_status_year_correct)
                                       
                                       .log( "notice", "prac")  
                                       .log( "about", "prac")     
                                       .log( "easyhard", "prac")  
                                       .log( "strategy", "prac")  
                                       
                                       .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                       
                                      ]);       

//====================================================================================================================================================================================================================
// 4. Post-practice Instructions
PennController( "instructions2" ,
                newCanvas("dots", 300, 100)
                .print()
                ,
                newText("intro_experiment", "<p>That's the end of the practice round. You can now start the actual experiment. <p> <p>The instructions that appeared during the practice round (e.g., <i>Press the spacebar to continue</i>) will no longer appear.<p> There will be two short breaks in between the three blocks.<p><b><i>Please attend to the experiment until you are finished. If you take too long, we won't be able to use your data!</i></b>")
                .settings.css("font-size", "20px")
                .print()
                ,
                newCanvas("instructions_canvas",900, 555)
                .settings.add(0, 0, getText("intro_experiment") )
                ,
                newButton("start_experiment3" ,"Continue to the experiment")
                .settings.center()
                .print()
                .wait()
                ,
                getCanvas("instructions_canvas")
                .remove()
                ,
                getButton("start_experiment3")
                .remove()
                ,
                newText("instructions_key", "<br><b>Press the spacebar to start the experiment.</b></br>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()
                ,
                newKey("continue", " ")
                .wait()
                ,  
                getText("instructions_key")
                .remove()
                ,
                getText("intro_experiment")
                .remove()
                ,
                newTimer(1000)
                .start()
                .wait()                
               )                                 //end of experiment instructions screen   
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "exp_intro2" )
    .log("item_id" , "exp_intro2" )
    .log("type", "exp_intro2")
    
    .log("life_status" , "exp_intro2")
    .log("lifetime" , "exp_intro2")
    .log("died" , "exp_intro2")
    
    .log("tense", "exp_intro2")  
    .log("mismatch", "exp_intro2")
    .log("match", "exp_intro2")
    .log("condition" , "exp_intro2")
    .log("sentence_rating", "exp_intro2")
    
    .log("occupation" , "exp_intro2")  
    .log("nationality" , "exp_intro2")
    
    .log("sentence" , "exp_intro2")
    .log("list", "exp_intro2")
    .log("name" , "exp_intro2")
    .log("file_name" , "exp_intro2")
    
    .log("bare_verb", "exp_intro2")  
    .log("life_status_year_verb", "exp_intro2")
    .log("life_status_year_before", "exp_intro2")
    .log("life_status_year_after", "exp_intro2")
    .log("life_status_year_before_match", "exp_intro2")
    .log("life_status_year_correct", "exp_intro2")   
    
    .log( "notice", "exp_intro2")  
    .log( "about", "exp_intro2")     
    .log( "easyhard", "exp_intro2")  
    .log( "strategy", "exp_intro2")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


//====================================================================================================================================================================================================================
// Critical Yes
PennController.Template( PennController.GetTable( "Crit_Stimuli_HistLifetime.csv")
                         .filter("type" , "critical")
                         .filter("match" , "yes")
                         ,  
                         
                         variable => ["critical_yes",
                                      "PennController", PennController(
                                          defaultText
                                          .css({"font-family":"courier", "font-size":"20px"})
                                          ,
                                          // NEW PHOTO and TEXT
                                          newImage("photo", variable.file_name)
                                          .size (390)
                                          ,
                                          newText ("intro_sent", variable.bio_pic)
                                          .css("font-family","courier","font-size","20px")
                                          ,
                                          newImage("checkmark", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/checkmark.jpeg")
                                          .size(30,30)
                                          ,
                                          newImage("crossmark", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/crossmark.png")
                                          .size(30,30)
                                          ,
                                          // dots
                                          newText("dots", "...")
                                          .center()
                                          .print("50vw","40vh")
                                          ,
                                          newTimer("dots", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,                                       
                                          // PHOTO + CONTEXT
                                          newCanvas("photo", 900, 400)
                                          .add("center at 50%", "center at 45%", getImage("photo"))
                                          .print()
                                          ,
                                          getText("intro_sent")
                                          .center()
                                          .print()
                                          ,
                                          newKey("cont_to_crit", " ")                                          
                                          .wait()
                                          ,
                                          // clear everything
                                          getCanvas("photo").remove()
                                          ,
                                          getText("intro_sent") .remove()
                                          ,                                 
                                          getKey("cont_to_crit")
                                          .disable()                                        
                                          ,                                  
                                          //critical sentence
                                          ...cumulative(variable.critical_spr, "remove")             
                                      ,
                                      // judgement task
                                      getImage("checkmark") // F-version
                                      //getImage("crossmark") // J-version
                                      .print("30vw","40vh")
                                      ,
                                      getImage("crossmark") // F-version
                                      //getImage("checkmark") // J-version
                                      .print("70vw","40vh")
                                      ,
                                      newKey("sentence_rating", "FJ")
                                      .callback( getTimer("time_out1").stop() )
                                      .log("all")  
                                      ,
                                      newTimer("time_out1", 5000)
                                      .start()
                                      .log()
                                      .wait()
                                      ,    
                                      // clear everything
                                      getImage("checkmark").remove()
                                      ,
                                      getImage("crossmark").remove()
                                      ,                                  
                                      getKey("sentence_rating").disable()
                                      ,
                                      // create variable for rating response
                                      newVar("sentence_rating")
                                      .global().set(0) // makes sure values are defined in the column 'sentence_rating' and prevents cross-trial value contamination
                                      .set(getKey("sentence_rating") )
                                      
                                      )                                     
                                      .log("prolificID", getVar("proID"))
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("whichL2"))
                                      
                                      .log( "yes_key" , getVar("yes_key"))
                                      .log( "no_key" , getVar("no_key"))
                                      
                                      .log("number", variable.number)
                                      .log("item_id" , variable.item_id )
                                      .log("type", variable.type)
                                      
                                      .log("life_status" , variable.life_status)
                                      .log("lifetime" , variable.lifetime)
                                      .log("died" , variable.died)
                                      
                                      .log("tense", variable.tense)  
                                      .log("mismatch", variable.mismatch)
                                      .log("match", variable.match)
                                      .log("condition" , variable.condition)
                                      .log("sentence_rating", getVar("sentence_rating"))
                                      
                                      .log("occupation" , variable.occupation)  
                                      .log("nationality" , variable.nationality)
                                      
                                      .log("sentence" , variable.critical)
                                      .log("list", variable.list)
                                      .log("name" , variable.name) 
                                      .log("file_name" , variable.file_name)   
                                      
                                      .log("bare_verb", variable.bare_verb)  
                                      .log("life_status_year_verb", variable.life_status_year_verb)
                                      .log("life_status_year_before", variable.life_status_year_before)
                                      .log("life_status_year_after", variable.life_status_year_after)
                                      .log("life_status_year_before_match", variable.life_status_year_before_match)
                                      .log("life_status_year_correct", variable.life_status_year_correct)
                                      
                                      .log( "notice", "crit_yes")  
                                      .log( "about", "crit_yes")     
                                      .log( "easyhard", "crit_yes")  
                                      .log( "strategy", "crit_yes")  
                                      
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                      
                                     ]);

//====================================================================================================================================================================================================================
// Critical No
PennController.Template( PennController.GetTable( "Crit_Stimuli_HistLifetime.csv")
                         .filter("type" , "critical")
                         .filter("match" , "no")
                         ,  
                         
                         variable => ["critical_no",
                                      "PennController", PennController(
                                          defaultText
                                          .css({"font-family":"courier", "font-size":"20px"})
                                          ,
                                          // NEW PHOTO and TEXT
                                          newImage("photo", variable.file_name)
                                          .size (390)
                                          ,
                                          newText ("intro_sent", variable.bio_pic)
                                          .css("font-family","courier","font-size","20px")
                                          ,
                                          newImage("checkmark", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/checkmark.jpeg")
                                          .size(30,30)
                                          ,
                                          newImage("crossmark", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/crossmark.png")
                                          .size(30,30)
                                          ,
                                          // dots
                                          newText("dots", "...")
                                          .center()
                                          .print("50vw","40vh")
                                          ,
                                          newTimer("dots", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,                                      
                                          // PHOTO + CONTEXT
                                          newCanvas("photo", 900, 400)
                                          .add("center at 50%", "center at 45%", getImage("photo"))
                                          .print()
                                          ,
                                          getText("intro_sent")
                                          .center()
                                          .print()
                                          ,
                                          newKey("cont_to_crit", " ")                                          
                                          .wait()
                                          ,
                                          // clear everything
                                          getCanvas("photo").remove()
                                          ,
                                          getText("intro_sent") .remove()
                                          ,                                
                                          getKey("cont_to_crit")
                                          .disable()                                        
                                          ,                                  
                                          //critical sentence
                                          ...cumulative(variable.critical_spr, "remove")             
                                      ,
                                      // judgement task
                                      getImage("checkmark") // F-version
                                      //getImage("crossmark") // J-version
                                      .print("30vw","40vh")
                                      ,
                                      getImage("crossmark") // F-version
                                      //getImage("checkmark") // J-version
                                      .print("70vw","40vh")
                                      ,
                                      newKey("sentence_rating", "FJ")
                                      .callback( getTimer("time_out1").stop() )
                                      .log("all")  
                                      ,
                                      newTimer("time_out1", 5000)
                                      .start()
                                      .log()
                                      .wait()
                                      ,    
                                      // clear everything
                                      getImage("checkmark").remove()
                                      ,
                                      getImage("crossmark").remove()
                                      ,                                  
                                      getKey("sentence_rating").disable()
                                      ,
                                      // create variable for rating response
                                      newVar("sentence_rating")
                                      .global().set(0) // makes sure values are defined in the column 'sentence_rating' and prevents cross-trial value contamination
                                      .set(getKey("sentence_rating") )
                                      
                                      )
                                      
                                      .log("prolificID", getVar("proID"))
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("whichL2"))
                                      
                                      .log( "yes_key" , getVar("yes_key"))
                                      .log( "no_key" , getVar("no_key"))
                                      
                                      .log("number", variable.number)
                                      .log("item_id" , variable.item_id )
                                      .log("type", variable.type)
                                      
                                      .log("life_status" , variable.life_status)
                                      .log("lifetime" , variable.lifetime)
                                      .log("died" , variable.died)
                                      
                                      .log("tense", variable.tense)  
                                      .log("mismatch", variable.mismatch)
                                      .log("match", variable.match)
                                      .log("condition" , variable.condition)
                                      .log("sentence_rating", getVar("sentence_rating"))
                                      
                                      .log("occupation" , variable.occupation)  
                                      .log("nationality" , variable.nationality)
                                      
                                      .log("sentence" , variable.critical)
                                      .log("list", variable.list)
                                      .log("name" , variable.name)
                                      .log("file_name" , variable.file_name)   
                                      
                                      .log("bare_verb", variable.bare_verb)  
                                      .log("life_status_year_verb", variable.life_status_year_verb)
                                      .log("life_status_year_before", variable.life_status_year_before)
                                      .log("life_status_year_after", variable.life_status_year_after)
                                      .log("life_status_year_before_match", variable.life_status_year_before_match)
                                      .log("life_status_year_correct", variable.life_status_year_correct)
                                      
                                      .log( "notice", "crit_no")  
                                      .log( "about", "crit_no")     
                                      .log( "easyhard", "crit_no")  
                                      .log( "strategy", "crit_no")  
                                      
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                      
                                     ]);

//====================================================================================================================================================================================================================
// Fillers Yes
PennController.Template( PennController.GetTable("Fillers_HistLifetime.csv")
                         .filter("type" , "filler")
                         .filter("match" , "yes")
                         ,  
                         
                         variable => ["filler_yes",
                                      "PennController", PennController(
                                          defaultText
                                          .css({"font-family":"courier", "font-size":"20px"})
                                          ,
                                          // NEW PHOTO and TEXT
                                          newImage("photo", variable.file_name)
                                          .size (390)
                                          ,
                                          newText ("intro_sent", variable.bio_pic)
                                          .css("font-family","courier","font-size","20px")
                                          ,
                                          newImage("checkmark", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/checkmark.jpeg")
                                          .size(30,30)
                                          ,
                                          newImage("crossmark", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/crossmark.png")
                                          .size(30,30)
                                          ,
                                          // dots
                                          newText("dots", "...")
                                          .center()
                                          .print("50vw","40vh")
                                          ,
                                          newTimer("dots", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,                                      
                                          // PHOTO + CONTEXT
                                          newCanvas("photo", 900, 400)
                                          .add("center at 50%", "center at 45%", getImage("photo"))
                                          .print()
                                          ,
                                          getText("intro_sent")
                                          .center()
                                          .print()
                                          ,
                                          newKey("cont_to_crit", " ")                                          
                                          .wait()
                                          ,
                                          // clear everything
                                          getCanvas("photo").remove()
                                          ,
                                          getText("intro_sent") .remove()
                                          ,                                
                                          getKey("cont_to_crit")
                                          .disable()                                        
                                          ,                                  
                                          //critical sentence
                                          ...cumulative(variable.critical_spr, "remove")             
                                      ,
                                      // judgement task
                                      getImage("checkmark") // F-version
                                      //getImage("crossmark") // J-version
                                      .print("30vw","40vh")
                                      ,
                                      getImage("crossmark") // F-version
                                      //getImage("checkmark") // J-version
                                      .print("70vw","40vh")
                                      ,
                                      newKey("sentence_rating", "FJ")
                                      .callback( getTimer("time_out1").stop() )
                                      .log("all")  
                                      ,
                                      newTimer("time_out1", 5000)
                                      .start()
                                      .log()
                                      .wait()
                                      ,    
                                      // clear everything
                                      getImage("checkmark").remove()
                                      ,
                                      getImage("crossmark").remove()
                                      ,                                  
                                      getKey("sentence_rating").disable()
                                      ,
                                      // create variable for rating response
                                      newVar("sentence_rating")
                                      .global().set(0) // makes sure values are defined in the column 'sentence_rating' and prevents cross-trial value contamination
                                      .set(getKey("sentence_rating") )
                                      
                                      )
                                      
                                      .log("prolificID", getVar("proID"))
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("whichL2"))
                                      
                                      .log( "yes_key" , getVar("yes_key"))
                                      .log( "no_key" , getVar("no_key"))
                                      
                                      .log("number", variable.number)
                                      .log("item_id" , variable.item_id )
                                      .log("type", variable.type)
                                      
                                      .log("life_status" , variable.life_status)
                                      .log("lifetime" , variable.lifetime)
                                      .log("died" , variable.died)
                                      
                                      .log("tense", variable.tense)  
                                      .log("mismatch", variable.mismatch)
                                      .log("match", variable.match)
                                      .log("condition" , variable.condition)
                                      .log("sentence_rating", getVar("sentence_rating"))
                                      
                                      .log("occupation" , variable.occupation)  
                                      .log("nationality" , variable.nationality)
                                      
                                      .log("sentence" , variable.critical)
                                      .log("list", variable.list)
                                      .log("name" , variable.name)
                                      .log("file_name" , variable.file_name)   
                                      
                                      .log("bare_verb", variable.bare_verb)  
                                      .log("life_status_year_verb", variable.life_status_year_verb)
                                      .log("life_status_year_before", variable.life_status_year_before)
                                      .log("life_status_year_after", variable.life_status_year_after)
                                      .log("life_status_year_before_match", variable.life_status_year_before_match)
                                      .log("life_status_year_correct", variable.life_status_year_correct)
                                      
                                      .log( "notice", "fill_yes")  
                                      .log( "about", "fill_yes")     
                                      .log( "easyhard", "fill_yes")  
                                      .log( "strategy", "fill_yes")  
                                      
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                      
                                     ]);
//====================================================================================================================================================================================================================
// Fillers NO
PennController.Template( PennController.GetTable("Fillers_HistLifetime.csv")
                         .filter("type" , "filler")
                         .filter("match" , "no")
                         ,  
                         
                         variable => ["filler_no",
                                      "PennController", PennController(
                                          defaultText
                                          .css({"font-family":"courier", "font-size":"20px"})
                                          ,
                                          // NEW PHOTO and TEXT
                                          newImage("photo", variable.file_name)
                                          .size (390)
                                          ,
                                          newText ("intro_sent", variable.bio_pic)
                                          .css("font-family","courier","font-size","20px")
                                          ,
                                          newImage("checkmark", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/checkmark.jpeg")
                                          .size(30,30)
                                          ,
                                          newImage("crossmark", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/crossmark.png")
                                          .size(30,30)
                                          ,
                                          // dots
                                          newText("dots", "...")
                                          .center()
                                          .print("50vw","40vh")
                                          ,
                                          newTimer("dots", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,                                      
                                          // PHOTO + CONTEXT
                                          newCanvas("photo", 900, 400)
                                          .add("center at 50%", "center at 45%", getImage("photo"))
                                          .print()
                                          ,
                                          getText("intro_sent")
                                          .center()
                                          .print()
                                          ,
                                          newKey("cont_to_crit", " ")                                          
                                          .wait()
                                          ,
                                          // clear everything
                                          getCanvas("photo").remove()
                                          ,
                                          getText("intro_sent") .remove()
                                          ,                                
                                          getKey("cont_to_crit")
                                          .disable()                                        
                                          ,                                  
                                          //critical sentence
                                          ...cumulative(variable.critical_spr, "remove")             
                                      ,
                                      // judgement task
                                      getImage("checkmark") // F-version
                                      //getImage("crossmark") // J-version
                                      .print("30vw","40vh")
                                      ,
                                      getImage("crossmark") // F-version
                                      //getImage("checkmark") // J-version
                                      .print("70vw","40vh")
                                      ,
                                      newKey("sentence_rating", "FJ")
                                      .callback( getTimer("time_out1").stop() )
                                      .log("all")  
                                      ,
                                      newTimer("time_out1", 5000)
                                      .start()
                                      .log()
                                      .wait()
                                      ,    
                                      // clear everything
                                      getImage("checkmark").remove()
                                      ,
                                      getImage("crossmark").remove()
                                      ,                                  
                                      getKey("sentence_rating").disable()
                                      ,
                                      // create variable for rating response
                                      newVar("sentence_rating")
                                      .global().set(0) // makes sure values are defined in the column 'sentence_rating' and prevents cross-trial value contamination
                                      .set(getKey("sentence_rating") )
                                      
                                      )
                                      
                                      .log("prolificID", getVar("proID"))
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("whichL2"))
                                      
                                      .log( "yes_key" , getVar("yes_key"))
                                      .log( "no_key" , getVar("no_key"))
                                      
                                      .log("number", variable.number)
                                      .log("item_id" , variable.item_id )
                                      .log("type", variable.type)
                                      
                                      .log("life_status" , variable.life_status)
                                      .log("lifetime" , variable.lifetime)
                                      .log("died" , variable.died)
                                      
                                      .log("tense", variable.tense)  
                                      .log("mismatch", variable.mismatch)
                                      .log("match", variable.match)
                                      .log("condition" , variable.condition)
                                      .log("sentence_rating", getVar("sentence_rating"))
                                      
                                      .log("occupation" , variable.occupation)  
                                      .log("nationality" , variable.nationality)
                                      
                                      .log("sentence" , variable.critical)
                                      .log("list", variable.list)
                                      .log("name" , variable.name)
                                      .log("file_name" , variable.file_name)   
                                      
                                      .log("bare_verb", variable.bare_verb)  
                                      .log("life_status_year_verb", variable.life_status_year_verb)
                                      .log("life_status_year_before", variable.life_status_year_before)
                                      .log("life_status_year_after", variable.life_status_year_after)
                                      .log("life_status_year_before_match", variable.life_status_year_before_match)
                                      .log("life_status_year_correct", variable.life_status_year_correct)
                                      
                                      .log( "notice", "fill_no")  
                                      .log( "about", "fill_no")     
                                      .log( "easyhard", "fill_no")  
                                      .log( "strategy", "fill_no")  
                                      
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                      
                                     ]);
//====================================================================================================================================================================================================================
// 2. Post-task instructions

PennController( "post_instructions",
                newText("post_instructions", "<p><b>That concludes the experiment!</b><p> <p>Before we let you go, we have two short tasks for you. <p>The first is a questionnaire about the experiment you just did.<p><p>Press the spacebar to continue to the questionnaire.")                         
                .settings.css("font-size", "20px")
                .print("center at 50%", "center at 35%")  
                ,
                newKey("post_start"," ")
                .wait()
               )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "post_instr" )
    .log("item_id" , "post_instr" )
    .log("type", "post_instr")
    
    .log("life_status" , "post_instr")
    .log("lifetime" , "post_instr")
    .log("died" , "post_instr")
    
    .log("tense", "post_instr")  
    .log("mismatch", "post_instr")
    .log("match", "post_instr")
    .log("condition" , "post_instr")
    .log("sentence_rating", "post_instr")
    
    .log("occupation" , "post_instr")  
    .log("nationality" , "post_instr")
    
    .log("sentence" , "post_instr")
    .log("list", "post_instr")
    .log("name" , "post_instr")
    .log("file_name" , "post_instr")
    
    .log("bare_verb", "post_instr")  
    .log("life_status_year_verb", "post_instr")
    .log("life_status_year_before", "post_instr")
    .log("life_status_year_after", "post_instr")
    .log("life_status_year_before_match", "post_instr")
    .log("life_status_year_correct", "post_instr")   
    
    .log( "notice", "post_instr")  
    .log( "about", "post_instr")     
    .log( "easyhard", "post_instr")  
    .log( "strategy", "post_instr")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 3. Post-experiment questionnaire

PennController("post_ques",
               newText("post-instruc", "Please answer the following questions about the experiment. <br>Try to be brief but informative.<p><p>")
               .settings.bold()
               .print()
               ,
               // Q1
               newText("notice", "(1) Was there anything about the experiment that stood out to you? Any patterns/regularities, anything strange or surprising?<p>")
               .print()
               ,
               newTextInput("notice")
               .size(600,50)
               .print()
               .log()
               ,
               newText("blank", "<p>")
               .print()
               ,
               newButton("next1", "Next Question")
               .print()
               .wait()
               ,
               getButton("next1")
               .remove()
               ,
               // Q2
               newText("about", "(2) What do you think the experiment might have been about? Make as many guesses as you like.<p>")
               .print()
               ,
               newTextInput("about")
               .size(600, 50)
               .print()
               .log()
               ,   
               newText("blank", "<p>")
               .print()
               ,            
               newButton("next2", "Next Question")
               .print()
               .wait()
               ,
               getButton("next2")
               .remove()
               ,
               //Q3
               newText("easyhard", "(3) Was there anything you found particularly easy or difficult?<p>")
               .print()
               ,
               newTextInput("easyhard","")
               .size(600, 50)
               .print()
               .log()
               ,     
               newText("blank", "<p>")
               .print()
               ,            
               newButton("next3", "Next Question")
               .print()
               .wait()
               ,
               getButton("next3")
               .remove()
               ,
               // Q4
               newText("strategy", "(4) Did you use any strategies during the experiment? If so, what were they?<p>")
               .print()
               ,
               newTextInput("strategy","")
               .size(600, 50)
               .print()
               .log()
               ,   
               newText("blank", "<p>")
               .print()
               ,              
               newButton("next4", "Finished")
               .print()
               .wait()
               ,
               // create Vars
               newVar("notice") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("notice") )
               ,
               newVar("about") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("about") )
               ,
               newVar("easyhard") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("easyhard") )
               ,
               newVar("strategy") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("strategy") )
              )  
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "post_ques" )
    .log("item_id" , "post_ques" )
    .log("type", "post_ques")
    
    .log("life_status" , "post_ques")
    .log("lifetime" , "post_ques")
    .log("died" , "post_ques")
    
    .log("tense", "post_ques")  
    .log("mismatch", "post_ques")
    .log("match", "post_ques")
    .log("condition" , "post_ques")
    .log("sentence_rating", "post_ques")
    
    .log("occupation" , "post_ques")  
    .log("nationality" , "post_ques")
    
    .log("sentence" , "post_ques")
    .log("list", "post_ques")
    .log("name" , "post_ques")
    .log("file_name" , "post_ques")
    
    .log("bare_verb", "post_ques")  
    .log("life_status_year_verb", "post_ques")
    .log("life_status_year_before", "post_ques")
    .log("life_status_year_after", "post_ques")
    .log("life_status_year_before_match", "post_ques")
    .log("life_status_year_correct", "post_ques")   
    
    
    .log( "notice", getVar("notice"))  
    .log( "about", getVar("about"))      
    .log( "easyhard", getVar("easyhard"))    
    .log( "strategy", getVar("strategy"))
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") );

//====================================================================================================================================================================================================================
// 7. Comprehension test explanation screen //

PennController( "post_task_intro",
                newText("comp1_1", "<p>Thank you for your feedback! We have a final task for you to complete before you are presented with your Prolific validation link.</b>")
                .settings.css("font-size", "20px")
                ,        
                newText("comp1_2", "You will be presented with some prompts to which you respond using the <b>F</b> and <b>J</b> keys:"
                        + " <p>(1) You will see a <b> photo and a name</b> from the experiment. Press F or J to indicate if you're familiar with the person."
                        + " <p>(2) Next, you will see the words <b>'alive'</b> and <b>'dead'</b>. Press F or J to select the one that describes the person's current status."
                        + " <p>(3) Next, you will see either <b>'was born'</b> or <b>'died'</b> and two dates. Again, press F or J to indicate which you consider to be the correct answer."
                        + "<p><p> For names that you said you don't recognise, you can guess."
                        +  "<p><p>Press the spacebar to continue to a short practice round.")
                .settings.css("font-size", "20px")
                ,
                newCanvas("compCanv", 900, 300)
                .settings.add(0,0, getText("comp1_1"))
                .settings.add(0,100, getText("comp1_2")  )
                .print()   
                ,
                newKey("compStart", " ")
                .wait()
               )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "post_intr2" )
    .log("item_id" , "post_intr2" )
    .log("type", "post_intr2")
    
    .log("life_status" , "post_intr2")
    .log("lifetime" , "post_intr2")
    .log("died" , "post_intr2")
    
    .log("tense", "post_intr2")  
    .log("mismatch", "post_intr2")
    .log("match", "post_intr2")
    .log("condition" , "post_intr2")
    .log("sentence_rating", "post_intr2")
    
    .log("occupation" , "post_intr2")  
    .log("nationality" , "post_intr2")
    
    .log("sentence" , "post_intr2")
    .log("list", "post_intr2")
    .log("name" , "post_intr2")
    .log("file_name" , "post_intr2")
    
    .log("bare_verb", "post_intr2")  
    .log("life_status_year_verb", "post_intr2")
    .log("life_status_year_before", "post_intr2")
    .log("life_status_year_after", "post_intr2")
    .log("life_status_year_before_match", "post_intr2")
    .log("life_status_year_correct", "post_intr2")   
    
    .log( "notice", "post_intr2")  
    .log( "about", "post_intr2")     
    .log( "easyhard", "post_intr2")  
    .log( "strategy", "post_intr2")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


//====================================================================================================================================================================================================================
// 11. Post Task Practice

PennController. Template( PennController.GetTable( "Crit_Stimuli_HistLifetime.csv")// change this line for the appropriate experimental list
                          .filter("type" , "practice")
                          ,
                          variable => ["post_task_prac",
                                       "PennController", PennController(
                                           defaultText
                                           .css({"font-family":"courier","font-size":"20px"})
                                           .center()
                                           ,
                                           defaultSelector
                                           .once()
                                           .log()
                                           ,
                                           defaultCanvas
                                           .log()
                                           .center()
                                           // NEW TEXT
                                           ,
                                           newImage("post_photo",  variable.file_name)
                                           .size(370)
                                           ,
                                           newText("post_name", variable.name)
                                           ,
                                           newText("life_status_correct", variable.life_status)
                                           ,
                                           newText("life_status_incorrect", variable.life_status_distractor)
                                           ,
                                           newText("life_status_year_before", variable.life_status_year_before)
                                           ,
                                           newText("life_status_year_after", variable.life_status_year_after)
                                           ,
                                           newText("F_text", "F")
                                           ,
                                           newText("J_text", "J")
                                           ,
                                           newText("yes_text", "<i>(yes)")
                                           .settings.css("font-size", "20px") .settings.color("green")          
                                           ,
                                           newText("no_text", "<i>(no)")
                                           .settings.css("font-size", "20px") .settings.color("red")
                                           ,
                                           // PHOTO
                                           newCanvas("photo", "70vw" , "70vh")
                                           .add("center at 50%", "center at 1%", newText("Are you familiar with this person?<p>")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add("center at 50%", "center at 40%", getImage("post_photo"))
                                           .add( "center at 50%", "center at 92%", getText("post_name")
                                                 .settings.css("font-family","courier","font-size","20px"))                                            
                                           .add( "center at 20%", "center at 40%", getText("F_text"))
                                           .add( "center at 79%", "center at 40%", getText("J_text"))
                                           .add("center at 20%", "center at 44%", getText("yes_text"))// F-version
                                           //.add("center at 20%", "center at 44%", getText("no_text"))// J-version
                                           .add("center at 79%", "center at 44%", getText("no_text"))// F-version
                                           //.add("center at 79%", "center at 44%", getText("yes_text"))// J-version                                                                                   
                                           .print()
                                           ,
                                           newSelector("post_photo")
                                           .add( getText("F_text"),getText("J_text"))                                             
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("photo").remove()
                                           ,
                                           // LIFE STATUS
                                           newCanvas("life_status", "70vw" , "70vh")
                                           .add("center at 50%", "center at 20%", newText("They are currently...")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add( "center at 30%", "center at 28%", getText("life_status_correct"))
                                           .add( "center at 70%", "center at 28%", getText("life_status_incorrect"))
                                           .add("center at 30%", "center at 35%", getText("F_text") )
                                           .add("center at 70%", "center at 35%", getText("J_text") )
                                           .print()
                                           ,
                                           newSelector("post_life_status")
                                           .add(getText("life_status_correct"), getText("life_status_incorrect"))
                                           .shuffle()
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           
                                           
                                           getCanvas("life_status").remove()
                                           ,
                                           // LIFE STATUS 2
                                           newCanvas("life_status2", "70vw" , "70vh")
                                           .add("center at 50%", "center at 20%", newText("They "+ variable.life_status_year_verb + "...")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add( "center at 30%", "center at 28%", getText("life_status_year_before"))
                                           .add( "center at 70%", "center at 28%", getText("life_status_year_after"))
                                           .add("center at 30%", "center at 35%", getText("F_text") )
                                           .add("center at 70%", "center at 35%", getText("J_text") )
                                           .print()
                                           ,
                                           newSelector("post_life_status2")
                                           .add(getText("life_status_year_before"), getText("life_status_year_after"))
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("life_status2").remove()
                                           ,
                                           newCanvas("dots", "70vw" , "70vh")
                                           .add("center at 50%", "center at 28%", newText("pleasewait_post2", "...").bold())
                                           .print()
                                           ,
                                           newTimer("wait_post2", 1000)
                                           .start()
                                           .wait()
                                           ,
                                           getCanvas("dots").remove()
                                       )
                                       
                                       .log("prolificID", getVar("proID"))
                                       .log("age", getVar("IDage"))
                                       .log("sex", getVar("IDsex"))
                                       .log("L2", getVar("IDling"))
                                       .log("whichL2", getVar("whichL2"))
                                       
                                       .log( "yes_key" , getVar("yes_key"))
                                       .log( "no_key" , getVar("no_key"))
                                       
                                       .log("number", variable.number)
                                       .log("item_id" , variable.item_id )
                                       .log("type", variable.type)
                                       
                                       .log("life_status" , variable.life_status)
                                       .log("lifetime" , variable.lifetime)
                                       .log("died" , variable.died)
                                       
                                       .log("tense", variable.tense)  
                                       .log("mismatch", variable.mismatch)
                                       .log("match", variable.match)
                                       .log("condition" , variable.condition)
                                       .log("sentence_rating", getVar("sentence_rating"))
                                       
                                       .log("occupation" , variable.occupation)  
                                       .log("nationality" , variable.nationality)
                                       
                                       .log("sentence" , variable.critical)
                                       .log("list", variable.list)
                                       .log("name" , variable.name)
                                       .log("file_name" , variable.file_name)   
                                       
                                       .log("bare_verb", variable.bare_verb)  
                                       .log("life_status_year_verb", variable.life_status_year_verb)
                                       .log("life_status_year_before", variable.life_status_year_before)
                                       .log("life_status_year_after", variable.life_status_year_after)
                                       .log("life_status_year_before_match", variable.life_status_year_before_match)
                                       .log("life_status_year_correct", variable.life_status_year_correct)
                                       
                                       .log( "notice", "post_prac")  
                                       .log( "about", "post_prac")     
                                       .log( "easyhard", "post_prac")  
                                       .log( "strategy", "post_prac")  
                                       
                                       .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                       
                                      ]);     


//====================================================================================================================================================================================================================
// 7. Post Task explanation screen

PennController( "post_task_start",
                newText("post_start", "<p>That was the practice round. When you're ready to continue, press the spacebar.")
                .settings.css("font-size", "20px")
                .print("center at 50%", "center at 35%")   
                ,
                newKey("compStart", " ")
                .wait()
               )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))
    
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("number", "post_start" )
    .log("item_id" , "post_start" )
    .log("type", "post_start")
    
    .log("life_status" , "post_start")
    .log("lifetime" , "post_start")
    .log("died" , "post_start")
    
    .log("tense", "post_start")  
    .log("mismatch", "post_start")
    .log("match", "post_start")
    .log("condition" , "post_start")
    .log("sentence_rating", "post_start")
    
    .log("occupation" , "post_start")  
    .log("nationality" , "post_start")
    
    .log("sentence" , "post_start")
    .log("list", "post_start")
    .log("name" , "post_start")
    .log("file_name" , "post_start")
    
    .log("bare_verb", "post_start")  
    .log("life_status_year_verb", "post_start")
    .log("life_status_year_before", "post_start")
    .log("life_status_year_after", "post_start")
    .log("life_status_year_before_match", "post_start")
    .log("life_status_year_correct", "post_start")   
    
    .log( "notice", "post_start")  
    .log( "about", "post_start")     
    .log( "easyhard", "post_start")  
    .log( "strategy", "post_start")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 11. Post task

PennController. Template( PennController.GetTable( "Crit_Stimuli_HistLifetime.csv")// change this line for the appropriate experimental list
                          .filter("type" , "critical")
                          ,
                          variable => ["post_task",
                                       "PennController", PennController(
                                           defaultText
                                           .css({"font-family":"courier","font-size":"20px"})
                                           .center()
                                           ,
                                           defaultSelector
                                           .once()
                                           .log()
                                           ,
                                           defaultCanvas
                                           .log()
                                           .center()
                                           // NEW TEXT
                                           ,
                                           newImage("post_photo",  variable.file_name)
                                           .size(370)
                                           ,
                                           newText("post_name", variable.name)
                                           ,
                                           newText("life_status_correct", variable.life_status)
                                           ,
                                           newText("life_status_incorrect", variable.life_status_distractor)
                                           ,
                                           newText("life_status_year_before", variable.life_status_year_before)
                                           ,
                                           newText("life_status_year_after", variable.life_status_year_after)
                                           ,
                                           newText("F_text", "F")
                                           ,
                                           newText("J_text", "J")
                                           ,
                                           newText("yes_text_familiar", "<i>(familiar)")
                                           .settings.color("green").settings.css("font-size", "18px")          
                                           ,
                                           newText("no_text_unfamiliar", "<i>(unfamiliar)")
                                           .settings.color("red").settings.css("font-size", "18px")
                                           ,
                                           // PHOTO
                                           newCanvas("photo", "70vw" , "70vh")
                                           .add("center at 50%", "center at 37%", getImage("post_photo"))
                                           .add( "center at 50%", "center at 92%", getText("post_name")
                                                 .settings.css("font-family","courier","font-size","20px"))                                                                                    
                                           .add( "center at 17%", "center at 35%", getText("F_text"))
                                           .add( "center at 84%", "center at 35%", getText("J_text"))
                                           .add("center at 16%", "center at 39%", getText("yes_text_familiar"))// F-version
                                           //.add("center at 16%", "center at 35%", getText("no_text_unfamiliar"))// J-version
                                           .add("center at 85%", "center at 39%", getText("no_text_unfamiliar"))// F-version
                                           //.add("center at 85%", "center at 35%", getText("yes_text_familiar"))// J-version                                                                                   
                                           .print()
                                           ,
                                           newSelector("post_photo")
                                           .add( getText("F_text"),getText("J_text"))
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("photo").remove()
                                           ,
                                           // LIFE STATUS 1
                                           newCanvas("life_status", "70vw" , "70vh")
                                           .add("center at 50%", "center at 22%", newText("curently...")
                                                .settings.css("font-size", "20px"))
                                           .add( "center at 30%", "center at 28%", getText("life_status_correct"))
                                           .add( "center at 70%", "center at 28%", getText("life_status_incorrect"))
                                           .add("center at 30%", "center at 35%", getText("F_text") )
                                           .add("center at 70%", "center at 35%", getText("J_text") )
                                           .print()
                                           ,
                                           newSelector("post_life_status")
                                           .add(getText("life_status_correct"), getText("life_status_incorrect"))
                                           .shuffle()
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("life_status").remove()
                                           ,
                                           // LIFE STATUS 2
                                           newCanvas("life_status2", "70vw" , "70vh")
                                           .add("center at 50%", "center at 22%", newText(variable.life_status_year_verb + "...")
                                                .settings.css("font-size", "20px"))
                                           .add( "center at 30%", "center at 28%", getText("life_status_year_before"))
                                           .add( "center at 70%", "center at 28%", getText("life_status_year_after"))
                                           .add("center at 30%", "center at 35%", getText("F_text") )
                                           .add("center at 70%", "center at 35%", getText("J_text") )
                                           .print()
                                           ,
                                           newSelector("post_life_status2")
                                           .add(getText("life_status_year_before"), getText("life_status_year_after"))
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("life_status2").remove()
                                           ,
                                           newCanvas("dots", "70vw" , "70vh")
                                           .add("center at 50%", "center at 22%", newText("pleasewait_post2", "...").bold())
                                           .print()
                                           ,
                                           newTimer("wait_post2", 1000)
                                           .start()
                                           .wait()
                                           ,
                                           getCanvas("dots").remove()
                                       )
                                       
                                       .log("prolificID", getVar("proID"))
                                       .log("age", getVar("IDage"))
                                       .log("sex", getVar("IDsex"))
                                       .log("L2", getVar("IDling"))
                                       .log("whichL2", getVar("whichL2"))
                                       
                                       .log( "yes_key" , getVar("yes_key"))
                                       .log( "no_key" , getVar("no_key"))
                                       
                                       .log("number", variable.number)
                                       .log("item_id" , variable.item_id )
                                       .log("type", variable.type)
                                       
                                       .log("life_status" , variable.life_status)
                                       .log("lifetime" , variable.lifetime)
                                       .log("died" , variable.died)
                                       
                                       .log("tense", variable.tense)  
                                       .log("mismatch", variable.mismatch)
                                       .log("match", variable.match)
                                       .log("condition" , variable.condition)
                                       .log("sentence_rating", getVar("sentence_rating"))
                                       
                                       .log("occupation" , variable.occupation)  
                                       .log("nationality" , variable.nationality)
                                       
                                       .log("sentence" , variable.critical)
                                       .log("list", variable.list)
                                       .log("name" , variable.name) 
                                       .log("file_name" , variable.file_name)   
                                       
                                       .log("bare_verb", variable.bare_verb)  
                                       .log("life_status_year_verb", variable.life_status_year_verb)
                                       .log("life_status_year_before", variable.life_status_year_before)
                                       .log("life_status_year_after", variable.life_status_year_after)
                                       .log("life_status_year_before_match", variable.life_status_year_before_match)
                                       .log("life_status_year_correct", variable.life_status_year_correct)
                                       
                                       .log( "notice", "post_task")  
                                       .log( "about", "post_task")      
                                       .log( "easyhard", "post_task")   
                                       .log( "strategy", "post_task")
                                       
                                       .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                       
                                      ]);    

//====================================================================================================================================================================================================================
// 3. Send results

PennController.SendResults( "send" ) // important!!! Sends all results to the server
    
    .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


// --------------------------------------------------------------------------------------------------------------
// 4. Thank you screen


PennController( "final",
                newText("<p>Thank you for your participation!<p>"
                        + "To receive your payment click here: <a href='https://app.prolific.co/submissions/complete?cc=2A6E2C0E' target='_blank' >Validate participation</a><p><p>If you have any questions about this study please contact us at <b>petrenal@hu-berlin.de</b>.")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()
                ,
                newButton("void")
                .wait()
               )
    
    .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);
