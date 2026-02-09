    var infoboxContent = "Hover over buttons for information!";
    var hoverButton = 'e';
    var allInfoboxContent = new Map();
    var ticks = 0n;
    var expectedTicks = 0n;
    var lastDate = Date.now();
    var autosaveTimer = 0;
    var version = "0.2.0";




    var tab;

    var achievementPoints = 0;
    var secretAchievementPoints = 0;

    var triangles = 0;
    var trianglesPerSecond = 0;
    var trianglesPerClick = 1;

    var researchUnlocked = false;
    var researchTemp = 0;
    var researchScaling = 10;
    var research = 0;
    var totalResearch = 0;
    var researchThreshhold = 10;


////////////////////////////////////////////////////////////////////////////////////////////////////    
    var bodyBgColor = "darkslateblue";
    var bodyTextColor = "aquamarine";
    var headerHeight = 20;
    var infopanelBgColor = "cornflowerblue";






/////////////////////////////////////////////////////////////////////////////////////////////////////




    class Buyable {

        constructor(name, amount, cost, costScaling, production) {
            this.name = name;
            this.amount = amount;
            this.cost = cost;
            this.costScaling = costScaling;
            this.production = production;
        }

        buy(amount) {
            for (var i = 0; i < amount; i++) {
                if (triangles >= this.cost) {
                    this.amount++;
                    triangles -= this.cost;
                    this.cost *= this.costScaling;
                }
            }
        }

        displayNumbers() {
            
            document.getElementById(this.name + "Display").innerHTML = round(this.amount, 2);
            document.getElementById(this.name + "CostDisplay").innerHTML = round(this.cost, 2);

        }

    }

    const baseBuyableCosts = [10, 500, 5000, 20000];

    const baseBuyableCostScaling = [1.8, 1.8, 1.8, 1.8];

    const baseBuyableProduction = [1000, 2, 8, -50];

    var autoclicker = new Buyable(
        "autoclicker", 
        0, 
        baseBuyableCosts[0], 
        baseBuyableCostScaling[0], 
        baseBuyableProduction[0]
    ); //production doesn't matter since production is based on clickAmount
    autoclicker.interval = 10000;


    var drawer = new Buyable(
        "drawer", 
        0, 
        baseBuyableCosts[1], 
        baseBuyableCostScaling[1], 
        baseBuyableProduction[1]
    );


    var printer = new Buyable(
        "printer", 
        0, 
        baseBuyableCosts[2], 
        baseBuyableCostScaling[2], 
        baseBuyableProduction[2]
    );


    var mathematician = new Buyable(
        "mathematician", 
        0, 
        baseBuyableCosts[3], 
        baseBuyableCostScaling[3], 
        baseBuyableProduction[3]
    ); //produces research instead of triangles 
    mathematician.enabled = true;
    mathematician.researchProduction = 1;








    class Upgrade {
        
        constructor(name, amount, cost, costScaling, max) {
            this.name = name;
            this.amount = amount;
            this.cost = cost;
            this.costScaling = costScaling;
            this.max = max;
        }

        buy(amount) {
            for (var i = 0; i < amount; i++) {
                if (triangles >= this.cost && (this.max == -1 || this.max > this.amount)) {
                    this.amount++;
                    triangles -= this.cost;
                    this.cost *= this.costScaling;
                }
            }
        }

        displayNumbers() {
           
            document.getElementById(this.name + "CostDisplay").innerHTML = round(this.cost, 2);
          
            if (this.max < 0) {
                document.getElementById(this.name + "AmountDisplay").innerHTML = round(this.amount, 2);
            } else {
                document.getElementById(this.name + "AmountDisplay").innerHTML = round(this.amount, 2) + "/" + round(this.max, 2);
            }
          
            if (this.amount >= this.max && this.max != -1) {
                document.getElementById(this.name).setAttribute("disabled", "");
            }
        }


    }


    const upgradeNames = ["clickAmountUpgrade", "autoclickerIntervalUpgrade", "autoclickerCostScalingUpgrade", "drawerProductionUpgrade", "printerProductionUpgrade"];

    const upgradeMaxes = [-1, -1, 5, -1, -1];

    const baseUpgradeCosts = [50, 100, 10000, 1000, 10000];

    const baseUpgradeCostScaling = [2.5, 2.5, 10, 1.5, 1.75];

    var upgrades = [];

    for (i in upgradeNames) {
        upgrades.push(new Upgrade(upgradeNames[i], 0, baseUpgradeCosts[i], baseUpgradeCostScaling[i], upgradeMaxes[i]));
    }
    
    


    class Research {

        constructor(name, row, column, required, cost, bought, shortDesc, description, xpos, ypos) {
            this.name = name;
            this.row = row;
            this.column = column;
            this.required = required;
            this.cost = cost;
            this.bought = bought;
            this.shortDesc = shortDesc;
            this.description = description;
            this.xpos = xpos;
            this.ypos = ypos;
        }

        buy() {
            if (research >= this.cost && (this.required.bought || this.required === 'n/a') && !this.bought) {
                research = research - this.cost;
                this.bought = true;
            }
        }


    }



        
            var _1_1 = new Research(
                "_1_1", 
                1, 
                1, 
                'n/a', 
                2, 
                false,
                "Tools",
                "Give your drawers and mathematicians tools, doubling their production.",
                0,
                0
            );
            var _2_1 = new Research(
                "_2_1", 
                2, 
                1, 
                _1_1, 
                3, 
                false,
                "Mathematician Tools",
                "Invent more specialized tools for your mathematicians, multiplying their production by 4.",
                0,
                0
            );
            var _2_2 = new Research(
                "_2_2", 
                2,
                2,
                _1_1,
                3, 
                false,
                "Drawing Tools",
                "Invent more specialized tools for drawers, multiplying their production by 4.",
                0,
                0
            );
            var _3_1 = new Research(
                "_3_1",
                3,
                1,
                _2_1,
                3,
                false,
                "Mathematical Efficiency",
                "Better motivate your mathematicians, multiplying their production by 10.",
                0,
                0
            );
            var _3_2 = new Research(
                "_3_2",
                3,
                2,
                _2_1,
                3,
                false,
                "Mathematical Cooperation",
                "Have your mathematicians cooperate better, making each one bought boost their production by 20%.",
                0,
                0
            );
            var _3_3 = new Research(
                "_3_3",
                3,
                3,
                _2_2,
                3,
                false,
                "Drawing Efficiency",
                "Ensure you hire more capable drawers, multiplying their production by 5.",
                0,
                0
            );
            var _3_4 = new Research(
                "_3_4",
                3,
                4,
                _2_2,
                3,
                false,
                "Drawing Cooperation",
                "Have your drawers cooperate better, making each one bought boost their production by 10%.",
                0,
                0
            );
            var _3_5 = new Research(
                "_3_5",
                3,
                5,
                _2_2,
                4,
                false,
                "Improved packing",
                "Improve how triangles are arranged on the sheets printed by printers, multiplying printer production by 3.",
                0,
                0
            );

        
    var researches = [
        _1_1,
        _2_1,
        _2_2,
        _3_1,
        _3_2,
        _3_3,
        _3_4,
        _3_5,

    ];


    function displayResearches() {
        var contents = "";
        var row = 1;
        for (var i of researches) {
            
            if (i.row > row) {
                contents = contents + "<br>";
            }
            row = i.row;
            contents = contents + "<button class=\"research\" id=\"" + i.name + "\" onmouseover=\"hoverButton = \'" + i.name +"\'\" onclick=\"" + i.name + ".buy()\">";
            
            contents = contents + "Buy research: " + i.shortDesc + "</button>";

        }


        document.getElementById("researchArea").innerHTML = contents;

        var totalColumns = 0;
        row = 1;



        const buttonWidth = 10;
        const buttonHeight = 20;


        for (var i of researches) {
            var margin = 0;
            document.getElementById(i.name).style.top = (((i.row - 1) * 40) + 0) + "%";
            i.ypos = (((i.row - 1) * 40) + 0) + buttonHeight / 2;
            if (i.row > row) {
                margin = (100 - (totalColumns * buttonWidth)) / (totalColumns + 1);
                for (var j of researches) {
                    if (j.row == (row)) {
                        document.getElementById(j.name).style.left = margin + (j.column - 1) * (margin + buttonWidth) + "%";
                        j.xpos = margin + (j.column - 1) * (margin + buttonWidth) + buttonWidth / 2;
                    }
                }
                totalColumns = 0;
            }
            row = i.row;
            totalColumns++;
        }

        margin = (100 - (totalColumns * 10)) / (totalColumns + 1);
        for (var j of researches) {
            if (j.row == (row)) {
                document.getElementById(j.name).style.left = margin + (j.column - 1) * (margin + buttonWidth) + "%";
                j.xpos = margin + (j.column - 1) * (margin + buttonWidth) + (buttonWidth / 2);

            }
        }

        var canvas = document.getElementById("canvas");
        canvas.width = document.getElementById("researchAreaWrapper").getBoundingClientRect().width;
        canvas.height = document.getElementById("researchAreaWrapper").getBoundingClientRect().height;
        const ctx = canvas.getContext("2d");
        var width = canvas.getBoundingClientRect().width;
        var height = canvas.getBoundingClientRect().height;
        ctx.strokeStyle = "white";
        for (var k of researches) {
            if (k.required !== "n/a") {
                ctx.beginPath();
                ctx.moveTo((k.required.xpos * width / 100), (k.required.ypos * height / 100));
                ctx.lineTo((k.xpos * width / 100), (k.ypos * height / 100));
                ctx.stroke();
            }
        }

    } 


    displayResearches();

    window.onresize = displayResearches;


    function respecResearch() {

        achievements[8].have = true;

        var tmp = true;
        if (!secretAchievements[3].have) {
            for (i of researches) {
                if (i.bought) {
                    tmp = false;
                }
            }
            if (tmp) {
                secretAchievements[3].have = true;
            }
        }

        research = totalResearch;

        for (var i of researches) {
                i.bought = false;
            
        }


    }


    var achievementPoints = 0;

    class Achievement {
        constructor(name, row, column, have, description, reward) {
            this.name = name;
            this.row = row;
            this.column = column;
            this.have = have;
            this.description = description;
            this.reward = reward;
        }
    }

    var achievementNames = [
        "A start",
        "First autoclicker",
        "Upgrade", 
        "Another producer?",
        "Mass Production",
        "Oh no, math",
        "Choices",
        "Negative Production",
        "Respec",
        "Upgraded",
    ];
    var achievementDescriptions = [
        "Get a triangle",
        "Buy an autoclicker",
        "Buy an upgrade",
        "Buy a drawer",
        "Buy a printer",
        "Buy a mathematician",
        "Buy a research",
        "Have a negative value for triangles per second",
        "Respec research",
        "Max out an upgrade",
    ];
    var achievementRewards = [
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        3,
        1,
        4,
    ];

    var achievements = [];

    for (var i = 0; i < achievementNames.length; i++) {
        var tmp = new Achievement(achievementNames[i], Math.floor(i / 5) + 1, (i % 5) + 1, false, achievementDescriptions[i], achievementRewards[i]); 
        achievements.push(tmp);
    }

    function displayAchievements() {
        var contents = ""; 
        var achievement;
        for (var i = 0; i < achievements.length; i++) {
            achievement = achievements[i];
            contents += "<div id=\"" 
            + i 
            + "\" class=\"achievement\" style=\" background-color: " + (achievement.have ? "green" : "red") + "; top: " 
            + (achievement.row * 110) 
            + "px; left: calc((100% - 5 * 110px) / 2 + " 
            + (achievement.column - 1) 
            + " * 110px);\"> <p class=\"achievName\">" 
            + achievement.name 
            + "</p>  <p class=\"achievDesc\">" 
            + achievement.description 
            + "</p>  <p class=\"achievReward\">Reward: " 
            + achievement.reward 
            + " AP</p> </div>";
        }

        document.getElementById("achievementArea").innerHTML = contents;

    }

