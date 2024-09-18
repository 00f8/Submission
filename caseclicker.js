// ==UserScript==
// @name         ScriptsMenu
// @namespace    miguel19877
// @version      1.3.1
// @description  Menu that presents in a useful way, a collection of scripts
// @author       Miguel19877
// @match        https://case-clicker.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-start
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// ==/UserScript==

//DON'T BOTHER TO TOUCH ANY VARIABLES, PLEASE ONLY TOUCH ON THE SCRIPT ON THE WEBSITE

let price = 250;
let secondstoSell = 15;
let money = false;
let active = false;

let isSellCaseActive = false;
let totalsold = 0;
let totalmoney = 0;
let apidirectory = '0ajjYSdWGr90njfxpA-1T';
let isCasePage = false;
let isCoinflipPage = false;

let autocaseopen = false;
let autocaselabel = document.createElement("label");
let autocasedropslabel = document.createElement("label");
let autofloatfavorite = false;
let autofavoritetiers = false;
let autofavoritegems = false;
let lowfloat = 0.001;
let highfloat = 0.999;
let amounttoopen = 1;
let specificfloats = false;
let specificfloatsarray = [];
let specificfloatsvalue = 0.001;
let casemultiplier = 1;
let eventtickets = false;
let tempactiveautopen = false;
let specificnames = false;
let specificnamesarray = [];
let specificnamesvalue = "";

let vaultactive = false;
let selectedclick = "money";
let autoclick = false;

let coinflipactive = false;
let coinflipbet = 1;
let dicebet = 500;
let autoclearcoinflip = false;

let upgraderactive = false;
let limitupgrader = 2;
let upgraderXvalue = 2;
let upgraderlabel = document.createElement("label");

let diceactive = false;
let buttondiceActive = false;

let temptimes = 0;
let tempwins = 0;
let temploses = 0;
let tempactive = false;

let appearence = {
  "home": true,
  "rewards": true,
  "cases": true,
  "inventory": true,
  "shop": true,
  "casino": true,
  "trading": true,
  "skillmaps": true,
  "skincollection": true,
  "therest": true
}

let amountcasescanopenperrank = {
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 3,
  6: 4,
  7: 5,
  8: 5,
  9: 5,
  10: 6,
  11: 7,
  12: 8,
  13: 9,
}
//UTILITY FUNCTIONS

const originalSend = WebSocket.prototype.send;
window.sockets = [];
WebSocket.prototype.send = function(...args) {
  if (window.sockets.indexOf(this) === -1)
    window.sockets.push(this);
  return originalSend.call(this, ...args);
};

const sellSkins = async () => {
  const res = await fetch(`/api/inventory`, {
    method: "DELETE",
    body: JSON.stringify({type: "price", value: price, currency: money ? "money" : "tokens"}),
    headers: { "Content-Type": "application/json" },
  });
  if(res.status != 200){
    sellSkins();
  }
};

  const loadAllConfigs = async () => {
    price = await GM_getValue("sellscript19877price", price);
    secondstoSell = await GM_getValue("sellscript19877secondstoSell", secondstoSell);
    money = await GM_getValue("sellscript19877money", money);
    active = await GM_getValue("sellscript19877active", active);
    isSellCaseActive = await GM_getValue("sellscript19877isSellCaseActive", isSellCaseActive);
    autocaseopen = await GM_getValue("sellscript19877autocaseopen", autocaseopen);
    vaultactive = await GM_getValue("sellscript19877vaultactive", vaultactive);
    selectedclick = await GM_getValue("sellscript19877selectedclick", selectedclick);
    autoclick = await GM_getValue("sellscript19877autoclick", autoclick);
    coinflipactive = await GM_getValue("sellscript19877coinflipactive", coinflipactive);
    coinflipbet = await GM_getValue("sellscript19877coinflipbet", coinflipbet);
    dicebet = await GM_getValue("sellscript19877dicebet", dicebet);
    upgraderactive = await GM_getValue("sellscript19877upgraderactive", upgraderactive);
    limitupgrader = await GM_getValue("sellscript19877limitupgrader", limitupgrader);
    upgraderXvalue = await GM_getValue("sellscript19877upgraderXvalue", upgraderXvalue);
    autoclearcoinflip = await GM_getValue("sellscript19877autoclearcoinflip", autoclearcoinflip);
    diceactive = await GM_getValue("sellscript19877diceactive", diceactive);
    appearence["home"] = await GM_getValue("sellscript19877home", appearence["home"]);
    appearence["rewards"] = await GM_getValue("sellscript19877rewards", appearence["rewards"]);
    appearence["cases"] = await GM_getValue("sellscript19877cases", appearence["cases"]);
    appearence["inventory"] = await GM_getValue("sellscript19877inventory", appearence["inventory"]);
    appearence["shop"] = await GM_getValue("sellscript19877shop", appearence["shop"]);
    appearence["casino"] = await GM_getValue("sellscript19877casino", appearence["casino"]);
    appearence["trading"] = await GM_getValue("sellscript19877trading", appearence["trading"]);
    appearence["skillmaps"] = await GM_getValue("sellscript19877skillmaps", appearence["skillmaps"]);
    appearence["skincollection"] = await GM_getValue("sellscript19877skincollection", appearence["skincollection"]);
    appearence["therest"] = await GM_getValue("sellscript19877therest", appearence["therest"]);
    autofloatfavorite = await GM_getValue("sellscript19877autofloatfavorite", autofloatfavorite);
    lowfloat = await GM_getValue("sellscript19877lowfloat", lowfloat);
    highfloat = await GM_getValue("sellscript19877highfloat", highfloat);
    amounttoopen = await GM_getValue("sellscript19877amounttoopen", amounttoopen);
    autofavoritetiers = await GM_getValue("sellscript19877autofavoritetiers", autofavoritetiers);
    autofavoritegems = await GM_getValue("sellscript19877autofavoritegems", autofavoritegems);
    specificfloats = await GM_getValue("sellscript19877specificfloats", specificfloats);
    specificfloatsarray = await GM_getValue("sellscript19877specificfloatsarray", specificfloatsarray);
    casemultiplier = await GM_getValue("sellscript19877casemultiplier", casemultiplier);
    eventtickets = await GM_getValue("sellscript19877eventtickets", eventtickets);
    specificnames = await GM_getValue("sellscript19877specificnames", specificnames);
    specificnamesarray = await GM_getValue("sellscript19877specificnamesarray", specificnamesarray);
    specificnamesvalue = await GM_getValue("sellscript19877specificnamesvalue", specificnamesvalue);
  };

  var originalOpen = XMLHttpRequest.prototype.open;
  var originalSend2 = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    this._method = method;  // Store the method for reference in the send override
    originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(data) {
    if (this._method === "POST" && data) {
    }
    originalSend2.apply(this, arguments);
  };

  var originalFetch = window.fetch;

  window.fetch = function(input, init) {
      if (typeof input === "string" && input.includes("https://case-clicker.com/api/open/case")) {
      }

      return originalFetch.apply(this, arguments).then(function(response) {
          if (response.url.includes("https://case-clicker.com/api/open/case")) {
              var clonedResponse = response.clone();
              clonedResponse.json().then(function(data) {
              });
          }
          return response;
      });
  };



const getCasesAmount = async () => {
    const res = await fetch("/api/cases", {
      method: "GET",
    });
    if (!res.ok) {
      const error = await res.json();
      throw error.error;
    }
    //it will only return the amount of cases, no json, just the amount
    return await res.json();
  };

const getCases = async (option) => {
        const res = await fetch("/api/cases/" + option, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
            const error = await res.json();
            throw error.error;
        }
        return await res.json();
};

let calculatelabel

const calculateAmountofDollars = async () => {
  let cases = await getCases("cases");
  let casesamount = await getCasesAmount();
  let moneycalculated = 0;
  for (var i = 0; i < cases.length; i++) {
      for (var i2 = 0; i2 < casesamount.length; i2++) {
          if (cases[i]._id == casesamount[i2]._id) {
              moneycalculated += cases[i].price * casesamount[i2].amount;
          }
      }
  }

  moneycalculated = Math.round(moneycalculated * 0.7);
  calculatelabel.innerHTML = "Sell all cases for " + moneycalculated + "$";

}

const createofSellCases = async () => {
  if (isSellCaseActive) {
    setTimeout(async function(){
      if (!document.getElementById("sellButton")) {
      let tab2 = document.getElementsByClassName("m_96bdd299");
      for (var i = 4; i < tab2.length; i++) {
          var checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = "checkbox" + i;
          checkbox.style = "width: 20px; height: 20px; margin-left: 10px; margin-right: 10px; margin-top: 15px";
          checkbox.checked = true
        //make it be in first position
          tab2[i].insertBefore(checkbox, tab2[i].childNodes[0]);
      }
      let tab = document.getElementsByClassName("m_dee7bd2f mantine-Grid-inner")[0];
      calculatelabel = document.createElement("label");
      calculatelabel.innerHTML = "Calculating...";
      calculatelabel.id = "sellButton";
      tab.appendChild(calculatelabel);
      calculateAmountofDollars();
      calculatelabel.style = "width: 100%; height: 100%; background-color: #4CAF50; color: white; padding: 14px 20px; margin: 8px 0; border: none; border-radius: 4px;";
      let button = document.createElement("button");
      button.innerHTML = "Sell All";
      button.style = "width: 100%; height: 100%; background-color: #4CAF50; color: white; padding: 14px 20px; margin: 8px 0; border: none; border-radius: 4px; cursor: pointer;";
      button.onclick = async function() {

          button.innerHTML = "Selling...";
          button.disabled = true;
          let cases = await getCases("cases");
          for (var i = 0; i < cases.length; i++) {
              let tab2 = document.getElementsByClassName("m_96bdd299");
              for (var i2 = 4; i2 < tab2.length; i2++) {
                //if mantine-Paper-root mantine-Card-root mantine-181ucls isn't contained inside the entire div, ignore it
                  if (tab2[i2].childNodes.item(1).childNodes.item(0).childNodes.item(1) == null) {
                      continue;
                  }
                  try {
                      if (tab2[i2].childNodes.item(1).childNodes.item(0).childNodes.item(1).textContent != null) {
                          if (tab2[i2].childNodes.item(1).childNodes.item(0).childNodes.item(1).textContent == cases[i].name) {
                              if (tab2[i2].childNodes.item(0).checked == false) {
                                  cases.splice(i, 1);
                              }
                          }
                      }
                  }catch (e) {
                      if (tab2[i2].childNodes.item(1).childNodes.item(1).childNodes.item(1).textContent == cases[i].name) {
                          if (tab2[i2].childNodes.item(1).checked == false) {
                              cases.splice(i, 1);
                          }
                      }
                  }
              }
          }
          let casesamount = await getCasesAmount();
          for (var i = 0; i < cases.length; i++) {
            await new Promise(r => setTimeout(r, 150));
            for (var i2 = 0; i2 < casesamount.length; i2++) {
                if (cases[i]._id == casesamount[i2]._id) {
                  let moneysold = casesamount[i2].amount * cases[i].price;
                  await fetch("/api/cases", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                          id: cases[i]._id,
                          amount: casesamount[i2].amount,
                          type: "case",
                      }),
                  });
                  totalsold = totalsold + casesamount[i2].amount;
                  totalmoney = totalmoney + moneysold;
                }
            }
        }
        totalmoney = Math.round(totalmoney * 0.7);
        alert("Sold " + totalsold + " cases for a total of " + totalmoney + "$");
        totalsold = 0;
        totalmoney = 0;
        button.innerHTML = "Sell All";
        button.disabled = false;
      }
      tab.appendChild(button);
    }
    }, 1000);
  }
};

