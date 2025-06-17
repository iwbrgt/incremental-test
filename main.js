
var infoboxContent = "Hover over buttons for information!";
var hoverButton = 'e';
var allInfoboxContent = new Map;
var ticks = 0n;
var expectedTicks = 0n;
var lastDate = Date.now();
var autosaveTimer = 0;






var tab = 0;

var triangles = 0;
var trianglesPerSecond = 0;
var trianglesPerClick = 1;


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

    displayNumbers(upgradeName) {
        
        document.getElementById(upgradeName + "Display").innerHTML = round(this.amount, 2);
        document.getElementById(upgradeName + "CostDisplay").innerHTML = round(this.cost, 2);

    }

}

var autoclicker = new Buyable("autoclicker", 0, 10, 2, 1000); //production doesn't matter since production is based on clickAmount
autoclicker.interval = 10000;
var drawer = new Buyable("drawer", 0, 500, 2, 1);
var printer = new Buyable("printer", 0, 5000, 2, 5);
var mathematician = new Buyable ("mathematician", 0, 10000, 2.25, 3); //produces research instead of triangles 


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

    displayNumbers(upgradeName) {
        document.getElementById(upgradeName + "CostDisplay").innerHTML = round(this.cost, 2);
        if (this.amount >= this.max && this.max != -1) {
            document.getElementById(this.name).setAttribute("disabled", "");
        }
    }


}

var clickAmountUpgrade = new Upgrade("clickAmountUpgrade", 0, 50, 2.5, -1);
var autoclickerIntervalUpgrade = new Upgrade("autoclickerIntervalUpgrade", 0, 100, 2.5, -1);
var autoclickerCostScalingUpgrade = new Upgrade("autoclickerCostScalingUpgrade", 0, 10000, 10, 5);
var drawerProductionUpgrade = new Upgrade("drawerProductionUpgrade", 0, 1000, 1.75, -1);
var printerProductionUpgrade = new Upgrade("drawerProductionUpgrade", 0, 10000, 1.75, -1);


function mainTab() {
    tab = 0;
    display();
}

function upgradeTab() {
    tab = 1;
    display();
}

function aboutTab() {
    tab = 2;
    display();
}

function optionsTab() {
    tab = 3;
    display();
}

function display() {
    
    switch (tab) {
        case 0:
            document.getElementById("display").innerHTML = document.getElementById("maintab").innerHTML;
            break;
        case 1:
            document.getElementById("display").innerHTML = document.getElementById("upgradetab").innerHTML;
            break;
        case 2:
            document.getElementById("display").innerHTML = document.getElementById("abouttab").innerHTML;
            break;
        case 3:
            document.getElementById("display").innerHTML = document.getElementById("optionstab").innerHTML;
            break;

    }
}

display();

function triangleClick(amount) {
    triangles += amount * trianglesPerClick;
}


function round(num, digits) {
    var intPart = Math.trunc(num);
    return Math.round((num - intPart) * (10 ** digits)) / (10 ** digits) + intPart;
}

function updateInfoboxContent() {
    
    allInfoboxContent.set('button1', "Click to gain " + trianglesPerClick + " triangles");
    allInfoboxContent.set('tab1', "main tab");
    allInfoboxContent.set('tab2', "upgrades tab");
    allInfoboxContent.set('tab3', "about tab");
    allInfoboxContent.set('tab4', "option tab");
    allInfoboxContent.set('autoclickerBuy', "Buy an autoclicker, each automatically clicks the button every " + autoclicker.interval + " milliseconds");
    allInfoboxContent.set('drawerBuy', "Buy a drawer, each draws " + drawer.production + " triangles per second.");
    allInfoboxContent.set('printerBuy', "Buy a printer, each draws " + printer.production + " triangles per second.");
    allInfoboxContent.set('clickAmountUpgrade', "Upgrades the triangles gotten from each click. Affects autoclicker clicks.");
    allInfoboxContent.set('autoclickerIntervalUpgrade', "Decreases the interval between autoclicker clicks by 20%.");
    allInfoboxContent.set('autoclickerCostScalingUpgrade', "Decreases the cost scaling on autoclickers by .1");
    allInfoboxContent.set('drawerProductionUpgrade', "Increases the per-second production of drawers by 1 per upgrade");
    allInfoboxContent.set('printerProductionUpgrade', "Increases the per-second production of printers by 20% per upgrade");
    allInfoboxContent.set('deleteSave', "Permananently deletes the localStorage autosave");



    infoboxContent = allInfoboxContent.get(hoverButton);

    if (infoboxContent == undefined) {
        infoboxContent = "Hover over buttons to get information";
    }

}

function updateNumbers() {
    autoclicker.costScaling = 2.0 - autoclickerCostScalingUpgrade.amount * .1;
    autoclicker.cost = 10 * (autoclicker.costScaling ** autoclicker.amount);
    autoclicker.interval = 10000 * ((.8) ** autoclickerIntervalUpgrade.amount);
    trianglesPerClick = 1 + clickAmountUpgrade.amount;

    drawer.production = drawerProductionUpgrade.amount + 1;

    printer.production = 5 * (1.2 ** printerProductionUpgrade.amount);




    trianglesPerSecond = printer.amount * printer.production + drawer.amount * drawer.production + autoclicker.amount * 1000 / autoclicker.interval * trianglesPerClick;
    triangleClick(autoclicker.amount * 50 / autoclicker.interval);
    triangles += drawer.amount * drawer.production / 20;
    
}

