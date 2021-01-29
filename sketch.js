
//Create variables here
var dog;
var dogImg;
var happyDog;
var database;
var foodS;
var foodStock;
var feedButton,addButton;
var fedTime,lastFed;
var foodObj = null;
var changingGameState, readingGameState;
var bedroom, garden, washroom;
var gameState;

function preload()
{
  //load images here
  dogImg = loadImage("Dog.png");
  happyDog = loadImage("happydog.png");
  bedroom = loadImage("Bed Room.png");
  garden = loadImage("Garden.png");
  washroom = loadImage("Wash Room.png");
  sadDog = loadImage("Lazy.png");
}

function setup() {
  database = firebase.database();
  readingGameState = database.ref('gameState');
  readingGameState.on("value",function(data){
    gameState = data.val();
  });

  createCanvas(800, 500);
  dog = createSprite(500,250);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  feedButton = createButton("Feed your dog");
  feedButton.position(700, 95);
  feedButton.mousePressed(feedDog);

  addButton = createButton("Buy Milk Bottles");
  addButton.position(820, 95);
  addButton.mousePressed(addFood);

  foodObj = new Food();
}


function draw() {  
  background(46, 139, 87);
  fedTime=database.ref('lastFed'); 
  fedTime.on("value",function(data){ 
    lastFed=data.val(); 
  });


  drawSprites();
  //add styles here
  stroke("black");
  text("Food remaining : "+foodS,450,190);

  foodObj.display();

  if(lastFed>=12){
    text("Last Fed (approx timing) : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Fed (approx timing)  = 12 AM",350,30);
   }else{
     text("Last Fed (approx timing)  = "+ lastFed + " AM", 350,30);
  }

  if(gameState !== "Hungry"){
    feedButton.hide();
    addButton.hide();
    //dog.remove();
  }else{
    feedButton.show();
    addButton.show();
    dog.addImage(sadDog);
  }
  currentTime=hour();

  if(currentTime ===(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime ===(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime > (lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

}

//increment foodS, updateFoodStock using foodS
function addFood(){
  foodS++;
  foodObj.updateFoodStock(foodS);
}


//change dog , deduct foodS, updateFoodStock using foodS, set lastFed
function feedDog(){
  if(foodS > 0){
    dog.addImage(happyDog);
    foodS--;
    foodObj.updateFoodStock(foodS);
    lastFed = hour();
    foodObj.updateLastFed(lastFed);
  }
}

function readStock(data){
  foodS=data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}