const clearCoinflips = function() {
  let username = document.getElementsByClassName("mantine-Text-root mantine-gwxi4s")[2].innerText;
  let allGrids = document.getElementsByClassName("mantine-Grid-col mantine-12vzwvd");
  for (let i = 0; i < allGrids.length; i++) {
      let grid = allGrids[i];
      let gridUsername = grid.getElementsByClassName("mantine-Text-root mantine-gwxi4s")[0].innerText;
      let opponent = grid.getElementsByClassName("mantine-Text-root mantine-gwxi4s")[1].innerText;
      if (gridUsername != username && opponent != username) {
          grid.style.display = "none";
      }
  }
};

const restsetup = async (autoopendiv) => {
  autoopendiv.appendChild(document.createElement("br"));
  let meapi = await fetch("/api/me");
  meapi = await meapi.json();
  if (meapi.maxCaseOpenMultiplier > 1) {
    let casemultiplierlabel = document.createElement("label");
    casemultiplierlabel.innerHTML = "Case Multiplier: ";
    casemultiplierlabel.style = "font-size: 16px; margin-left: 10px; margin-left: 10px; ";
    autoopendiv.appendChild(casemultiplierlabel);
    let casemultiplierinput = document.createElement("input");
    casemultiplierinput.type = "number";
    casemultiplierinput.style = "width: 100px; height: 30px; font-size: 16px;";
    casemultiplierinput.value = casemultiplier;
    casemultiplierinput.onchange = function(){
      casemultiplier = casemultiplierinput.value;
      GM_setValue("sellscript19877casemultiplier", casemultiplier);
    }
    autoopendiv.appendChild(casemultiplierinput);
    done = true;
  }
  autoopendiv.appendChild(document.createElement("br"));
  let specificnamesbutton = document.createElement("button");
  specificnamesbutton.innerHTML = "Specific Names: OFF";
  specificnamesbutton.style = "width: 100px; margin-top:10px; height: 30px; font-size: 12px; margin-left: 10px;background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
  if (specificnames){
    specificnamesbutton.innerHTML = "Specific Names: ON";
    specificnamesbutton.style.backgroundColor = "#46da0f";
  }
  specificnamesbutton.onclick = function(){
    specificnames = !specificnames;
    GM_setValue("sellscript19877specificnames", specificnames);
    if (specificnames){
      specificnamesbutton.innerHTML = "Specific Names: ON";
      specificnamesbutton.style.backgroundColor = "#46da0f";
    } else {
      specificnamesbutton.innerHTML = "Specific Names: OFF";
      specificnamesbutton.style.backgroundColor = "#da1b0f";
    }
  }
  autoopendiv.appendChild(specificnamesbutton);
  let specificnamesinput = document.createElement("input");
  specificnamesinput.type = "text";
  specificnamesinput.style = "width: 100px; height: 30px; font-size: 16px; margin-left: 10px;";
  specificnamesinput.value = specificnamesvalue;
  specificnamesinput.onchange = function(){
    specificnamesvalue = specificnamesinput.value;
    GM_setValue("sellscript19877specificnamesvalue", specificnamesvalue);
  }
  autoopendiv.appendChild(specificnamesinput);
  let specificnamesaddbutton = document.createElement("button");
  specificnamesaddbutton.innerHTML = "Add";
  specificnamesaddbutton.style = "width: 100px; margin-top:10px; height: 30px; font-size: 12px; margin-left: 10px;background-color: #636a7d; border: none; border-radius: 5px; color: white;";
  specificnamesaddbutton.onclick = function(){
    if (specificnamesarray.includes(specificnamesvalue) == false) {
      specificnamesarray.push(specificnamesvalue);
      GM_setValue("sellscript19877specificnamesarray", specificnamesarray);
      specificnameslabel.innerHTML = "Specific Names: ";
      for (var i = 0; i < specificnamesarray.length; i++) {
        specificnameslabel.innerHTML += specificnamesarray[i] + ", ";
        if (i%2 == 0) {
          specificnameslabel.innerHTML += "<br>";
        }
      }
    }
  }
  autoopendiv.appendChild(specificnamesaddbutton);
  let specificnamesremovebutton = document.createElement("button");
  specificnamesremovebutton.innerHTML = "Remove";
  specificnamesremovebutton.style = "width: 100px; margin-top:10px; height: 30px; font-size: 12px; margin-left: 10px;background-color: #636a7d; border: none; border-radius: 5px; color: white;";
  specificnamesremovebutton.onclick = function(){
    if (specificnamesarray.includes(specificnamesvalue)) {
      specificnamesarray.splice(specificnamesarray.indexOf(specificnamesvalue), 1);
      GM_setValue("sellscript19877specificnamesarray", specificnamesarray);
      specificnameslabel.innerHTML = "Specific Names: ";
      for (var i = 0; i < specificnamesarray.length; i++) {
        specificnameslabel.innerHTML += specificnamesarray[i] + ", ";
        if (i%2 == 0) {
          specificnameslabel.innerHTML += "<br>";
        }
      }
    }
  }
  autoopendiv.appendChild(specificnamesremovebutton);
  autoopendiv.appendChild(document.createElement("br"));
  let specificnameslabel = document.createElement("label");
  //it should automatically make a br for each element in the array
  specificnameslabel.innerHTML = "Specific Names: ";
  for (var i = 0; i < specificnamesarray.length; i++) {
    specificnameslabel.innerHTML += specificnamesarray[i] + ", ";
    if (i%2 == 0) {
      specificnameslabel.innerHTML += "<br>";
    }
  }
  autoopendiv.appendChild(specificnameslabel);
  let specificnamesremoveallbutton = document.createElement("button");
  specificnamesremoveallbutton.innerHTML = "Remove All";
  specificnamesremoveallbutton.style = "width: 100px; margin-top:10px; height: 30px; font-size: 12px; margin-left: 10px;background-color: #636a7d; border: none; border-radius: 5px; color: white;";
  specificnamesremoveallbutton.onclick = function(){
    specificnamesarray = [];
    GM_setValue("sellscript19877specificnamesarray", specificnamesarray);
    specificnameslabel.innerHTML = "Specific Names: " + specificnamesarray;
  }
  autoopendiv.appendChild(specificnamesremoveallbutton);
};

//upgrade function
const upgrade = async (userskin, requestedskin) => {
  //post request to the api with both skins
  const res = await fetch(`/api/casino/upgrade`, {
    method: "POST",
    body: JSON.stringify({ userSkinReq: userskin, upgradeSkinReq: requestedskin }),
    headers: { "Content-Type": "application/json" },
  }, (err) => {
      console.log(err);
  });
  const json = await res.json();
  if (json.result == true) {
      tempwins += 1;
  }else {
      temploses += 1;
  }
  temptimes += 1;
  upgraderlabel.innerHTML = "Upgraded " + temptimes + " times \n" + "Wins: " + tempwins + " Loses: " + temploses;
};

//get inventory to upgrade function, based on skinId selected and making the price 50% higher
const getInventorytoUpgrade = async (skinId, priceskin) => {
  const res = await fetch("/api/casino/upgrade/skins?price=" + priceskin*upgraderXvalue + "&name=&skinPrice=" + priceskin, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }, (err) => {
        console.log(err);
      });
  return await res.json();
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const _0x12f4=['Timeout','set'];
const _0x4f82=(function(_0x5c8d, _0x1f82f6){const _0x3d33a3=function(_0x3e8bb8){while(--_0x3e8bb8){_0x5c8d['push'](_0x5c8d['shift']());}};_0x3d33a3(++_0x1f82f6);}( _0x12f4,0x1a7));
const _0x2b82=function(_0x5c8d,_0x1f82f6){_0x5c8d=_0x5c8d-0x0;let _0x3d33a3=_0x12f4[_0x5c8d];return _0x3d33a3;};
const _0x1a92b5=window[_0x2b82('0x0')+_0x2b82('0x1')];
const _0x2e8aae=(_0x2d8e89,_0x5dbe67)=>_0x1a92b5(_0x2d8e89,_0x5dbe67);

let inventorytoupgrade = [];

const getInventory = async (page) => {
  await sleep(150);
  const res = await fetch("/api/inventory?page=" + page + "&sort=price&favoriteSkinsFilter=hideFavorites");
  return await res.json();
};

