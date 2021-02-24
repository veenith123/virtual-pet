var dog;
var database;
var foodS;
var foodStock;
var lastFed;

function preload()
{
  dogImg1 = loadImage("images/dogImg.png");
  dogImg2 = loadImage("images/dogImg1.png");
  MilkImg = loadImage("images/Milk.png");
  wait = loadImage("images/please wait.jpg")
}

function setup() {
  createCanvas(800, 550);

  database = firebase.database();

  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value",readStock);
  
  dog = createSprite(550,300,50,50);
  dog.addImage(dogImg1);
  dog.scale = 0.2;

  feed = createButton("Feed Charlie");
  feed.position(1000,300);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(1010, 400);
  addFood.mousePressed(addFoods);

}


function draw() {
  background(166, 255, 190);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  image(MilkImg,450,320,100,100);
 
  drawSprites();

  


  fill(236, 130, 23);
  stroke(0);
  ellipse(677,210,95,90);
  ellipse(677,310,90,85);

  fill(206, 0, 9);
  noStroke();
  textSize(30);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + " PM", width/2-100,100);
   }else if(lastFed==0){
     text("Last Fed : 12 AM",width/2-100,100);
   }else{
     text("Last Fed : "+ lastFed + " AM", width/2-100,100);
   }

  if(lastFed === undefined){
    imageMode(CORNER)
    image(wait, 0, 0, width, height);
    feed.position(18000,300);
    addFood.position(10100, 400);
  }
  if(lastFed !== undefined){
    feed.position(1000,300);
    addFood.position(1010, 400);
  }
  if(foodS<0){
    foodS = 0
  }
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogImg2);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  dog.addImage(dogImg1);
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
