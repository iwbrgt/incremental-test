
var infoboxContent = "Hover over buttons for information!";
var hoverButton = 'e';
var allInfoboxContent = new Map;
var ticks = 0n;
var expectedTicks = 0n;
var lastDate = Date.now();






var tab = 0;

var triangles = 0;
var trianglesPerClick = 1;


class Buyable {

    constructor(amount, cost, costScaling, production) {
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

var autoclicker = new Buyable(0, 10, 2, 1000); //production doesn't matter since production is based on clickAmount
autoclicker.interval = 10000;
var drawer = new Buyable(0, 500, 2, 1);


class Upgrade {
    
    constructor(amount, cost, costScaling, max) {
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
    }

}

var clickAmountUpgrade = new Upgrade(0, 50, 2.5, -1);
var autoclickerIntervalUpgrade = new Upgrade(0, 100, 2.5, -1);
var autoclickerCostScalingUpgrade = new Upgrade(0, 10000, 10, 5);


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
    allInfoboxContent.set('autoclickerBuy', "Buy an autoclicker, which automatically clicks the button every " + autoclicker.interval + " milliseconds");
    allInfoboxContent.set('clickAmountUpgrade', "Upgrades the triangles gotten from each click. Affects autoclicker clicks.");
    allInfoboxContent.set('autoclickerIntervalUpgrade', "Decreases the interval between autoclicker clicks by 20%.");
    allInfoboxContent.set('autoclickerCostScalingUpgrade', "Decreases the cost scaling on autoclickers by .1");
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
    triangleClick(autoclicker.amount * 50 / autoclicker.interval);
    
}

function loadAutoSave() {
    
    var save = localStorage.getItem("save");
    if (save != null && save != undefined) {
        var obj = JSON.parse(save);
        if (typeof obj.triangles !== "undefined") triangles = obj.triangles;
        if (typeof obj.buyables[0].amount !== "undefined") autoclicker.amount = obj.buyables[0].amount;
        if (typeof obj.buyables[0].interval !== "undefined") autoclicker.interval = obj.buyables[0].interval;
        if (typeof obj.upgrades[0].amount !== "undefined") clickAmountUpgrade.amount = obj.upgrades[0].amount;
        if (typeof obj.upgrades[1].amount !== "undefined") autoclickerIntervalUpgrade.amount = obj.upgrades[1].amount;
        if (typeof obj.upgrades[2].amount !== "undefined") autoclickerCostScalingUpgrade.amount = obj.upgrades[2].amount;
        if (typeof obj.time !== "undefined") lastDate = obj.time;
        
        autoclicker.costScaling = 2.0 - autoclickerCostScalingUpgrade.amount * .1;
        autoclicker.cost = 10 * (autoclicker.costScaling ** autoclicker.amount);
        trianglesPerClick = 1 + clickAmountUpgrade.amount;
        clickAmountUpgrade.cost = 50 * (2.5 ** clickAmountUpgrade.amount);
        autoclickerIntervalUpgrade.cost = 100 * (2.5 ** autoclickerIntervalUpgrade.amount);
        autoclickerCostScalingUpgrade.cost = 10000 * (10 ** autoclickerCostScalingUpgrade.amount);

   
    }
}

loadAutoSave();

function update() {

    //run functions
    //display();


    //update variables
    
    
    expectedTicks = BigInt(Date.now() - lastDate) / 50n; 
    lastDate = Date.now();
    
    while (expectedTicks - ticks > 1000) {
        updateNumbers();
        ticks += 1n;
    } 
    ticks = 0n;
    
    updateNumbers();
    
    //update number displays
    document.getElementById("triangleDisplay").innerHTML = round(triangles, 2);
    document.getElementById("trianglesPerSecond").innerHTML = round(autoclicker.amount * 1000 / autoclicker.interval * trianglesPerClick, 2);
    document.getElementById("clickAmountUpgradeAmountDisplay").innerHTML = round(clickAmountUpgrade.amount + 1, 2);
    document.getElementById("autoclickerIntervalUpgradeAmountDisplay").innerHTML = round(autoclicker.interval, 3);
    document.getElementById("autoclickerCostScalingUpgradeAmountDisplay").innerHTML = round(autoclicker.costScaling, 3);

    autoclicker.displayNumbers("autoclicker");
    clickAmountUpgrade.displayNumbers("clickAmountUpgrade");
    autoclickerIntervalUpgrade.displayNumbers("autoclickerIntervalUpgrade");
    autoclickerCostScalingUpgrade.displayNumbers("autoclickerCostScalingUpgrade");







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
        }

    ]

};
function autoSave() {

    tmpSave.triangles = triangles;
    tmpSave.time = lastDate;
    tmpSave.buyables[0].amount = autoclicker.amount;
    tmpSave.buyables[0].interval = autoclicker.interval;
    tmpSave.upgrades[0].amount = clickAmountUpgrade.amount;
    tmpSave.upgrades[1].amount = autoclickerIntervalUpgrade.amount;
    tmpSave.upgrades[2].amount = autoclickerCostScalingUpgrade.amount;

    localStorage.setItem('save', JSON.stringify(tmpSave));

}

function deleteSave() {
    localStorage.removeItem('save');
}




window.setInterval(function(){
    update();
}, 50);

window.setInterval(function(){
    autoSave();
}, 15000)