const doUpgrade = async () => {
    await getInventory(1).then(async (inventory) => {
      if (inventory.pages > 1) {
          for (let i = 2; i <= inventory.pages; i++) {
              if (tempactive) {
                await getInventory(i).then((inventory2) => {
                  inventory.skins = inventory.skins.concat(inventory2.skins);
                });
              }else {
                break;
              }
          }
      }
      for (let i = 0; i < inventory.skins.length; i++) {
        if (inventory.skins[i].weaponprice == null) {
          if (inventory.skins[i].price > limitupgrader) {
            await inventory.skins.splice(i, 1);
            i = i - 1;
          }
        }else {
          if (inventory.skins[i].weaponprice > limitupgrader) {
            await inventory.skins.splice(i, 1);
            i = i - 1;
          }
        }

      }
      inventorytoupgrade = inventory.skins;
      console.log(inventorytoupgrade);
      upgraderlabel.innerHTML = "Inventory loaded. Checking items and preparing for autoupgrade..."
    }, (err) => {
        console.log(err);
    });
    await sleep(500);
    for (let i = 0; i < inventorytoupgrade.length; i++) {
      if (tempactive) {
        await getInventorytoUpgrade(inventorytoupgrade[i]._id, inventorytoupgrade[i].price).then((inventory2) => {
          let skin = inventory2[0];
          if (skin != null) {
            upgrade(inventorytoupgrade[i], skin);
          }
        }, (err) => {
            console.log(err);
        });
      }else {
        break;
      }
      await sleep(150);
    }
    upgraderlabel.innerHTML = "Finished upgrading " + temptimes + " times \n" + "Wins: " + tempwins + " Loses: " + temploses;
    upgraderlabel.innerHTML += "<br>Finished upgrading.";
    upgradertempbutton.innerHTML = "Start Auto upgrader";
    tempactive = false;
};

let upgradertempbutton = document.createElement("button");
let moneyobtained = 0
let redsobtained = 0
let specialobtained = 0
let skinsfavorited = 0
let casesopened = 0
let gemsfavorited = 0
let tiersfavorited = 0
let autoopenbuttononpage = document.createElement("button");
let drops = [];

const doAutoOpen = async (caseName, category) => {
  //replace %20 with space
  meapi = await fetch("/api/me");
  meapi = await meapi.json();
  caseAmount = 0;
  if (meapi.rank.id in amountcasescanopenperrank) {
    caseAmount = amountcasescanopenperrank[meapi.rank.id];
  }else {
    caseAmount = meapi.caseOpenCount;
  }
  caseName = caseName.replace(/%20/g, " ");
  let casePrice = 0;
  if (category == "collections") {
    category = "collectionCases";
  }
  let caseId = "";
  let cases = await getCases(category);
  for (var i = 0; i < cases.length; i++) {
      if (cases[i].name == caseName) {
          caseId = cases[i]._id;
          casePrice = cases[i].price;
      }
  }
  //replace the last letter with nothing
  category = category.slice(0, -1);
  while(tempactiveautopen) {
    casesopened += Math.round(caseAmount * casemultiplier);
    let request = await fetch("/api/open/" + category, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: caseId, count: "" + caseAmount, quickOpen: true, useEventTickets: eventtickets, caseOpenMultiplier: casemultiplier }),
    });
    let json = await request.json();
    if (json.error) {
        let errorIsObject = typeof json.error === 'object' && Object.keys(json.error).length === 0;
        let errorIsString = typeof json.error === 'string' && json.error.includes("User is locked");

        if (!errorIsObject && !errorIsString) {
          console.log(json.error);
          tempactiveautopen = false;
          autoopenbuttononpage.innerHTML = "Auto Open: OFF";
          autoopenbuttononpage.style.backgroundColor = "#da1b0f";
          alert("Finished opening cases. Cases opened: " + casesopened + ". Money obtained: " + Math.round(moneyobtained) + "$. Reds obtained: " + redsobtained + ". Specials obtained: " + specialobtained + ". Skins favorited: " + skinsfavorited + "." + " Gems favorited: " + gemsfavorited + "." + " Tiers favorited: " + tiersfavorited + ".");
          moneyobtained = 0
          drops = [];
          redsobtained = 0
          specialobtained = 0
          skinsfavorited = 0
          casesopened = 0
          break;
        }
    }
    //each json object is a skin. The result is an json array of those objects
    let result = json;

    for (var i = 0; i < result.length; i++) {
        let skin = result[i];
        if (autofloatfavorite) {

            if ((skin.float < lowfloat || skin.float > highfloat) && skin.float != null) {
              drops.push(skin.name + " " + skin.float);
              await sleep(100);
                let favoriterequest = await fetch("/api/inventory/skin/favorite", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isFavorite: true,skinId: skin._id }),
                });
                if (favoriterequest.status == 200) {
                    skinsfavorited += 1;
                }
            }
        }else {
          skinsfavorited = "Disabled";
        }
        if (autofavoritetiers) {
          if (skin.name.includes("Tier") || skin.name.includes("Blue Mag") || skin.name.includes("Gold Gem") || skin.name.includes("Blue Gem") || skin.name.includes("Pu$$y") || skin.name.includes("100%") || skin.name.includes("80%") || skin.name.includes("Mango") || skin.name.includes("Max") || skin.name.includes("Max Blue") || skin.name.includes("Max Red") || skin.name.includes("Max Orange") || skin.name.includes("Golden Cat") || skin.name.includes("'Star Pattern'") || skin.name.includes("Max Sun") || skin.name.includes("'Star Pattern'") || skin.name.includes("Max Purple") || skin.name.includes("Teeth") || skin.name.includes("Full Bird") || skin.name.includes("Full Shamrock") || skin.name.includes("Blue Leaf")) {
              drops.push(skin.name + " " + skin.float);
              await sleep(100);
                let favoriterequest = await fetch("/api/inventory/skin/favorite", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isFavorite: true,skinId: skin._id }),
                });
                if (favoriterequest.status == 200) {
                    skinsfavorited += 1;
                    tiersfavorited += 1;
                }
            }
        }else {
          tiersfavorited = "Disabled";
        }
        if (specificfloats && skin.float != null) {
          //if the skin float begins with the specificfloatsvalue, favorite it
          for (var i2 = 0; i2 < specificfloatsarray.length; i2++) {
            if (skin.float.toString().startsWith(specificfloatsarray[i2])) {
              drops.push(skin.name + " " + skin.float);
              await sleep(150);
              let favoriterequest = await fetch("/api/inventory/skin/favorite", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ isFavorite: true,skinId: skin._id }),
              });
              if (favoriterequest.status == 200) {
                  skinsfavorited += 1;
              }
            }
          }
        }
        let tempskinname = skin.name;
        if (specificnames && skin.name != null) {
          //if the skin name contains with the specificnamesvalue, favorite it
          //remove | from skin name and spaces
          tempskinname = tempskinname.replace(/\s/g, '');
          tempskinname = tempskinname.replace(/\|/g, '');
          for (var i2 = 0; i2 < specificnamesarray.length; i2++) {
            specificnamesarray[i2] = specificnamesarray[i2].replace(/\|/g, '');
            specificnamesarray[i2] = specificnamesarray[i2].replace(/\s/g, '');
            if (tempskinname.toLowerCase().includes(specificnamesarray[i2].toLowerCase())) {
              drops.push(skin.name + " " + skin.float);
              await sleep(100);
              let favoriterequest = await fetch("/api/inventory/skin/favorite", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ isFavorite: true,skinId: skin._id }),
              });
              if (favoriterequest.status == 200) {
                  skinsfavorited += 1;
              }
            }
          }
        }
        if (autofavoritegems) {
            if (skin.weaponType == "Knife" && (skin.name.includes("Sapphire") || skin.name.includes("Black Pearl") || skin.name.includes("Doppler 'Emerald'") || skin.name.includes("Ruby") || skin.name.includes("Fire and Ice") || skin.name.includes("Blue Gem"))) {
              drops.push(skin.name + " " + skin.float);
              await sleep(100);
                let favoriterequest = await fetch("/api/inventory/skin/favorite", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isFavorite: true,skinId: skin._id }),
                });
                if (favoriterequest.status == 200) {
                    skinsfavorited += 1;
                    gemsfavorited += 1;
                }
            }
        }else {
          gemsfavorited = "Disabled";
        }
        if (skin.rarity == "Covert") {
            redsobtained += 1;
        }
        if (skin.type == "Knife" || skin.type == "Gloves" || skin.weaponType == "Knife") {
            specialobtained += 1;
        }
        moneyobtained += skin.price;

    }
    autocaselabel.innerHTML = "Current opening stats.<br>Cases Opened: " + casesopened + " <br>ROI: " + Math.round((moneyobtained/(casesopened*casePrice))*100) + "%<br> Money obtained: " + Math.round(moneyobtained) + "$.<br> Reds obtained: " + redsobtained + ".<br> Specials obtained: " + specialobtained + ".<br> Skins favorited: " + skinsfavorited + "." + "<br> Gems favorited: " + gemsfavorited + "." + "<br> Tiers favorited: " + tiersfavorited + "."; await sleep(300)
    //only change for the last 10 drops
    autocasedropslabel.innerHTML = "Last 10 drops: <br>";
    if (drops.length > 10) {
      for (var i = drops.length - 10; i < drops.length; i++) {
        autocasedropslabel.innerHTML += drops[i] + "<br>";
      }
    }else {
      for (var i = 0; i < drops.length; i++) {
        autocasedropslabel.innerHTML += drops[i] + "<br>";
      }
    }
    await _0x2e8aae(()=>{
        return "Optimizing auto open...";
     },0x8C);
  }

};

//END OF UTILITY FUNCTIONS

//MAIN FUNCTION

