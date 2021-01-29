
class Food {
    constructor(){
    
        this.foodStock = 20;
        this.lastFed = 0;
        this.image = loadImage("Milk.png");
    
        database = firebase.database();
    }
    
    //updating value of food in database and foodstock with food parameter
    updateFoodStock(food){
        this.foodStock = food;
        database.ref("/").update({Food: food});
    }
    updateLastFed(lastFed){
        this.lastFed = lastFed;
        database.ref("/").update({lastFed: lastFed});
    }
    
    display(){
        var x = 80, y = 100;
        //imageMode(CENTER);
        if(this.foodStock != 0){
            for(var i = 0; i < this.foodStock; i++){
                if(i % 10 === 0){
                    x = 80;
                    y += 50;
                }
                image(this.image, x, y, 50, 50);
                    x += 30;
                }
            }
    }
    getFoodStock(){
        this.foodStock = database.ref("/");
        this.foodStock.on("value", updateFoodStock);
    }
    deductFood(){
        this.foodStock--;
        updateFoodStock(this.foodStock);
        updateLastFed(this.lastFed);
        console.log("in deductFood");
    }

    bedroom(){
        background(bedroom,550,500)
    }
    garden(){
        background(garden,550,500)
    }
    washroom(){
        background(washroom,550,500)
    }
    
}