var secretAchievementPoints = 0;

    class SecretAchievement {
        constructor(name, row, column, have, description, reward) {
            this.name = name;
            this.row = row;
            this.column = column;
            this.have = have;
            this.description = description;
            this.reward = reward;
        }
    }

    var secretAchievementNames = [
        "???",
        "Indecisive",
        "???", 
        "You do know how these work, right?",
        "???",
        "All luck",
        "Extreme luck",
        "Just ask nicely",
        "Unobtainable",
        "???",
    ];
    var secretAchievementDescriptions = [
        "???",
        "Toggle mathematicians 100 times in a session.",
        "???",
        "Respec research without research",
        "???",
        "You have a 1 in 100,000 chance of getting this achievement each tick.",
        "You have a 1 in 1,000,000,000 chance of getting this achievement each tick.",
        "Click on this achievement",
        "This achievement is unobtainable by normal means.",
        "???",
    ];
    var secretAchievementRewards = [
        1,
        2,
        1,
        1,
        1,
        1,
        3,
        1,
        2,
        1,
    ];

    var secretAchievements = [];

    for (var i = 0; i < secretAchievementNames.length; i++) {
        var tmp = new SecretAchievement(secretAchievementNames[i], Math.floor(i / 5) + 1, (i % 5) + 1, false, secretAchievementDescriptions[i], secretAchievementRewards[i]); 
        secretAchievements.push(tmp);
    }

    function displaySecretAchievements() {
        var content = ""; 
        var achievement;
        for (var i = 0; i < secretAchievements.length; i++) {
            achievement = secretAchievements[i];
            content += "<div id=\"" 
            + i 
            + "\" class=\"achievement\" style=\" background-color: " + (achievement.have ? "green" : "red") + "; top: " 
            + (achievement.row * 110) 
            + "px; left: calc((100% - 5 * 110px) / 2 + " 
            + (achievement.column - 1) 
            + " * 110px);\""
            + (i == 7 ? "onclick=\"secretAchievements[7].have = true; displaySecretAchievements();\"" : "")
            + "> <p class=\"achievName\">" 
            + (achievement.have ? achievement.name : "???")
            + "</p>  <p class=\"achievDesc\">" 
            + (achievement.have ? achievement.description : "???")
            + "</p>  <p class=\"achievReward\">Reward: " 
            + (achievement.have ? achievement.reward : "???")
            + " SAP</p> </div>";
        }

        document.getElementById("achievementArea").innerHTML = content;

    }


    var changelog = "";

    function displayChangelog() {
        
    }



    var tab;
    var subtab;

    var tabs = ["main", "upgrades", "achievements", "about", "options"]; //main, upgrades, achievements, about, options, research
    var subtabs = {
        main: ["Main"],
        upgrades: ["Triangle Upgrades"],
        achievements: ["Achievements", "Secret Achievements"],
        about: ["Credits", "Changelog"],
        options: ["Options"],
        research: ["Research"],
    }
   
    function displayTabs() {
        var tabHTML = "";
        if (researchUnlocked && !tabs.includes("research")) {
            tabs.push("research");
        }
        for (var i of tabs) {
            tabHTML = tabHTML + "<button id=\"" + i + "\" onclick=\"displayContent(\'" + i + "\');\" onmouseover=\"hoverbutton = \'" + i + "tab\'\">" + i + "</button>";
        }
        document.getElementById("tabs").innerHTML = tabHTML;
    }

    displayTabs();

    function displaySubTabs() {
        var subTabHTML = "";
        var selectedTab;
        switch (tab) {
            case "main": 
                selectedTab = subtabs.main;
                break;
            case "upgrades": 
                selectedTab = subtabs.upgrades;
                break;
            case "achievements":
                selectedTab = subtabs.achievements;
                break;
            case "about":
                selectedTab = subtabs.about;
                break;
            case "options": 
                selectedTab = subtabs.options;
                break;
            case "research":
                selectedTab = subtabs.research;
                break;
        }

        for (var i of selectedTab) {
            subTabHTML = subTabHTML + "<button id=\"" + i + "\" onclick=\"displayContent(\'" + i + "\');\" onmouseover=\"hoverbutton = \'" + i + "tab\'\">" + i + "</button>";
        }
        
        document.getElementById("subtabs").innerHTML = subTabHTML;
    }

    function displayContent(selectedTab) {
       
       
        if (tabs.includes(selectedTab)) {
            
            tab = selectedTab;
            
            switch (selectedTab) {
                case "main":
                    document.getElementById("display").innerHTML = document.getElementById("MainTabContent").innerHTML;
                    break;
                case "upgrades":
                    document.getElementById("display").innerHTML = document.getElementById("Triangle UpgradesTabContent").innerHTML;
                    break;
                case "achievements":
                    document.getElementById("display").innerHTML = document.getElementById("AchievementsTabContent").innerHTML;
                    displayAchievements();
                    break;
                case "about":
                    document.getElementById("display").innerHTML = document.getElementById("CreditsTabContent").innerHTML;
                    break;
                case "options":
                    document.getElementById("display").innerHTML = document.getElementById("OptionsTabContent").innerHTML;
                    break;
                case "research":
                    document.getElementById("display").innerHTML = document.getElementById("ResearchTabContent").innerHTML;
                    displayResearches();
                    break;            

            }
            displayTabs();
            displaySubTabs();
        
        } else {
            subtab = selectedTab;
            document.getElementById("display").innerHTML = document.getElementById((selectedTab + "TabContent")).innerHTML;
            if (subtab == "Achievements") {
                displayAchievements();
            }
            if (subtab == "Secret Achievements") {
                displaySecretAchievements();
            }
            if (subtab == "Research") {
                displayResearches();
            }

        }
    }


    displayContent("main");






    function triangleClick(amount) {
        triangles += amount * trianglesPerClick;
    }

    var tmpcounter0 = 0;
    function toggleMathematician() {
        mathematician.enabled = !mathematician.enabled;
        tmpcounter0++;
    }


    function round(num, digits) {
        var intPart = Math.trunc(num);
        return Math.round((num - intPart) * (10 ** digits)) / (10 ** digits) + intPart;
    }

    function updateInfoboxContent() {
        
        allInfoboxContent.set('button1', "Click to gain " + trianglesPerClick + " triangles");
        
        allInfoboxContent.set('maintab', "main tab");
        allInfoboxContent.set('upgradestab', "upgrades tab");
        allInfoboxContent.set('achievementstab', "achievements tab");
        allInfoboxContent.set('abouttab', "about tab");
        allInfoboxContent.set('optiontab', "option tab");
        allInfoboxContent.set('researchtab', "research tab");
        
        allInfoboxContent.set('autoclickerBuy', "Buy an autoclicker, each automatically clicks the button every " + autoclicker.interval + " milliseconds");
        allInfoboxContent.set('drawerBuy', "Buy a drawer, each draws " + drawer.production + " triangles per second.");
        allInfoboxContent.set('printerBuy', "Buy a printer, each draws " + printer.production + " triangles per second.");
        
        allInfoboxContent.set('clickAmountUpgrade', "Upgrades the triangles gotten from each click. Affects autoclicker clicks.");
        allInfoboxContent.set('autoclickerIntervalUpgrade', "Decreases the interval between autoclicker clicks by 20%.");
        allInfoboxContent.set('autoclickerCostScalingUpgrade', "Decreases the cost scaling on autoclickers by .1");
        allInfoboxContent.set('drawerProductionUpgrade', "Increases the per-second production of drawers by 1 per upgrade");
        allInfoboxContent.set('printerProductionUpgrade', "Increases the per-second production of printers by 20% per upgrade");
        
        allInfoboxContent.set('deleteSave', "Permananently deletes the localStorage autosave");

        allInfoboxContent.set('mathematicianEnable', "Toggles whether mathematicians are enabled");
        allInfoboxContent.set('mathematicianBuy', "Buy an mathematician, each consumes " + Math.abs(mathematician.production) + " triangles to produce research per second");


        allInfoboxContent.set('respec', "Resets all research and refunds research points spent");

        for (var i of researches) {

            allInfoboxContent.set(i.name, i.description + " Costs: " + i.cost + " research");

        }


        infoboxContent = allInfoboxContent.get(hoverButton);

        if (infoboxContent == undefined) {
            infoboxContent = "Hover over buttons to get information";
        }

    }

    function updateNumbers() {
        
        //update order: 
        //research, upgrades, buildings, main
        //amount, cost scaling, cost, production

        achievementPoints = 0;
        for (i of achievements) {
            if (i.have) {
                achievementPoints += i.reward;
            }
        }

        secretAchievementPoints = 0;
        for (i of secretAchievements) {
            if (i.have) {
                secretAchievementPoints += i.reward;
            }
        }



        // clickAmountUpgrade.amount = clickAmountUpgrade.amount;
        upgrades[0].costScaling = baseUpgradeCostScaling[0];
        upgrades[0].cost = baseUpgradeCosts[0] * (baseUpgradeCostScaling[0] ** upgrades[0].amount);
        
        // autoclickerIntervalUpgrade.amount = 
        upgrades[1].costScaling = baseUpgradeCostScaling[1];
        upgrades[1].cost = baseUpgradeCosts[1] * (baseUpgradeCostScaling[1] ** upgrades[1].amount);
        
        // autoclickerCostScalingUpgrade.amount = 
        upgrades[2].costScaling = baseUpgradeCostScaling[2];
        upgrades[2].cost = baseUpgradeCosts[2] * (baseUpgradeCostScaling[2] ** upgrades[2].amount);

        // drawerProductionUpgrade.amount = 
        upgrades[3].costScaling = baseUpgradeCostScaling[3];
        upgrades[3].cost = baseUpgradeCosts[3] * (baseUpgradeCostScaling[3] ** upgrades[3].amount);

        // printerProductionUpgrade.amount = 
        upgrades[4].costScaling = baseUpgradeCostScaling[4];
        upgrades[4].cost = baseUpgradeCosts[4] * (baseUpgradeCostScaling[4] ** upgrades[4].amount);

        
        // autoclicker.amount
        autoclicker.costScaling = baseBuyableCostScaling[0] - 0.1 * upgrades[2].amount;
        autoclicker.cost = baseBuyableCosts[0] * (autoclicker.costScaling ** autoclicker.amount);
        // autoclicker.production = 
        autoclicker.interval = 10000 * (0.8 ** upgrades[1].amount);
        
        //drawer.amount
        drawer.costScaling = baseBuyableCostScaling[1];
        drawer.cost = baseBuyableCosts[1] * (drawer.costScaling ** drawer.amount);
        drawer.production = baseBuyableProduction[1] + upgrades[3].amount;
        drawer.production = drawer.production * (1 + _1_1.bought);
        drawer.production = drawer.production * (1 + 3 * _2_2.bought);
        drawer.production = drawer.production * (1 + 4 * _3_3.bought);
        drawer.production = drawer.production * (1 + ((1.1 ** drawer.amount) - 1) * _3_4.bought);
        
        //printer.amount
        printer.costScaling = baseBuyableCostScaling[2];
        printer.cost = baseBuyableCosts[2] * (printer.costScaling ** printer.amount);
        printer.production = baseBuyableProduction[2] * (1.2 ** upgrades[4].amount);
        printer.production = printer.production * (1 + 2 * _3_5.bought);

        //mathematician.amount
        mathematician.costScaling = baseBuyableCostScaling[3];
        mathematician.cost = baseBuyableCosts[3] * (mathematician.costScaling ** mathematician.amount);
        mathematician.production = baseBuyableProduction[3];
        mathematician.production = mathematician.production * (1 + _1_1.bought);
        mathematician.production = mathematician.production * (1 + 3 * _2_1.bought);
        mathematician.production = mathematician.production * (1 + 9 * _3_1.bought);
        mathematician.production = mathematician.production * (1 + ((1.2 ** mathematician.amount) - 1) * _3_2.bought);

        trianglesPerSecond = printer.amount * printer.production;
        trianglesPerSecond += drawer.amount * drawer.production;
        if (triangles + mathematician.production >= 0) {
            trianglesPerSecond += (mathematician.production * (mathematician.enabled)) * mathematician.amount;
        }
        trianglesPerClick = 1 + upgrades[0].amount;
        
        trianglesPerSecond *= (1 + 0.01 * achievementPoints);

        triangles += trianglesPerSecond / 20;

        triangleClick(autoclicker.amount * 50 / autoclicker.interval);

        trianglesPerSecond += autoclicker.amount * 1000 / autoclicker.interval * trianglesPerClick;
        
        if (triangles + mathematician.production >= 0 && mathematician.enabled) {
            researchTemp += -1 * mathematician.production / 20 * mathematician.amount;
        }

        if (!researchUnlocked && (mathematician.amount > 0)) {
            researchUnlocked = (mathematician.amount > 0);
            displayTabs();
        }


        totalResearch = Math.trunc(Math.log(researchTemp) / Math.log(researchScaling));
        if (research > totalResearch) {
            research = totalResearch;
        }

        research = totalResearch;
        for (var i of researches) {
            if (i.bought) {
                research -= i.cost;
            }
        }

        researchThreshhold = 10 * (researchScaling ** totalResearch);

    }

    function checkAchievements() {

        // "Get a triangle"
        if (triangles > 0) {
            achievements[0].have = true;
        }

        //"Buy an autoclicker"
        if (autoclicker.amount > 0) {
            achievements[1].have = true;
        }

        //"Buy an upgrade"
        for (i of upgrades) {
            if (i.amount > 0) {
                achievements[2].have = true;
            }
        }

        //"Buy a drawer"
        if (drawer.amount > 0) {
            achievements[3].have = true;
        }

        //"Buy a printer"
        if (printer.amount > 0) {
            achievements[4].have = true;
        }

        //"Buy a mathematician"
        if (mathematician.amount > 0) {
            achievements[5].have = true;
        }

        //"Buy a research"
        for (i of researches) {
            if (i.bought == true) {
                achievements[6].have = true;
            }
        }

        //"Have a negative value for triangles per second"
        if (trianglesPerSecond < 0) {
            achievements[7].have = true; 
        }

        //"Respec research"

        //"Max out an upgrade"
        for (i of upgrades) {
            if (i.amount == i.max) {
                achievements[9].have = true;
            }
        }
    ////////////////////////////////////// Secret Achievements //////////////////////////////////////////
    
     //"???",
       
     
     //"Toggle mathematicians 100 times in a session.",
       if (tmpcounter0 > 99) {
        secretAchievements[1].have = true;
       }
     
     
     //"???",
     
     
     //"Respec research without research",
       
     
     //"???",
       
     
     //"You have a 1 in 100,000 chance of getting this achievement each tick.",
        if (Math.random * 100000 <= 1) {
            secretAchievements[5].have = true;
        }

     
     //"You have a 1 in 1,000,000,000 chance of getting this achievement each tick.",
        if (Math.random * 1000000000 <= 1) {
            secretAchievements[6].have = true;
        }
     
     //"Click on this achievement",
       
     
     //"This achievement is unobtainable by normal means.",
       
     
     //"???",
    
    
    
    }

    function loadAutoSave() {
        
        var save = localStorage.getItem("save");
        if (save != null && save != undefined) {
            var obj = JSON.parse(save);
            if (typeof obj.triangles !== "undefined") triangles = obj.triangles;
            
            if (typeof obj.research !== "undefined") research = obj.research;
            if (typeof obj.totalResearch !== "undefined") totalResearch = obj.totalResearch;

            if (typeof obj.researchTemp !== "undefined") researchTemp = obj.researchTemp;

            if (typeof obj.researchScaling !== "undefined") researchScaling = obj.researchScaling;        
            
            if (typeof obj.buyables[0].amount !== "undefined") autoclicker.amount = obj.buyables[0].amount;
            if (typeof obj.buyables[0].interval !== "undefined") autoclicker.interval = obj.buyables[0].interval;
            if (typeof obj.buyables[1].amount !== "undefined") drawer.amount = obj.buyables[1].amount;
            if (typeof obj.buyables[2].amount !== "undefined") printer.amount = obj.buyables[2].amount;
            if (typeof obj.buyables[3].amount !== "undefined") mathematician.amount = obj.buyables[3].amount;
            if (typeof obj.buyables[3].enabled !== "undefined") mathematician.enabled = obj.buyables[3].enabled;

            if (typeof obj.upgrades[0].amount !== "undefined") upgrades[0].amount = obj.upgrades[0].amount;
            if (typeof obj.upgrades[1].amount !== "undefined") upgrades[1].amount = obj.upgrades[1].amount;
            if (typeof obj.upgrades[2].amount !== "undefined") upgrades[2].amount = obj.upgrades[2].amount;
            if (typeof obj.upgrades[3].amount !== "undefined") upgrades[3].amount = obj.upgrades[3].amount;
            if (typeof obj.upgrades[4].amount !== "undefined") upgrades[4].amount = obj.upgrades[4].amount;
            
            if (typeof obj.researches !== "undefined") {
                for (var i of researches) {
                    if (obj.researches.includes(i.name)) {
                        i.bought = true;
                    }
                }
            }

            if (typeof obj.achievements !== "undefined") {
                for (var i of achievements) {
                    if (obj.achievements.includes(i.name)) {
                        i.have = true;
                    }
                }
                for (var i of secretAchievements) {
                    if (obj.achievements.includes(i.name)) {
                        i.have = true;
                    }
                }
            }

            if (typeof obj.time !== "undefined") lastDate = obj.time;
            



            updateNumbers();


        }
    }

    loadAutoSave();

    function update() {

        //run functions
        //display();


        //update variables
        
        
        expectedTicks = BigInt(Date.now() - lastDate) / 50n; 
        lastDate = Date.now();
        
        for (var i = 1; i < expectedTicks; i++) {
            updateNumbers();
        }
        
        
        updateNumbers();

        checkAchievements();
        
        //update number displays
        document.getElementById("triangleDisplay").innerHTML = round(triangles, 2);
        document.getElementById("trianglesPerSecond").innerHTML = round(trianglesPerSecond, 2);
        
        document.getElementById("researchDisplay").innerHTML = round(research, 1);
        document.getElementById("totalResearchDisplay").innerHTML = round(totalResearch, 1);
        document.getElementById("researchTempDisplay").innerHTML = round(researchTemp, 2);
        document.getElementById("researchThreshholdDisplay").innerHTML = round(researchThreshhold, 2);
        
        document.getElementById("achievementPointDisplay").innerHTML = round(achievementPoints, 1);
        document.getElementById("achievementPointBonusDisplay").innerHTML = "+" + round((achievementPoints), 2) + "%";
        
        document.getElementById("secretAchievementPointDisplay").innerHTML = round(secretAchievementPoints, 1);

        
        document.getElementById("clickAmountUpgradeEffectDisplay").innerHTML = round(upgrades[0].amount + 1, 2);
        document.getElementById("autoclickerIntervalUpgradeEffectDisplay").innerHTML = round(autoclicker.interval, 3);
        document.getElementById("autoclickerCostScalingUpgradeEffectDisplay").innerHTML = round(autoclicker.costScaling, 3);
        document.getElementById("drawerProductionUpgradeEffectDisplay").innerHTML = round(drawer.production, 3);
        document.getElementById("printerProductionUpgradeEffectDisplay").innerHTML = round(printer.production, 3);

        autoclicker.displayNumbers();
        drawer.displayNumbers();
        printer.displayNumbers();
        mathematician.displayNumbers();



        for (i of upgrades) {
            i.displayNumbers();
        }






        //display info
        updateInfoboxContent();
        document.getElementById("infopanel").innerHTML = "<p>" + infoboxContent + "</p>";
        if (mathematician.enabled) {
            document.getElementById("mathematicianEnable").innerHTML = 'on';
        } else {
            document.getElementById("mathematicianEnable").innerHTML = 'off';
        }

        for (i of researches) {
            if (i.bought) {
                document.getElementById(i.name).style.backgroundColor = "green";
            } else {
                document.getElementById(i.name).style.backgroundColor = "cyan";
            }
        }

    }

    var tmpSave = {

        triangles: 0,
        time: 0,
        research: 0,
        totalResearch: 0,
        researchTemp: 0,
        researchScaling: 0,
        buyables: [
            
            {
                name: "autoclicker",
                amount: 0,
                interval: 0
            },

            {
                name: "drawer",
                amount: 0
            },
        
            {
                name: "printer",
                amount: 0
            },
            
            {
                name: "mathematician",
                amount: 0,
                enabled: false,
                
            }
        ],
        upgrades: [

            {
                name: "clickAmount",
                amount: 0
            },

            {
                name: "autoclickerInterval",
                amount: 0
            },
        
            {
                name: "autoclickerCostScaling",
                amount: 0
            },

            {
                name: "drawerProductionUpgrade",
                amount: 0
            },

            {
                name: "printerProductionUpgrade",
                amount: 0
            }
        ],
        researches: [
            ""
        ],
        achievements: [
            ""
        ]

    };
    function autoSave() {

        autosaveTimer += 1;

        if (autosaveTimer >= 150) {
            
            tmpSave.triangles = triangles;

            tmpSave.research = research;

            tmpSave.totalResearch = totalResearch;

            tmpSave.researchTemp = researchTemp;

            tmpSave.researchScaling = researchScaling;
            
            tmpSave.time = lastDate;
            
            tmpSave.buyables[0].amount = autoclicker.amount;
            tmpSave.buyables[0].interval = autoclicker.interval;
            
            tmpSave.buyables[1].amount = drawer.amount;
            
            tmpSave.buyables[2].amount = printer.amount;
            
            tmpSave.buyables[3].amount = mathematician.amount;
            tmpSave.buyables[3].enabled = mathematician.enabled;

            for (i in upgrades) {
                tmpSave.upgrades[i].amount = upgrades[i].amount;
            }
            
            tmpSave.researches = [""];
            for (var i of researches) {
                if (i.bought) {
                    tmpSave.researches.push(i.name);
                }
            }
           
            tmpSave.achievements = [""];
            for (var i of achievements) {
                if (i.have) {
                    tmpSave.achievements.push(i.name);
                }
            }
            for (var i of secretAchievements) {
                if (i.have) {
                    tmpSave.achievements.push(i.name);
                }
            }
            localStorage.setItem('save', JSON.stringify(tmpSave));
            autosaveTimer = 0;
        }

        document.getElementById("autosaveDisplay").innerHTML = round(15 - autosaveTimer / 10, 1);

    }

    function deleteSave() {
        localStorage.removeItem('save');
    }




    window.setInterval(function(){
        update();
    }, 50);

    window.setInterval(function(){
        autoSave();
    }, 100);
