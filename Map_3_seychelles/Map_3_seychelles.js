// for left data counter
var data = [];
var dataCount = 200;
var dataMin = 0;
var dataMax = 200;

var bounds = { };

//for map
var dataVisa;
//var dataGdp;
var country = "Passport";
var countryISO = "PassportISO2";
var visa = "Destination";
var visaISO = "DestinationISO2";

var placeList = [];
var accessList = {};
var GDPList = {};
let worldMap;

let currentPlace = {};

let buttonIr;
let buttonAe;
let buttonMu;
let buttonBs;
let buttonHt;

var start_val = false;
var start_text = true;

var clicked = false;


//Loading data and assets
function preload() {
 
  akrobatbl = loadFont('assets/Akrobat-Black.otf');
  akrobat = loadFont('assets/Akrobat-Regular.otf');
 
  
}

function setup() {
  createCanvas(1500, 800);
  //createCanvas(windowWidth, windowHeight);
  background(255);
  
  
  buttonIr = createButton('Iran');
  buttonIr.mousePressed(button_Ir_func);
  buttonIr.style("font-size", "14pt");
  buttonIr.position(width/2 + 520, 310);
  buttonIr.style("background-color", "#B76A67");
  buttonIr.style("font-family", "akrobat");
  buttonIr.style("color", "#E5B3AC");
  buttonIr.style("border", "#C67871");
  buttonIr.style("text-align", "Left");
  buttonIr.size(160, 23);
  
  buttonAe = createButton('United Arab Emirates');
  buttonAe.mousePressed(button_Ae_func);
  buttonAe.style("background-color", "#B76A67");
  buttonAe.style("font-size", "14pt");
  buttonAe.position(width/2 + 520, 335);
  buttonAe.style("font-family", "akrobat");
  buttonAe.style("color", "#E5B3AC");
  buttonAe.style("border", "#C67871");
  buttonAe.style("text-align", "Left");
  buttonAe.size(160, 23);
  //buttonAe.mousePressed( buttonAe.style("color", "#FCD7B6"));
  
  
  buttonBs = createButton('The Bahamas');
  buttonBs.mousePressed(button_Bs_func);
  buttonBs.style("font-size", "14pt");
  buttonBs.position(width/2 + 520, 375);
  buttonBs.style("background-color", "#B76A67");
  buttonBs.style("font-family", "akrobat");
  buttonBs.style("color", "#E5B3AC");
  buttonBs.style("border", "#C67871");
  buttonBs.style("text-align", "Left");
  buttonBs.size(160, 23);
   
  buttonHt = createButton('Haiti');
  buttonHt.mousePressed(button_Ht_func);
  buttonHt.style("font-size", "14pt");
  buttonHt.position(width/2 + 520, 400);
  buttonHt.style("background-color", "#B76A67");
  buttonHt.style("font-family", "akrobat");
  //buttonHt.style("color", "#FCD7B6");
  buttonHt.style("color", "#E5B3AC");
  buttonHt.style("border", "#C67871");
  buttonHt.style("text-align", "Left");
  buttonHt.size(160, 23);
  //buttonVe.style("press", "#C67871");
  
  
  buttonMu = createButton('Mauritius');
  buttonMu.mousePressed(button_Mu_func);
  buttonMu.style("font-size", "14pt");
  buttonMu.position(width/2 + 520, 440);
  buttonMu.style("background-color", "#B76A67");
  buttonMu.style("font-family", "akrobat");
  buttonMu.style("color", "#E5B3AC");
  buttonMu.style("border", "#C67871");
  buttonMu.style("text-align", "Left");
  buttonMu.size(160, 23);
  
  buttonSc = createButton('Seychelles');
  buttonSc.mousePressed(button_Sc_func);
  buttonSc.style("font-size", "14pt");
  buttonSc.position(width/2 + 520, 465);
  buttonSc.style("background-color", "#B76A67");
  buttonSc.style("font-family", "akrobat");
  buttonSc.style("color", "#E5B3AC");
  buttonSc.style("border", "#C67871");
  buttonSc.style("text-align", "Left");
  buttonSc.size(160, 23);
  
  // If you change the dimensions, the aspect ratio will stay the same.
  // The browser will size the map to use as much of the width/height as possible.
  let mapWidth = width * 0.7;  // use 80% of the sketch size
  let mapHeight = height * 0.7;
  
  let mapX = (width - mapWidth) / 2;
  let mapY = (height - mapHeight) / 2;

  let mapPath = "data/world-robinson.svg";

  // This will create a new SVG map from the 'robinson.svg' file in the data folder.
  // Once the map has finished loading, the mapReady() function will be called.
  worldMap = new SimpleSVG(mapPath, mapX, mapY, mapWidth, mapHeight, mapReady);
  
  //do I still need this?
  dataVisa = loadTable("data/passport-index-full-tidy.csv", "header", "csv", tableLoaded);
  
  accessRank = loadTable("data/access_rank.csv", "header", "csv", accessRankTableLoaded);
  print(accessRank);
  
  //dataGdp = loadTable("data/GDPperCapita_group.csv", "header", dataGdpTableLoaded);
  //print(dataGdp);
  
  bounds.left = 100;
  bounds.right = 190;
  bounds.top = 110;
  bounds.bottom = 625;
  
}