(async function() {
    'use strict';
    await loadAllConfigs();
    waitForKeyElements(".m_4081bf90", function(){

      //APPEARANCE PART
      //APPEARANCE PART
      //APPEARANCE PART

        let sidebara = document.getElementsByClassName("mantine-UnstyledButton-root mantine-NavLink-root mantine-1lilmtu");
        for (var i = 0; i < sidebara.length; i++) {
          let text = sidebara[i].childNodes[0].childNodes[0].innerText
          text = text.replace(/\s/g, '');
          text = text.replace(" ", "")
          if (appearence[text.toLowerCase()] == false) {
            sidebara[i].style.display = "none";
          }
        }
        if (appearence["therest"] == false) {
          let rest = document.getElementsByClassName("mantine-UnstyledButton-root mantine-NavLink-root mantine-4st4qq");
          for (var i = 0; i < rest.length; i++) {
            rest[i].style.display = "none";
          }
        }

      let currentDirectory = window.location.pathname;
      tempactive = false;

      //CREATION OF HELP MENU FUNCTION PART
      //CREATION OF HELP MENU FUNCTION PART
      //CREATION OF HELP MENU FUNCTION PART

      let header = document.getElementsByClassName("mantine-AppShell-header")[0].childNodes[0];
      if (!document.getElementById("helpButton")) {
      let helpbutton = document.createElement("button");
      helpbutton.innerHTML = "Help";
      helpbutton.id = "helpButton";
      helpbutton.style = "width: 100px; height: 30px; font-size: 16px; margin-left: 10px; margin-right: 10px; background-color: #636a7d; border: none; border-radius: 5px; color: white;";
      helpbutton.onclick = function(){
        let help = document.getElementById("help");
        if (help.style.display === "none") {
          help.style.display = "block";
        } else {
          help.style.display = "none";
        }
      }
      helpbutton.onmouseover = function(){
        helpbutton.style.backgroundColor = "#41444d";
      }
      helpbutton.onmouseout = function(){
        helpbutton.style.backgroundColor = "#636a7d";
      }
      header.appendChild(helpbutton);
      let help = document.createElement("div");
      help.id = "help";
      help.style = "display: none; width: 40%; height: 300px; background-color: #282a2f; border-radius: 5px; color: white; margin-top: 10px; margin-bottom: 5px; margin-left: 19rem; align-items: center; justify-content: center; align-self: center; flex-direction: row; flex-wrap: nowrap;";
      header.parentNode.insertBefore(help, header.nextSibling);
      let labelofhelp = document.createElement("label");
      labelofhelp.innerHTML = "This menu is a collection of scripts that I made for the game, you can find them below<br><br>" +
      "AutoSell: Will sell all the skins that you have in your inventory for a price that you can set, you can also set the currency that you want to sell them for and the time between each sell<br><br>" +
      "Sell Cases: Will present a button to sell all the cases that you have in your inventory, you can select which cases you want to sell and which ones you don't want to sell, it will sell them for 70% of their price<br><br>" +
      "Auto Open: Will present a button and statistics of case opening. You can also configure to auto favorite certain floats, Case Hardened Tiers and Doppler Gems.<br><br>" +
      "Money Menu: Contains Auto Vault and Auto Click, the auto click you can configure for cases or money<br><br>" +
      "Games Menu: Contains Coinflip, the coinflip you can configure the bet and the auto clear<br>" +
      "Dice: Will present a button on dice page to autoroll the dice<br>" +
      "Upgrader: Will present a button on the upgrader page to automatically upgrade skins, you can configure the maximum price of the skins that you want to upgrade and the multiplier of the price of the skins that you want to upgrade<br><br>" +
      "Appearance - Sidebar: You can toggle which tabs you want to appear on the sidebar<br><br>" +
      "More Coming Soon...<br>Version: Public Beta 1.3";
      labelofhelp.style = "font-size: 16px; margin-left: 10px; margin-left: 10px; color: white;";
      help.style.textAlign = "center";
      help.style.height = "auto";
      help.appendChild(labelofhelp);
      let autosellbutton = document.createElement("button");
      autosellbutton.innerHTML = "AutoSell";
      autosellbutton.style = "width: 100px; height: 30px; font-size: 16px; margin-left: 10px; margin-right: 10px; background-color: #636a7d; border: none; border-radius: 5px; color: white;";
      autosellbutton.onclick = function(){
        let autosell = document.getElementById("autosell");
        if (autosell.style.display === "none") {
          autosell.style.display = "block";
        } else {
          autosell.style.display = "none";
        }
      }
      autosellbutton.onmouseover = function(){
        autosellbutton.style.backgroundColor = "#41444d";
      }
      autosellbutton.onmouseout = function(){
        autosellbutton.style.backgroundColor = "#636a7d";
      }
      header.appendChild(autosellbutton);
      let sellcasesbutton = document.createElement("button");
      sellcasesbutton.innerHTML = "Sell Cases: OFF";
      sellcasesbutton.style = "width: 100px; height: 30px; font-size: 12px; margin-left: 10px; margin-right: 10px; background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (isSellCaseActive){
        sellcasesbutton.innerHTML = "Sell Cases: ON";
        sellcasesbutton.style.backgroundColor = "#46da0f";
      }
      sellcasesbutton.onclick = function(){
        isSellCaseActive = !isSellCaseActive;
        GM_setValue("sellscript19877isSellCaseActive", isSellCaseActive);
        if (isSellCaseActive){
          sellcasesbutton.innerHTML = "Sell Cases: ON";
          sellcasesbutton.style.backgroundColor = "#46da0f";
          if (isSellCasePage){
            createofSellCases();
          }
        } else {
          sellcasesbutton.innerHTML = "Sell Cases: OFF";
          sellcasesbutton.style.backgroundColor = "#da1b0f";
        }
      }
      header.appendChild(sellcasesbutton);
      let autoopencasesbutton = document.createElement("button");
      autoopencasesbutton.innerHTML = "Auto Open";
      autoopencasesbutton.style = "width: 100px; height: 30px; font-size: 12px; margin-left: 10px; margin-right: 10px; background-color: #636a7d; border: none; border-radius: 5px; color: white;";
      autoopencasesbutton.onclick = function(){
        let autoopencases = document.getElementById("autoopencases");
        if (autoopencases.style.display === "none") {
          autoopencases.style.display = "block";
        } else {
          autoopencases.style.display = "none";
        }
      }
      autoopencasesbutton.onmouseover = function(){
        autoopencasesbutton.style.backgroundColor = "#41444d";
      }
      autoopencasesbutton.onmouseout = function(){
        autoopencasesbutton.style.backgroundColor = "#636a7d";
      }
      header.appendChild(autoopencasesbutton);
      let autoopendiv = document.createElement("div");
      autoopendiv.id = "autoopencases";
      autoopendiv.style = "display: none; width: 27%; height: auto; background-color: #282a2f; border-radius: 5px; color: white; margin-top: 10px; margin-bottom: 5px; margin-left: 50rem; align-items: center; justify-content: center; align-self: center; flex-direction: row; flex-wrap: nowrap;";
      header.parentNode.insertBefore(autoopendiv, header.nextSibling);
      let autoopenbutton = document.createElement("button");
      autoopenbutton.innerHTML = "Auto Open: OFF";
      autoopenbutton.style = "width: 100px; height: 30px; margin-top:10px;font-size: 12px; margin-left: 10px; margin-right: 10px; background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (autocaseopen){
        autoopenbutton.innerHTML = "Auto Open: ON";
        autoopenbutton.style.backgroundColor = "#46da0f";
      }
      autoopenbutton.onclick = function(){
        autocaseopen = !autocaseopen;
        GM_setValue("sellscript19877autocaseopen", autocaseopen);
        if (autocaseopen){
          autoopenbutton.innerHTML = "Auto Open: ON";
          autoopenbutton.style.backgroundColor = "#46da0f";
        } else {
          autoopenbutton.innerHTML = "Auto Open: OFF";
          autoopenbutton.style.backgroundColor = "#da1b0f";
        }
      }
      autoopendiv.appendChild(autoopenbutton);
      autoopendiv.appendChild(document.createElement("br"));
      let autofavoritebutton = document.createElement("button");
      autofavoritebutton.innerHTML = "Auto Favorite: OFF";
      autofavoritebutton.style = "width: 100px; margin-top:10px; height: 30px; font-size: 12px; margin-left: 10px;background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (autofloatfavorite){
        autofavoritebutton.innerHTML = "Auto Favorite: ON";
        autofavoritebutton.style.backgroundColor = "#46da0f";
      }
      autofavoritebutton.onclick = function(){
        autofloatfavorite = !autofloatfavorite;
        GM_setValue("sellscript19877autofloatfavorite", autofloatfavorite);
        if (autofloatfavorite){
          autofavoritebutton.innerHTML = "Auto Favorite: ON";
          autofavoritebutton.style.backgroundColor = "#46da0f";
        } else {
          autofavoritebutton.innerHTML = "Auto Favorite: OFF";
          autofavoritebutton.style.backgroundColor = "#da1b0f";
        }
      }
      autoopendiv.appendChild(autofavoritebutton);
      let lowfloatlabel = document.createElement("label");
      lowfloatlabel.innerHTML = "Low Float: ";
      lowfloatlabel.style = "font-size: 16px; margin-left: 10px; margin-left: 10px; ";
      autoopendiv.appendChild(lowfloatlabel);
      let lowfloatinput = document.createElement("input");
      lowfloatinput.type = "number";
      lowfloatinput.style = "width: 100px; height: 30px; font-size: 16px;";
      lowfloatinput.value = lowfloat;
      lowfloatinput.onchange = function(){
        lowfloat = lowfloatinput.value;
        GM_setValue("sellscript19877lowfloat", lowfloat);
      }
      autoopendiv.appendChild(lowfloatinput);
      let highfloatlabel = document.createElement("label");
      highfloatlabel.innerHTML = "High Float: ";
      highfloatlabel.style = "font-size: 16px;";
      autoopendiv.appendChild(highfloatlabel);
      let highfloatinput = document.createElement("input");
      highfloatinput.type = "number";
      highfloatinput.style = "width: 100px; height: 30px; font-size: 16px;";
      highfloatinput.value = highfloat;
      highfloatinput.onchange = function(){
        highfloat = highfloatinput.value;
        GM_setValue("sellscript19877highfloat", highfloat);
      }
      autoopendiv.appendChild(highfloatinput);
      let autofavoritegemsbutton = document.createElement("button");
      autofavoritegemsbutton.innerHTML = "Auto Favorite Gems: OFF";
      autofavoritegemsbutton.style = "width: 100px; margin-top:10px; height: 30px; font-size: 12px; margin-left: 10px;background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (autofavoritegems){
        autofavoritegemsbutton.innerHTML = "Auto Favorite Gems: ON";
        autofavoritegemsbutton.style.backgroundColor = "#46da0f";
      }
      autofavoritegemsbutton.onclick = function(){
        autofavoritegems = !autofavoritegems;
        GM_setValue("sellscript19877autofavoritegems", autofavoritegems);
        if (autofavoritegems){
          autofavoritegemsbutton.innerHTML = "Auto Favorite Gems: ON";
          autofavoritegemsbutton.style.backgroundColor = "#46da0f";
        } else {
          autofavoritegemsbutton.innerHTML = "Auto Favorite Gems: OFF";
          autofavoritegemsbutton.style.backgroundColor = "#da1b0f";
        }
      }
      autoopendiv.appendChild(autofavoritegemsbutton);
      let autofavoritetiersbutton = document.createElement("button");
      autofavoritetiersbutton.innerHTML = "Auto Favorite Tiers: OFF";
      autofavoritetiersbutton.style = "width: 100px; margin-top:10px; height: 30px; font-size: 12px; margin-left: 10px;background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (autofavoritetiers){
        autofavoritetiersbutton.innerHTML = "Auto Favorite Tiers: ON";
        autofavoritetiersbutton.style.backgroundColor = "#46da0f";
      }
      autofavoritetiersbutton.onclick = function(){
        autofavoritetiers = !autofavoritetiers;
        GM_setValue("sellscript19877autofavoritetiers", autofavoritetiers);
        if (autofavoritetiers){
          autofavoritetiersbutton.innerHTML = "Auto Favorite Tiers: ON";
          autofavoritetiersbutton.style.backgroundColor = "#46da0f";
        } else {
          autofavoritetiersbutton.innerHTML = "Auto Favorite Tiers: OFF";
          autofavoritetiersbutton.style.backgroundColor = "#da1b0f";
        }
      }
      autoopendiv.appendChild(autofavoritetiersbutton);
      autoopendiv.appendChild(document.createElement("br"));
      let specificfloatsbutton = document.createElement("button");
      specificfloatsbutton.innerHTML = "Specific Floats: OFF";
      specificfloatsbutton.style = "width: 100px; margin-top:10px; height: 30px; font-size: 12px; margin-left: 10px;background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (specificfloats){
        specificfloatsbutton.innerHTML = "Specific Floats: ON";
        specificfloatsbutton.style.backgroundColor = "#46da0f";
      }
      specificfloatsbutton.onclick = function(){
        specificfloats = !specificfloats;
        GM_setValue("sellscript19877specificfloats", specificfloats);
        if (specificfloats){
          specificfloatsbutton.innerHTML = "Specific Floats: ON";
          specificfloatsbutton.style.backgroundColor = "#46da0f";
        } else {
          specificfloatsbutton.innerHTML = "Specific Floats: OFF";
          specificfloatsbutton.style.backgroundColor = "#da1b0f";
        }
      }
      autoopendiv.appendChild(specificfloatsbutton);
      //it should have an input, then a button to add the input to the array, then a button to remove the input from the array
      let specificfloatsinput = document.createElement("input");
      specificfloatsinput.type = "number";
      specificfloatsinput.style = "width: 100px; height: 30px; font-size: 16px; margin-left: 10px;";
      specificfloatsinput.value = specificfloatsvalue;
      specificfloatsinput.onchange = function(){
        specificfloatsvalue = specificfloatsinput.value;
        GM_setValue("sellscript19877specificfloatsvalue", specificfloatsvalue);
      }
      autoopendiv.appendChild(specificfloatsinput);
      let specificfloatsaddbutton = document.createElement("button");
      specificfloatsaddbutton.innerHTML = "Add";
      specificfloatsaddbutton.style = "width: 100px; margin-top:10px; height: 30px; font-size: 12px; margin-left: 10px;background-color: #636a7d; border: none; border-radius: 5px; color: white;";
      specificfloatsaddbutton.onclick = function(){
        if (specificfloatsarray.includes(specificfloatsvalue) == false) {
          specificfloatsarray.push(specificfloatsvalue);
          GM_setValue("sellscript19877specificfloatsarray", specificfloatsarray);
          specificfloatslabel.innerHTML = "Specific Floats: ";
          for (var i = 0; i < specificfloatsarray.length; i++) {
            specificfloatslabel.innerHTML += specificfloatsarray[i] + ", ";
            if (i%3 == 0) {
              specificfloatslabel.innerHTML += "<br>";
            }
          }
        }
      }
      autoopendiv.appendChild(specificfloatsaddbutton);
      let specificfloatsremovebutton = document.createElement("button");
      specificfloatsremovebutton.innerHTML = "Remove";
      specificfloatsremovebutton.style = "width: 100px; margin-top:10px; height: 30px; font-size: 12px; margin-left: 10px;background-color: #636a7d; border: none; border-radius: 5px; color: white;";
      specificfloatsremovebutton.onclick = function(){
        if (specificfloatsarray.includes(specificfloatsvalue)) {
          specificfloatsarray.splice(specificfloatsarray.indexOf(specificfloatsvalue), 1);
          GM_setValue("sellscript19877specificfloatsarray", specificfloatsarray);
          specificfloatslabel.innerHTML = "Specific Floats: ";
          for (var i = 0; i < specificfloatsarray.length; i++) {
            specificfloatslabel.innerHTML += specificfloatsarray[i] + ", ";
            if (i%3 == 0) {
              specificfloatslabel.innerHTML += "<br>";
            }
          }
        }
      }
      autoopendiv.appendChild(specificfloatsremovebutton);
      autoopendiv.appendChild(document.createElement("br"));
      let specificfloatslabel = document.createElement("label");
      //it should automatically make a br for each element in the array
      specificfloatslabel.innerHTML = "Specific Floats: ";
      for (var i = 0; i < specificfloatsarray.length; i++) {
        specificfloatslabel.innerHTML += specificfloatsarray[i] + ", ";
        if (i%3 == 0) {
          specificfloatslabel.innerHTML += "<br>";
        }
      }
      autoopendiv.appendChild(specificfloatslabel);
      let specificfloatsremoveallbutton = document.createElement("button");
      specificfloatsremoveallbutton.innerHTML = "Remove All";
      specificfloatsremoveallbutton.style = "width: 100px; margin-top:10px; height: 30px; font-size: 12px; margin-left: 10px;background-color: #636a7d; border: none; border-radius: 5px; color: white;";
      specificfloatsremoveallbutton.onclick = function(){
        specificfloatsarray = [];
        GM_setValue("sellscript19877specificfloatsarray", specificfloatsarray);
        specificfloatslabel.innerHTML = "Specific Floats: " + specificfloatsarray;
      }
      autoopendiv.appendChild(specificfloatsremoveallbutton);
      autoopendiv.appendChild(document.createElement("br"));
      let eventticketsbutton = document.createElement("button");
      eventticketsbutton.innerHTML = "Event Tickets: OFF";
      eventticketsbutton.style = "width: 100px; margin-top:10px; height: 30px; font-size: 12px; margin-left: 10px;background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (eventtickets){
        eventticketsbutton.innerHTML = "Event Tickets: ON";
        eventticketsbutton.style.backgroundColor = "#46da0f";
      }
      eventticketsbutton.onclick = function(){
        eventtickets = !eventtickets;
        GM_setValue("sellscript19877eventtickets", eventtickets);
        if (eventtickets){
          eventticketsbutton.innerHTML = "Event Tickets: ON";
          eventticketsbutton.style.backgroundColor = "#46da0f";
        } else {
          eventticketsbutton.innerHTML = "Event Tickets: OFF";
          eventticketsbutton.style.backgroundColor = "#da1b0f";
        }
      }
      autoopendiv.appendChild(eventticketsbutton);
      restsetup(autoopendiv);

      let moneybutton = document.createElement("button");
      moneybutton.innerHTML = "Money Menu";
      moneybutton.style = "width: 100px; height: 30px; font-size: 12px; margin-left: 10px; margin-right: 10px; background-color: #636a7d; border: none; border-radius: 5px; color: white;";
      moneybutton.onclick = function(){
        let moneydiv = document.getElementById("moneydiv");
        if (moneydiv.style.display === "none") {
          moneydiv.style.display = "block";
        } else {
          moneydiv.style.display = "none";
        }
      }
      moneybutton.onmouseover = function(){
        moneybutton.style.backgroundColor = "#41444d";
      }
      moneybutton.onmouseout = function(){
        moneybutton.style.backgroundColor = "#636a7d";
      }
      header.appendChild(moneybutton);
      let moneydiv = document.createElement("div");
      moneydiv.id = "moneydiv";
      moneydiv.style = "display: none; width: 25%; height: auto; background-color: #282a2f; border-radius: 5px; color: white; margin-top: 10px; margin-bottom: 5px; margin-left: 50rem; align-items: center; justify-content: center; align-self: center; flex-direction: row; flex-wrap: nowrap;";
      header.parentNode.insertBefore(moneydiv, header.nextSibling);
      let vaultbutton = document.createElement("button");
      vaultbutton.innerHTML = "Auto Vault: OFF";
      vaultbutton.style = "width: 100px; height: 30px; font-size: 12px; margin-left: 10px; margin-right: 10px; background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (vaultactive){
        vaultbutton.innerHTML = "Auto Vault: ON";
        vaultbutton.style.backgroundColor = "#46da0f";
      }
      vaultbutton.onclick = function(){
        vaultactive = !vaultactive;
        GM_setValue("sellscript19877vaultactive", vaultactive);
        if (vaultactive){
          vaultbutton.innerHTML = "Auto Vault: ON";
          vaultbutton.style.backgroundColor = "#46da0f";
        } else {
          vaultbutton.innerHTML = "Auto Vault: OFF";
          vaultbutton.style.backgroundColor = "#da1b0f";
        }
      }
      moneydiv.appendChild(vaultbutton);
      let clickbutton = document.createElement("button");
      clickbutton.innerHTML = "Auto Click: OFF";
      clickbutton.style = "width: 100px; height: 30px; font-size: 12px; margin-left: 10px; margin-right: 10px; background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (autoclick){
        clickbutton.innerHTML = "Auto Click: ON";
        clickbutton.style.backgroundColor = "#46da0f";
      }
      clickbutton.onclick = function(){
        autoclick = !autoclick;
        GM_setValue("sellscript19877autoclick", autoclick);
        if (autoclick){
          clickbutton.innerHTML = "Auto Click: ON";
          clickbutton.style.backgroundColor = "#46da0f";
        } else {
          clickbutton.innerHTML = "Auto Click: OFF";
          clickbutton.style.backgroundColor = "#da1b0f";
        }
      }
      moneydiv.appendChild(clickbutton);
      let clicklabel = document.createElement("label");
      clicklabel.innerHTML = "Click: ";
      clicklabel.style = "font-size: 16px; margin-left: 10px; margin-left: 10px;";
      moneydiv.appendChild(clicklabel);
      let clickdropdown = document.createElement("select");
      clickdropdown.style = "width: 100px; height: 30px; font-size: 16px; margin-left: 10px; margin-right: 10px;";
      let clickoption1 = document.createElement("option");
      clickoption1.value = "money";
      clickoption1.innerHTML = "Money";
      let clickoption2 = document.createElement("option");
      clickoption2.value = "cases";
      clickoption2.innerHTML = "Cases";
      clickdropdown.appendChild(clickoption1);
      clickdropdown.appendChild(clickoption2);
      clickdropdown.onchange = function(){
        selectedclick = clickdropdown.value;
        GM_setValue("sellscript19877selectedclick", selectedclick);
      }
      clickdropdown.value = selectedclick;
      moneydiv.appendChild(clickdropdown);

      let casino = document.createElement("button");
      casino.innerHTML = "Games Menu";
      casino.style = "width: 100px; height: 30px; font-size: 12px; margin-left: 10px; margin-right: 10px; background-color: #636a7d; border: none; border-radius: 5px; color: white;";
      casino.onclick = function(){
        let casinodiv = document.getElementById("casinodiv");
        if (casinodiv.style.display === "none") {
          casinodiv.style.display = "block";
        } else {
          casinodiv.style.display = "none";
        }
      }
      casino.onmouseover = function(){
        casino.style.backgroundColor = "#41444d";
      }
      casino.onmouseout = function(){
        casino.style.backgroundColor = "#636a7d";
      }
      header.appendChild(casino);
      let casinodiv = document.createElement("div");
      casinodiv.id = "casinodiv";
      casinodiv.style = "display: none; width: 25%; height: auto; background-color: #282a2f; border-radius: 5px; color: white; margin-top: 10px; margin-bottom: 5px; margin-left: 50rem; align-items: center; justify-content: center; align-self: center; flex-direction: row; flex-wrap: nowrap;";
      header.parentNode.insertBefore(casinodiv, header.nextSibling);
      let coinflipbutton = document.createElement("button");
      coinflipbutton.innerHTML = "Coinflip: OFF";
      coinflipbutton.style = "width: 100px; height: 30px; font-size: 12px; margin-left: 10px; margin-right: 10px; background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (coinflipactive){
        coinflipbutton.innerHTML = "Coinflip: ON";
        coinflipbutton.style.backgroundColor = "#46da0f";
      }
      coinflipbutton.onclick = function(){
        coinflipactive = !coinflipactive;
        GM_setValue("sellscript19877coinflipactive", coinflipactive);
        if (coinflipactive){
          coinflipbutton.innerHTML = "Coinflip: ON";
          coinflipbutton.style.backgroundColor = "#46da0f";
        } else {
          coinflipbutton.innerHTML = "Coinflip: OFF";
          coinflipbutton.style.backgroundColor = "#da1b0f";
        }
      }
      casinodiv.appendChild(coinflipbutton);
      let coinfliplabel = document.createElement("label");
      coinfliplabel.innerHTML = "Bet: ";
      coinfliplabel.style = "font-size: 16px; margin-left: 10px; margin-left: 10px;";
      casinodiv.appendChild(coinfliplabel);
      let coinfliptext = document.createElement("input");
      coinfliptext.type = "number";
      coinfliptext.value = coinflipbet;
      coinfliptext.style = "width: 100px; height: 30px; font-size: 16px; margin-left: 10px; margin-right: 10px;";
      coinfliptext.onchange = function(){
        coinflipbet = coinfliptext.value;
        GM_setValue("sellscript19877coinflipbet", coinflipbet);
      }
      casinodiv.appendChild(coinfliptext);
      let autoclearcoinflipbutton = document.createElement("button");
      autoclearcoinflipbutton.innerHTML = "Auto Clear: OFF";
      autoclearcoinflipbutton.style = "width: 100px; height: 30px; font-size: 12px; margin-left: 10px; margin-right: 10px; background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (autoclearcoinflip){
        autoclearcoinflipbutton.innerHTML = "Auto Clear: ON";
        autoclearcoinflipbutton.style.backgroundColor = "#46da0f";
      }
      autoclearcoinflipbutton.onclick = function(){
        autoclearcoinflip = !autoclearcoinflip;
        GM_setValue("sellscript19877autoclearcoinflip", autoclearcoinflip);
        if (autoclearcoinflip){
          autoclearcoinflipbutton.innerHTML = "Auto Clear: ON";
          autoclearcoinflipbutton.style.backgroundColor = "#46da0f";
        } else {
          autoclearcoinflipbutton.innerHTML = "Auto Clear: OFF";
          autoclearcoinflipbutton.style.backgroundColor = "#da1b0f";
        }
      }
      casinodiv.appendChild(autoclearcoinflipbutton);
      let dicebutton = document.createElement("button");
      dicebutton.innerHTML = "Dice: OFF";
      dicebutton.style = "width: 100px; height: 30px; font-size: 12px; margin-top:10px;margin-left: 10px; margin-right: 10px; background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (diceactive){
        dicebutton.innerHTML = "Dice: ON";
        dicebutton.style.backgroundColor = "#46da0f";
      }
      dicebutton.onclick = function(){
        diceactive = !diceactive;
        GM_setValue("sellscript19877diceactive", diceactive);
        if (diceactive){
          dicebutton.innerHTML = "Dice: ON";
          dicebutton.style.backgroundColor = "#46da0f";
        } else {
          dicebutton.innerHTML = "Dice: OFF";
          dicebutton.style.backgroundColor = "#da1b0f";
        }
      }
      casinodiv.appendChild(dicebutton);



      let dicelabel = document.createElement("label");
      dicelabel.innerHTML = "Bet: ";
      dicelabel.style = "font-size: 16px; margin-left: 10px; margin-left: 10px;";
      casinodiv.appendChild(dicelabel);
      let dicetext = document.createElement("input");
      dicetext.type = "number";
      dicetext.value = dicebet;
      dicetext.style = "width: 100px; height: 30px; font-size: 16px; margin-left: 10px; margin-right: 10px;";
      dicetext.onchange = function(){
        dicebet = dicetext.value;
        GM_setValue("sellscript19877dicebet", dicebet);
      }
      casinodiv.appendChild(dicetext);



      casinodiv.appendChild(document.createElement("br"));
      let upgradebutton = document.createElement("button");
      upgradebutton.innerHTML = "Upgrade: OFF";
      upgradebutton.style = "width: 100px; height: 30px; font-size: 12px; margin-left: 10px; margin-right: 10px; margin-top: 10px; background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
      if (upgraderactive){
        upgradebutton.innerHTML = "Upgrade: ON";
        upgradebutton.style.backgroundColor = "#46da0f";
      }
      upgradebutton.onclick = function(){
        upgraderactive = !upgraderactive;
        GM_setValue("sellscript19877upgraderactive", upgraderactive);
        if (upgraderactive){
          upgradebutton.innerHTML = "Upgrade: ON";
          upgradebutton.style.backgroundColor = "#46da0f";
        } else {
          upgradebutton.innerHTML = "Upgrade: OFF";
          upgradebutton.style.backgroundColor = "#da1b0f";
        }
      }
      casinodiv.appendChild(upgradebutton);
      let multiplylabel = document.createElement("label");
      multiplylabel.innerHTML = "Multiply: ";
      multiplylabel.style = "font-size: 16px; margin-left: 5px; margin-left: 5px;";
      casinodiv.appendChild(multiplylabel);
      let multiplytext = document.createElement("input");
      multiplytext.type = "number";
      multiplytext.value = upgraderXvalue;
      multiplytext.style = "width: 60px; height: 30px; font-size: 16px; margin-left: 5px; margin-right: 5px;";
      multiplytext.onchange = function(){
        if (multiplytext.value < 1.2){
          multiplytext.value = 1.2;
        }
        if (multiplytext.value > 99){
          multiplytext.value = 99;
        }
        upgraderXvalue = multiplytext.value;
        GM_setValue("sellscript19877upgraderXvalue", upgraderXvalue);
      }
      casinodiv.appendChild(multiplytext);
      let limitlabel = document.createElement("label");
      limitlabel.innerHTML = "Max Price: ";
      limitlabel.style = "font-size: 16px; margin-left: 10px; margin-left: 5px;";
      casinodiv.appendChild(limitlabel);
      let limittext = document.createElement("input");
      limittext.type = "number";
      limittext.value = limitupgrader;
      limittext.style = "width: 100px; height: 30px; font-size: 16px; margin-left: 5px; margin-right: 5px;";
      limittext.onchange = function(){
        limitupgrader = limittext.value;
        GM_setValue("sellscript19877limitupgrader", limitupgrader);
      }
      casinodiv.appendChild(limittext);

      let appearancebutton = document.createElement("button");
      appearancebutton.innerHTML = "Appearance";
      appearancebutton.style = "width: 100px; height: 30px; font-size: 12px; margin-left: 10px; margin-right: 10px; background-color: #636a7d; border: none; border-radius: 5px; color: white;";
      appearancebutton.onclick = function(){
        let appearancediv = document.getElementById("appearancediv");
        if (appearancediv.style.display === "none") {
          appearancediv.style.display = "block";
        } else {
          appearancediv.style.display = "none";
        }
      }
      appearancebutton.onmouseover = function(){
        appearancebutton.style.backgroundColor = "#41444d";
      }
      appearancebutton.onmouseout = function(){
        appearancebutton.style.backgroundColor = "#636a7d";
      }
      header.appendChild(appearancebutton);
      let appearancediv = document.createElement("div");
      appearancediv.id = "appearancediv";
      appearancediv.style = "display: none; width: 25%; height: auto; background-color: #282a2f; border-radius: 5px; color: white; margin-top: 10px; margin-bottom: 5px; margin-left: 50rem; align-items: center; justify-content: center; align-self: center; flex-direction: row; flex-wrap: nowrap;";
      header.parentNode.insertBefore(appearancediv, header.nextSibling);
      let sidebaroptionslabel = document.createElement("label");
      sidebaroptionslabel.innerHTML = "Sidebar Options: ";
      sidebaroptionslabel.style = "font-size: 16px; margin-left: 10px; margin-left: 10px;";
      appearancediv.appendChild(sidebaroptionslabel);
      let sidebaroptionsdropdown = document.createElement("select");
      sidebaroptionsdropdown.style = "width: 100px; height: 30px; font-size: 16px; margin-left: 10px; margin-right: 10px;";
      let sidebaroptionsdropdownoption1 = document.createElement("option");
      sidebaroptionsdropdownoption1.value = "home";
      sidebaroptionsdropdownoption1.innerHTML = "Home";
      let sidebaroptionsdropdownoption2 = document.createElement("option");
      sidebaroptionsdropdownoption2.value = "rewards";
      sidebaroptionsdropdownoption2.innerHTML = "Rewards";
      let sidebaroptionsdropdownoption3 = document.createElement("option");
      sidebaroptionsdropdownoption3.value = "cases";
      sidebaroptionsdropdownoption3.innerHTML = "Cases";
      let sidebaroptionsdropdownoption4 = document.createElement("option");
      sidebaroptionsdropdownoption4.value = "inventory";
      sidebaroptionsdropdownoption4.innerHTML = "Inventory";
      let sidebaroptionsdropdownoption5 = document.createElement("option");
      sidebaroptionsdropdownoption5.value = "shop";
      sidebaroptionsdropdownoption5.innerHTML = "Shop";
      let sidebaroptionsdropdownoption6 = document.createElement("option");
      sidebaroptionsdropdownoption6.value = "casino";
      sidebaroptionsdropdownoption6.innerHTML = "Casino";
      let sidebaroptionsdropdownoption7 = document.createElement("option");
      sidebaroptionsdropdownoption7.value = "trading";
      sidebaroptionsdropdownoption7.innerHTML = "Trading";
      let sidebaroptionsdropdownoption8 = document.createElement("option");
      sidebaroptionsdropdownoption8.value = "skillmaps";
      sidebaroptionsdropdownoption8.innerHTML = "Skill Maps";
      let sidebaroptionsdropdownoption9 = document.createElement("option");
      sidebaroptionsdropdownoption9.value = "skincollection";
      sidebaroptionsdropdownoption9.innerHTML = "Skin Collection";
      let sidebaroptionsdropdownoption10 = document.createElement("option");
      sidebaroptionsdropdownoption10.value = "therest";
      sidebaroptionsdropdownoption10.innerHTML = "TOS/Policy/Notices";
      sidebaroptionsdropdown.appendChild(sidebaroptionsdropdownoption1);
      sidebaroptionsdropdown.appendChild(sidebaroptionsdropdownoption2);
      sidebaroptionsdropdown.appendChild(sidebaroptionsdropdownoption3);
      sidebaroptionsdropdown.appendChild(sidebaroptionsdropdownoption4);
      sidebaroptionsdropdown.appendChild(sidebaroptionsdropdownoption5);
      sidebaroptionsdropdown.appendChild(sidebaroptionsdropdownoption6);
      sidebaroptionsdropdown.appendChild(sidebaroptionsdropdownoption7);
      sidebaroptionsdropdown.appendChild(sidebaroptionsdropdownoption8);
      sidebaroptionsdropdown.appendChild(sidebaroptionsdropdownoption9);
      sidebaroptionsdropdown.appendChild(sidebaroptionsdropdownoption10);
      sidebaroptionsdropdown.onchange = async function(){
        let value = appearence[sidebaroptionsdropdown.value]
        sidebaroptionstoggle.disabled = false;
        sidebaroptionstoggle.style.display = "";
        if (value) {
          sidebaroptionstoggle.innerHTML = "ON";
          sidebaroptionstoggle.style.backgroundColor = "#46da0f";
        }else {
          sidebaroptionstoggle.innerHTML = "OFF";
          sidebaroptionstoggle.style.backgroundColor = "#da1b0f";
        }
      }
      appearancediv.appendChild(sidebaroptionsdropdown);
      let sidebaroptionstoggle = document.createElement("button");
      sidebaroptionstoggle.innerHTML = "Select";
      sidebaroptionstoggle.style = "width: 100px; height: 30px; font-size: 16px; margin-left: 10px; margin-right: 10px; background-color: #636a7d; border: none; border-radius: 5px; color: white;";
      sidebaroptionstoggle.disabled = true;
      sidebaroptionstoggle.style.display = "none";
      sidebaroptionstoggle.onclick = async function(){
        if (sidebaroptionsdropdown.selectedIndex != -1) {
          let value = appearence[sidebaroptionsdropdown.value];
          value = !value;
          appearence[sidebaroptionsdropdown.value] = value;
          GM_setValue("sellscript19877" + sidebaroptionsdropdown.value, value);
          if (!value) {
            sidebaroptionstoggle.innerHTML = "OFF";
            sidebaroptionstoggle.style.backgroundColor = "#da1b0f";
          }else {
            sidebaroptionstoggle.innerHTML = "ON";
            sidebaroptionstoggle.style.backgroundColor = "#46da0f";
          }
          if (sidebaroptionsdropdown.selectedIndex != 9) {
            let sidebarthing = document.getElementsByClassName("mantine-UnstyledButton-root mantine-NavLink-root mantine-1lilmtu")[sidebaroptionsdropdown.selectedIndex];
            if (sidebarthing){
              sidebarthing.style.display = value ? "block" : "none";
            }
          }else {
            let tosthing = document.getElementsByClassName("mantine-UnstyledButton-root mantine-NavLink-root mantine-4st4qq");
            for (let i = 0; i < tosthing.length; i++){
              tosthing[i].style.display = value ? "block" : "none";
            }
          }
        }
      }
      appearancediv.appendChild(sidebaroptionstoggle);

      //FINISH CREATION OF HELP MENU FUNCTION PART
      //FINISH CREATION OF HELP MENU FUNCTION PART
      //FINISH CREATION OF HELP MENU FUNCTION PART


      // CREATION OF AUTOSELL FUNCTION PART
      // CREATION OF AUTOSELL FUNCTION PART
      // CREATION OF AUTOSELL FUNCTION PART

        let autosell = document.createElement("div");
        autosell.id = "autosell";
        //the div must be hidden by default and shown below the button like a new box
        autosell.style = "display: none; width: 40%; height: auto; background-color: #282a2f; border-radius: 5px; color: white; margin-top: 10px; margin-bottom: 5px; margin-left: 19rem; align-items: center; justify-content: center; align-self: center; flex-direction: row; flex-wrap: nowrap;";
        //obtain the parent of the button and append the div to it
        header.parentNode.insertBefore(autosell, header.nextSibling);
        let button = document.createElement("button");
        button.innerHTML = "AutoSell: OFF";
        button.style = "width: 150px; height: 30px; font-size: 16px; margin-left: 10px; margin-right: 10px; background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
        if (active){
            button.innerHTML = "AutoSell: ON";
            button.style.backgroundColor = "#46da0f";
        }
        button.onclick = function(){
            active = !active;
            GM_setValue("sellscript19877active", active);
            if (active){
                button.innerHTML = "AutoSell: ON";
                button.style.backgroundColor = "#46da0f";
            } else {
                button.innerHTML = "AutoSell: OFF";
                button.style.backgroundColor = "#da1b0f";
            }
        }
        autosell.appendChild(button);
        let label = document.createElement("label");
        label.innerHTML = "Price: ";
        label.style = "font-size: 16px; margin-left: 10px; margin-left: 10px;";
        autosell.appendChild(label);
        let input = document.createElement("input");
        input.type = "number";
        input.value = price;
        input.style = "width: 100px; height: 30px; font-size: 16px; margin-left: 10px; margin-right: 10px;";
        input.onchange = function(){
            price = input.value;
            GM_setValue("sellscript19877price", price);
        }
        autosell.appendChild(input);
        let label2 = document.createElement("label");
        label2.innerHTML = "Currency: ";
        label2.style = "font-size: 16px; margin-left: 10px; margin-left: 10px;";
        autosell.appendChild(label2);
        let dropdown = document.createElement("select");
        dropdown.style = "width: 100px; height: 30px; font-size: 16px; margin-left: 10px; margin-right: 10px;";
        let option1 = document.createElement("option");
        option1.value = "money";
        option1.innerHTML = "Money";
        let option2 = document.createElement("option");
        option2.value = "tokens";
        option2.innerHTML = "Tokens";
        dropdown.appendChild(option1);
        dropdown.appendChild(option2);
        dropdown.onchange = function(){
            money = dropdown.value == "money";
            GM_setValue("sellscript19877money", money);
        }
        dropdown.value = money ? "money" : "tokens";
        autosell.appendChild(dropdown);
        let label3 = document.createElement("label");
        label3.innerHTML = "Time to sell: ";
        label3.style = "font-size: 16px; margin-left: 10px; margin-left: 10px;";
        autosell.appendChild(label3);
        let input2 = document.createElement("input");
        input2.type = "number";
        input2.value = secondstoSell;
        input2.style = "width: 60px; height: 30px; font-size: 16px; margin-left: 10px; margin-right: 10px;";
        input2.onchange = function(){
            secondstoSell = input2.value;
            GM_setValue("sellscript19877secondstoSell", secondstoSell);
        }
        autosell.appendChild(input2);
      }
        // FINISH CREATION OF AUTOSELL FUNCTION PART
        // FINISH CREATION OF AUTOSELL FUNCTION PART
        // FINISH CREATION OF AUTOSELL FUNCTION PART


        // CREATION OF SELL CASES FUNCTION PART
        // CREATION OF SELL CASES FUNCTION PART
        // CREATION OF SELL CASES FUNCTION PART
        if (currentDirectory == "/cases/cases"){
          isCasePage = false;
          isCoinflipPage = false;
          tempactiveautopen = false;
          createofSellCases();
        }else {
          tempactiveautopen = false;
          if (currentDirectory.startsWith("/cases/")){
            isCoinflipPage = false;
            if (autocaseopen) {
              autoopenbuttononpage.innerHTML = "Auto Open: OFF";
              autoopenbuttononpage.style = "width: 100px; height: 30px; font-size: 12px; margin-left: 200px; margin-right: 10px; background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
              autoopenbuttononpage.onclick = function(){
                tempactiveautopen = !tempactiveautopen;
                if (tempactiveautopen) {
                  autoopenbuttononpage.innerHTML = "Auto Open: ON";
                  autoopenbuttononpage.style.backgroundColor = "#46da0f";
                  // parse the url to get the case name, the url is like /cases/cases/Snakebite%20Case
                  let caseName = currentDirectory.split("/")[3];
                  let category = currentDirectory.split("/")[2];

                  doAutoOpen(caseName, category);
                }else {
                  autoopenbuttononpage.innerHTML = "Auto Open: OFF";
                  autoopenbuttononpage.style.backgroundColor = "#da1b0f";
                }
              }
              autocaselabel.innerHTML = "Awaiting for auto open to start...";
              autocaselabel.style = "font-size: 16px;";
              autocasedropslabel.innerHTML = "Drops: Waiting for auto open to start...";
              autocasedropslabel.style = "font-size: 16px; margin-left: 50px;";
              let casebuttons = document.getElementsByClassName("m_96bdd299")[1];
              casebuttons.appendChild(autoopenbuttononpage);
              casebuttons.appendChild(autocaselabel);
              casebuttons.appendChild(autocasedropslabel);

            }
          }else if (currentDirectory == "/game/upgrade") {
            if (upgraderactive){
              setTimeout(async function(){
                let casebuttons = document.getElementsByClassName("m_6d731127 mantine-Stack-root")[2];
                if (!document.getElementById("upgradertempbutton")) {
                upgradertempbutton.innerHTML = "Start Auto upgrader";
                upgradertempbutton.className = "mantine-Button-root mantine-Button-sizeMd mantine-Button-colorBlue mantine-Button-radiusSm";
                upgradertempbutton.style = "margin-left: 10px;";
                upgradertempbutton.id = "upgradertempbutton";
                upgradertempbutton.onclick = function(){
                    tempactive = !tempactive;
                    if (tempactive) {
                      upgradertempbutton.innerHTML = "Stop Auto upgrader";
                      upgraderlabel.innerHTML = "Loading inventory. Please wait...";
                      upgraderlabel.innerHTML += "<br>This can take up to 1 minute.";
                      doUpgrade();
                    }else {
                      upgradertempbutton.innerHTML = "Start Auto upgrader";
                    }
                };
                casebuttons.appendChild(upgradertempbutton);
                let centerContainer = document.getElementsByClassName("mantine-Stack-root mantine-1uuuflr")[0];
                let arrow = document.getElementsByClassName("m_d43b5134 mantine-RingProgress-svg")[0];
                arrow.style.display = "none";
                upgraderlabel.innerHTML = "Awaiting for upgrader to start...";
                upgraderlabel.style = "font-size: 16px;";
                casebuttons.appendChild(upgraderlabel);
              }
              }, 1000);
            }
          }else if (currentDirectory == "/game/coinflip"){
            if (coinflipactive){
              isCoinflipPage = true;
              setTimeout(async function(){
                while(isCoinflipPage) {
                  sockets[0].send('42["createGameCoinflip",{"bet":' + coinflipbet + '}]');
                  await new Promise(r => setTimeout(r, 850));
                  let botbutton = document.getElementsByClassName("mantine-UnstyledButton-root mantine-ActionIcon-root mantine-47oniq");
                  for (var i = 0; i < botbutton.length; i++) {
                      botbutton[i].click();
                  }
                }
              }, 1000);
            }
          }else if (currentDirectory == "/game/dice") {
            if (diceactive) {
              setTimeout(async function(){
                  if (!document.getElementById("autodicebutton")) {
                    let lastContainers = document.getElementsByClassName("m_96bdd299");
                    let lastContainer = lastContainers[lastContainers.length - 1];
                    let autodicebutton = document.createElement("button");
                    autodicebutton.innerHTML = "Auto Dice: OFF";
                    autodicebutton.id = "autodicebutton";
                    autodicebutton.style = "width: 100px; height: 30px; font-size: 12px; margin-left: 10px; margin-right: 10px; background-color: #da1b0f; border: none; border-radius: 5px; color: white;";
                    autodicebutton.onclick = async function(){
                      buttondiceActive = !buttondiceActive;
                      autodicebutton.innerHTML = "Auto Dice: " + (buttondiceActive ? "ON" : "OFF");
                      autodicebutton.style.backgroundColor = (buttondiceActive ? "#46da0f" : "#da1b0f");
                    }
                    lastContainer.appendChild(autodicebutton);
                  }
              }, 1000);
            }
          }else {
            isCasePage = false;
            isCoinflipPage = false;
          }
        }
    });
    setTimeout(async function(){
      while(true){
        if(active){
            sellSkins();
        }
        await new Promise(r => setTimeout(r, secondstoSell*1000));
      }
    }, 1000);
    setTimeout(async function(){
      while(true) {
        if (buttondiceActive) {
          let diceButton = document.getElementsByClassName("m_80f1301b")[3];
          if (!diceButton.disabled){
            let result = document.getElementsByClassName("m_b6d8b162")[11];
            if (result) {
              let textContent = result.textContent || result.innerText;

              if (textContent.includes("Lost")) {
                let inputElements = document.getElementsByClassName("m_8fb7ebe7");
                if (inputElements.length > 0) {
                  let inputElement = inputElements[0];
                  let inputValue = inputElement.value;
                  let numericValue = parseFloat(inputValue);

                  if (!isNaN(numericValue)) {
                    let doubledValue = numericValue * 2;
                    let newBet = doubledValue.toString();

                    // Temporarily disable MutationObservers
                    let observers = [];
                    const disableObservers = () => {
                      observers = Array.from(inputElement.closest('*').querySelectorAll('*'))
                        .filter(el => el.__zone_symbol__MutationObserver);
                      observers.forEach(observer => observer.disconnect());
                    };
                    const enableObservers = () => {
                      observers.forEach(observer => observer.observe());
                    };

                    disableObservers();

                    // Function to set the input value and trigger necessary events
                    const setInputValue = () => {
                      // Using Object.defineProperty to set the value
                      Object.defineProperty(inputElement, 'value', {
                        value: newBet,
                        writable: true
                      });
                      inputElement.setAttribute('value', newBet);

                      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                      inputElement.dispatchEvent(new Event('blur', { bubbles: true }));

                      console.log(inputElement.value);
                    };

                    setInputValue();
                    enableObservers();

                    if (inputElement.value !== newBet) {
                      console.log('Failed to set the input value after retries.');
                    }
                  } else {
                    console.log('The input value is not a number.');
                  }
                } else {
                  console.log('Input element not found.');
                }
              } else {
                let inputElements = document.getElementsByClassName("m_8fb7ebe7");
                if (inputElements.length > 0) {
                  let inputElement = inputElements[0];

                  // Temporarily disable MutationObservers
                  let observers = [];
                  const disableObservers = () => {
                    observers = Array.from(inputElement.closest('*').querySelectorAll('*'))
                      .filter(el => el.__zone_symbol__MutationObserver);
                    observers.forEach(observer => observer.disconnect());
                  };
                  const enableObservers = () => {
                    observers.forEach(observer => observer.observe());
                  };

                  disableObservers();

                  // Function to set the input value and trigger necessary events
                  const setInputValue = () => {
                    // Using Object.defineProperty to set the value
                    Object.defineProperty(inputElement, 'value', {
                      value: dicebet.toString(),
                      writable: true
                    });
                    inputElement.setAttribute('value', dicebet.toString());

                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                    inputElement.dispatchEvent(new Event('blur', { bubbles: true }));

                    console.log(inputElement.value);
                  };

                  setInputValue();
                  enableObservers();

                  if (inputElement.value !== dicebet.toString()) {
                    console.log('Failed to set the input value after retries.');
                  }
                } else {
                  console.log('Input element not found.');
                }
              }
            }
            diceButton.click();
          }
          await new Promise(r => setTimeout(r, 200));
        } else {
          await new Promise(r => setTimeout(r, 1500));
        }

        await new Promise(r => setTimeout(r, 200)); // 5-second wait

      }

    }, 1000);
    setTimeout(async function(){
      while(true){
        if(vaultactive){
          window.sockets[window.sockets.length - 1].send('42["collectVault"]')
        }
        await new Promise(r => setTimeout(r, 60000));
      }
    }, 2000);
    setTimeout(async function(){
      while(true){
        if(autoclick){
          if(selectedclick == "money"){
            window.sockets[window.sockets.length - 1].send('42["click"]')
          }else {
            window.sockets[window.sockets.length - 1].send('42["caseclick"]')
          }
          await new Promise(r => setTimeout(r, 115));
        }else {
          await new Promise(r => setTimeout(r, 30));
        }

      }
    }, 2000);
    setTimeout(async function(){
      if (autoclearcoinflip) {
        waitForKeyElements(".mantine-Grid-col.mantine-12vzwvd", clearCoinflips);
      }
    }, 2000);

})();