function loadAutoSave() {
    
    var save = localStorage.getItem("save");
    if (save != null && save != undefined) {
        var obj = JSON.parse(save);
        if (typeof obj.triangles !== "undefined") triangles = obj.triangles;
        if (typeof obj.buyables[0].amount !== "undefined") autoclicker.amount = obj.buyables[0].amount;
        if (typeof obj.buyables[0].interval !== "undefined") autoclicker.interval = obj.buyables[0].interval;
        if (typeof obj.buyables[1].amount !== "undefined") drawer.amount = obj.buyables[1].amount;
        if (typeof obj.upgrades[0].amount !== "undefined") clickAmountUpgrade.amount = obj.upgrades[0].amount;
        if (typeof obj.upgrades[1].amount !== "undefined") autoclickerIntervalUpgrade.amount = obj.upgrades[1].amount;
        if (typeof obj.upgrades[2].amount !== "undefined") autoclickerCostScalingUpgrade.amount = obj.upgrades[2].amount;
        if (typeof obj.upgrades[3].amount !== "undefined") drawerProductionUpgrade.amount = obj.upgrades[3].amount;
        if (typeof obj.time !== "undefined") lastDate = obj.time;
        






        autoclicker.costScaling = 2.0 - autoclickerCostScalingUpgrade.amount * .1;
        autoclicker.cost = 10 * (autoclicker.costScaling ** autoclicker.amount);
        trianglesPerClick = 1 + clickAmountUpgrade.amount;
        clickAmountUpgrade.cost = 50 * (2.5 ** clickAmountUpgrade.amount);
        autoclickerIntervalUpgrade.cost = 100 * (2.5 ** autoclickerIntervalUpgrade.amount);
        autoclickerCostScalingUpgrade.cost = 10000 * (10 ** autoclickerCostScalingUpgrade.amount);
        drawer.cost = 500 * (drawer.costScaling ** drawer.amount);
        drawerProductionUpgrade.cost = 1000 * (1.75 ** drawerProductionUpgrade.amount);
        drawer.production = drawerProductionUpgrade + 1;
   
    }
}

loadAutoSave();

function update() {

    //run functions
    //display();


    //update variables
    
    
    expectedTicks = BigInt(Date.now() - lastDate) / 50n; 
    lastDate = Date.now();
    
    for (var i = 0; i < expectedTicks; i++) {
        updateNumbers();
    }
    
    
    updateNumbers();
    
    //update number displays
    document.getElementById("triangleDisplay").innerHTML = round(triangles, 2);
    document.getElementById("trianglesPerSecond").innerHTML = round(trianglesPerSecond, 2);
    document.getElementById("clickAmountUpgradeAmountDisplay").innerHTML = round(clickAmountUpgrade.amount + 1, 2);
    document.getElementById("autoclickerIntervalUpgradeAmountDisplay").innerHTML = round(autoclicker.interval, 3);
    document.getElementById("autoclickerCostScalingUpgradeAmountDisplay").innerHTML = round(autoclicker.costScaling, 3);
    document.getElementById("drawerProductionUpgradeAmountDisplay").innerHTML = round(drawerProductionUpgrade.amount + 1, 3);
    document.getElementById("printerProductionUpgradeAmountDisplay").innerHTML = round(printer.production, 3);

    autoclicker.displayNumbers("autoclicker");
    drawer.displayNumbers("drawer");
    printer.displayNumbers("printer");



    clickAmountUpgrade.displayNumbers("clickAmountUpgrade");
    autoclickerIntervalUpgrade.displayNumbers("autoclickerIntervalUpgrade");
    autoclickerCostScalingUpgrade.displayNumbers("autoclickerCostScalingUpgrade");
    drawerProductionUpgrade.displayNumbers("drawerProductionUpgrade");
    printerProductionUpgrade.displayNumbers("printerProductionUpgrade");







    //display info
    updateInfoboxContent();
    document.getElementById("infopanel").innerHTML = "<p>" + infoboxContent + "</p>";



}

var tmpSave = {

    triangles: 0,
    time: 0,
    buyables: [
        
        {
            name: "autoclicker",
            amount: 0,
            interval: 0
        },

        {
            name: "drawer",
            amount: 0
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
        }

    ]

};
function autoSave() {

    autosaveTimer += 1;

    if (autosaveTimer >= 150) {
        tmpSave.triangles = triangles;
        tmpSave.time = lastDate;
        tmpSave.buyables[0].amount = autoclicker.amount;
        tmpSave.buyables[0].interval = autoclicker.interval;
        tmpSave.buyables[1].amount = drawer.amount;
        tmpSave.upgrades[0].amount = clickAmountUpgrade.amount;
        tmpSave.upgrades[1].amount = autoclickerIntervalUpgrade.amount;
        tmpSave.upgrades[2].amount = autoclickerCostScalingUpgrade.amount;
        tmpSave.upgrades[3].amount = drawerProductionUpgrade.amount;

        localStorage.setItem('save', JSON.stringify(tmpSave));
        autosaveTimer = 0;
    }

    document.getElementById("autosaveDisplay").innerHTML = 15 - autosaveTimer / 10;

}

function deleteSave() {
    localStorage.removeItem('save');
}




window.setInterval(function(){
    update();
}, 50);

window.setInterval(function(){
    autoSave();
}, 100)