function accessRankTableLoaded(t) {
  // go through each row of the countries
  for (let row = 0; row < t.getRowCount(); row++) {
    var passISO = t.getString(row, "PassportISO2").toLowerCase();
    accessList[passISO] = t.getNum(row, "Access");
    //print("current access: " + accessList[passISO]);
  }
  
  print(accessList);
  
  print(placeList.length);
}

function dataGdpTableLoaded(t) {
  // go through each row of the countries
  for (let r = 0; r < t.getRowCount(); r++) {
    var passISO = t.getString(r, "PassportISO2").toLowerCase();
    GDPList[passISO] = t.getString(r, "GDP");
    print("GDP " + GDPList[passISO]);
  }
  
 // print(GDPList);
  
  print(placeList.length)
  
}


function tableLoaded(t) {
  // go through each row of the countries
  for (let row = 0; row < t.getRowCount(); row++) {
    let place = { };
    place.pass = t.getString(row, "Passport");
    place.passISO = t.getString(row, "PassportISO2").toLowerCase();
    place.dest = t.getString(row, "Destination");
    place.destISO = t.getString(row, "DestinationISO2").toLowerCase();
    place.value = t.getNum(row, "Value");
    place.access = 0;
  
    // now calculate specific location
    //let projected = projectAlbers(place.lon, place.lat);
    // or you can use the Mercator version:
    //var projected = projectMercator(place.lon, place.lat);
    //place.x = projected.x;
    //place.y = projected.y;
    placeList.push(place);
  }
  
  print(placeList.length);
}

// this function is called when the map loads
function mapReady() {
  // show a list of all the shapes by ISO
  print(worldMap.listShapes());

  // call the function named 'mapClick' whenever a shape is clicked
  worldMap.onClick(mapClick);

  // handle mouseover (hover) events, and mouseout (the opposite of hover)
  worldMap.onMouseOver(mapOver);
  worldMap.onMouseOut(mapOut);
}


function mapClick(shape) {
  // initial start value for ellipses
  start_val = true;
  start_text = false;
  
  if (!ignoreShape(shape.id)) {
     worldMap.setFill(shape, "#E0A094"); 
     //can change the shape here, so instead of shape id, put the name);
    for (let row = 0; row < placeList.length; row++){
      let place = placeList[row];
     // print ("place id :" + place.name);
      if (place.passISO == shape.id && place.destISO !== "xk" && place.destISO !== "ss") {
        print ("country name:" + place.pass);
        currentPlace = place;
        clicked = true;
        if (place.value == 0){
          worldMap.setFill(place.destISO, "#FFFFFF");
        }
        else if (place.value == 1){
          worldMap.setFill(place.destISO, "#FFBA91");
        }
        else if (place.value == 2){
          worldMap.setFill(place.destISO, "#FFDECA")
        }
        else if(place.value == 3){
          worldMap.setFill(place.destISO, "#78C2C2");
        }
      }
    }
  }
  print(`click ${shape.id}`);
  
}

//function button_Af_func(){
//  var afghanistan_shape = document.getElementById("af");
//  mapClick(afghanistan_shape);

//}
function button_Ir_func(){
  var Ir_shape = document.getElementById("ir");
  mapClick(Ir_shape);

}

function button_Ae_func(){
  var uae_shape = document.getElementById("ae");
  mapClick(uae_shape);

}


function button_Bs_func(){
  var bs_shape = document.getElementById("bs");
  mapClick(bs_shape);
}

function button_Ht_func(){
  var Ht_shape = document.getElementById("ht");
  mapClick(Ht_shape);
}
  

function button_Mu_func(){
  var mu_shape = document.getElementById("mu");
  mapClick(mu_shape);
  
}

function button_Sc_func(){
  var sc_shape = document.getElementById("sc");
  mapClick(sc_shape);
  
}
  

function mapOver(shape) {
  if (!ignoreShape(shape.id)) {
    //console.log("Shape: " + shape.id);
    worldMap.setFill(shape, '#666');
  }
 // print(`over ${shape.id}`);
}


function mapOut(shape) {
  if (!ignoreShape(shape.id)) {
    worldMap.setFill(shape, '#ccc');
  }
  print(`out ${shape.id}`);
}


// returns 'true' if this shape should be ignored
// i.e. if it's the ocean or it's the boundary lines between states
function ignoreShape(name) {
  return (name === 'ocean' || name.startsWith('lines-'));
}


function draw() {
    background("#C67871");
    
    textFont(akrobat);
    textSize(30);
    textAlign(CENTER, CENTER);
    
    text("Visa vis Freedom", width/2, 40)
 
  
  // Your sketch can go here, but keep in mind that the map will always be on top.
  if (clicked) {
    fill("#E0A094");
    textFont(akrobatbl);
    textSize(40);
    text(currentPlace.pass, width/2, 90);
    print ("CLICKED " + currentPlace.pass);
    
    
    textFont(akrobatbl);
    textSize(15);
    fill("#78C2C2");
    text("visa free", width/2 - 240, height-80);
    ellipse(width/2 - 240, height - 110, 20, 20);
    fill("#FFBA91");
    text("visa on arrival", width/2 - 95, height-80);
    ellipse( width/2 - 95, height - 110, 20, 20);
    
    fill("#FFDECA");
    text("electronic visa", width/2 + 55, height-80);
    ellipse(width/2 + 55, height - 110, 20, 20);
    //noStroke();
    fill("white");
    text("visa required", width/2 + 210, height-80);
    ellipse(width/2 + 210, height - 110, 20, 20);
  }
 

  fill("#E0A094");
  stroke("#C67871");
  
  if(start_val){
    var count = 0;
    for (var y = bounds.bottom; y > bounds.top; y -= 16){
       for (var x = bounds.left; x < bounds.right; x += 16) {
         if (count >= accessVal) {
          break;
        }
         //rotate(HALF_PI);
         
        ellipse(x, y, 16, 16);
        var accessVal = accessList[currentPlace.passISO];
        
        
        count = count + 1;
      }
    }
  }
  
  if(start_text){
    textSize(30);
    textAlign(LEFT);
    text("Exploring tourist visa accessibility around the world", 50, 200, 150, 350);
  }
  
  
  if (clicked) {
    
    fill("#E0A094");
    textFont(akrobatbl);
    textSize(40);
    textAlign(CENTER, CENTER);
    
    var accessVal = accessList[currentPlace.passISO];
    
    text(accessVal, (bounds.right - bounds.left)/2 + bounds.left - 10, height - 120);
    textSize(15);
    textFont(akrobat);
    text("countries", (bounds.right - bounds.left)/2 + bounds.left - 10, height - 80);
 
  }
}


    
