//***********************************************************************
//p5 canvas object
//***********************************************************************
var can = function(a){
/////////////////////////////////////////////////////////////////////////
//initializes the canvas
/////////////////////////////////////////////////////////////////////////
	a.setup = function(){
		//canvas constants
		a.BGC = a.color(0); //canvas background color
		a.cScale = 7; //overall scale of canvas
		a.cWidth = (a.cScale * 10) * 16;
		a.cHeight = (a.cScale * 10) * 9;
		a.nStars = round((a.cWidth * a.cHeight) / 10000); //number of background stars
		a.isPushed = false; //state variable for ship acceleration
		a.turnL = false; //state variable for ship turning left
		a.turnR = false; //state variable for ship turning right
		a.turnStep = .015; //how fast ship turns
		a.levelTime = 10; //how many seconds until the next level
		a.hiScore = 0;
		a.hiLevel = 0;
		
		//sets initial canvas attributes
		a.createCanvas(a.cWidth,a.cHeight);
		a.stroke(255);
		
		a.stars = []; //array of star objects
		a.upgradeList = []; //array of upgrades
		a.initStars();
		a.initUpgradeList();
		a.initCanvasObjects();
	}
/////////////////////////////////////////////////////////////////////////
//initializes objects used in the canvas
/////////////////////////////////////////////////////////////////////////
	a.initCanvasObjects = function(){
		//declares sprite objects to be used
		
		a.ship = ""; //ship object
		a.bullets = []; //array of bullet objects
		a.targets = []; //array of targets/asteroids
		a.upgrade = ""; //upgrade object
		a.magazine = ""; //ammo drop object
		a.shield = ""; //shield object
		a.tNo = 3; //number of initial targets
		a.gameTime = new Timer(); //game timer
		a.pGameTime = 0; //stores the previous elapsed gameTime value
		if(a.score > a.hiScore){a.hiScore = a.score;}
		if(a.level > a.hiLevel){a.hiLevel = a.level;}
		a.score = 0;
		a.level = 1;
		a.bulletCount = 15;
		a.shieldPower = 1;
		
		//initializes objects to be used in canvas
		
		a.initShip();
		a.initShield();
		a.initBullets();
		a.initTargets();
		a.initUpgrade();
		a.initUpgradeList();
		a.initMag();
	}
/////////////////////////////////////////////////////////////////////////
//canvas draw loop
/////////////////////////////////////////////////////////////////////////
	a.draw = function(){
		a.background(a.BGC);
		
		a.levelUp();
		a.drawStars();
		a.drawShield();
		a.drawShip();
		a.drawBullets();
		a.removeBullets();
		a.drawUpgrade();
		a.drawMag();
		a.drawTargets();
		a.bulletHit();
		a.shipHit();
		a.drawText();
	}
/////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////
	a.initShield = function(){
		var s = a.cScale * 14; //overall ship scale
		a.shield = new Ball(a.ship.pos.x,a.ship.pos.y,s,a);
		a.shield.setColor(a.BGC);
		a.shield.active = true;
		a.shield.force = 4;
		a.shield.push();
	}
/////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////
	a.drawShield = function(){
		a.push();
		if(a.shield.active){
			a.stroke(rand(0,255),rand(0,255),rand(0,255));
			a.shield.pos.x = a.ship.pos.x;
			a.shield.pos.y = a.ship.pos.y;
			a.shield.drawZone();
			for(var i = 0; i < a.targets.length; i++){
				if(a.shield.circInt(a.targets[i])){
					a.shield.collision2(a.targets[i]);
					a.shieldPower--;
					if(a.shieldPower == 0){
						a.shield.active = false;
					}
				}
			}
		}
		a.pop();
	}
/////////////////////////////////////////////////////////////////////////
//the upgrade list holds of series of boolean values that determine
//whether a certain upgrade is turned on or off.  the list is 
//initializes to facilitate up to 100 upgrades
// 0 - rapid auto fire
// 1 - rebound bullets
/////////////////////////////////////////////////////////////////////////
	a.initUpgradeList = function(){
		for(var i = 0; i < 100; i++){
			a.upgradeList[i] = false;
		}
	}
/////////////////////////////////////////////////////////////////////////
//initializes the ammo drop object
/////////////////////////////////////////////////////////////////////////	
	a.initMag = function(){
		a.magazine = new Ball(rand(0,a.width),rand(0,a.height),20,a);
		a.magazine.angle = rand(0,a.PI * 2);
		a.magazine.active = true;
		a.magazine.setColor(100,255,100);
		a.magazine.push();
	}
/////////////////////////////////////////////////////////////////////////
//draws and moves the ammo drop object
/////////////////////////////////////////////////////////////////////////	
	a.drawMag = function(){
		a.push();
		if(a.magazine.active){
			a.noStroke();
			a.magazine.move();
			a.magazine.rebound();
			a.magazine.drawZone();
			if(a.magazine.circInt(a.ship)){
				a.bulletCount = a.bulletCount + 15;
				a.magazine.active = false;
			}
		}
		a.pop();
	}
/////////////////////////////////////////////////////////////////////////
//initializes the upgrade bonus object
/////////////////////////////////////////////////////////////////////////
	a.initUpgrade = function(){
		a.upgrade = new Ball(rand(0,a.width),rand(0,a.height),20,a);
		a.upgrade.angle = rand(0,a.PI * 2);
		a.upgrade.active = true;
		a.upgrade.setColor(255,50,50);
		a.upgrade.value = 99;
		a.upgrade.push();
	}
/////////////////////////////////////////////////////////////////////////
//draws and moves the upgrade bonus object
/////////////////////////////////////////////////////////////////////////
	a.drawUpgrade = function(){
		a.push();
		if(a.upgrade.active){
			a.noStroke();
			a.upgrade.move();
			a.upgrade.rebound();
			a.upgrade.drawZone();
			if(a.upgrade.circInt(a.ship)){
				a.upgradeList[a.upgrade.value] = true;
				a.upgrade.active = false;
			}
		}
		a.pop();
	}
/////////////////////////////////////////////////////////////////////////
//turns on autoFire
/////////////////////////////////////////////////////////////////////////
	a.AFon = function(){
		if(a.upgradeList[0]){
			a.myInt = setInterval(function(){a.addBullet()},100);
		}else{
			a.myInt = setInterval(function(){a.addBullet()},1000);
		}
	}
/////////////////////////////////////////////////////////////////////////
//turns off autoFire
/////////////////////////////////////////////////////////////////////////
	a.AFoff = function(){
		clearInterval(a.myInt);
	}

/////////////////////////////////////////////////////////////////////////
//draws all text on screen
/////////////////////////////////////////////////////////////////////////
	a.drawText = function(){
		a.push();
		a.fill(255);
		a.stroke(255);
		a.textAlign(a.LEFT);
		a.text("Score: " + a.score,10,20);
		a.text("Level: " + a.level,10,35);
		a.textAlign(a.RIGHT);
		a.text("Hi Score: " + a.hiScore,a.width - 10,20);
		a.text("Hi Level: " + a.hiLevel,a.width - 10,35);
		a.textAlign(a.CENTER);
		a.text("Ammo: " + a.bulletCount,a.width / 2, 20);
		a.pop();
	}
/////////////////////////////////////////////////////////////////////////
//add a new target at a time interval from game timer
/////////////////////////////////////////////////////////////////////////
	a.levelUp = function(){
		if(a.gameTime.getElapsed() % a.levelTime == 0 && a.gameTime.getElapsed() != a.pGameTime){
			a.addTarget();
			a.magazine.active = true;
			a.upgrade.value = round(rand(0,1));
			a.upgrade.active = true;
			a.level++;
		}
		a.pGameTime = a.gameTime.getElapsed();
	}
/////////////////////////////////////////////////////////////////////////
//checks to see if the ship hit the targets/asteroids
/////////////////////////////////////////////////////////////////////////
	a.shipHit = function(){
		for(var i = 0; i < a.targets.length; i++){
			if(a.targets[i].circInt(a.ship)){
				a.initCanvasObjects();
			}
		}
	}
/////////////////////////////////////////////////////////////////////////
//checks to see if the bullet hit the targets/asteroids
/////////////////////////////////////////////////////////////////////////
	a.bulletHit = function(){
		var replace = false;
		for(var i = 0; i < a.bullets.length; i++){
			for(var j = 0; j < a.targets.length; j++){
				if(a.bullets[i].circInt(a.targets[j])){
					a.bullets.splice(i,1);
					a.targets.splice(j,1);
					a.addTarget();
					a.score++;// = a.score + 1;
					break;
				}
			}
		}
	}
/////////////////////////////////////////////////////////////////////////
//initializes targets array
/////////////////////////////////////////////////////////////////////////
	a.initTargets = function(){
		targets = [];
		for(var i = 0; i < a.tNo; i++){
			a.addTarget();
		}
	}
/////////////////////////////////////////////////////////////////////////
//adds a new target to the targets array
/////////////////////////////////////////////////////////////////////////
	a.addTarget = function(){
		var min = a.cScale * 5;
		var max = a.cScale * 15;
		var luck =0;
		var temp = "";

		luck = round(rand(0,1));
		if(luck == 0){
			temp = new Ball(0,rand(0,a.height),rand(min,max),a);
		}
		if(luck == 1){
			temp = new Ball(rand(0,a.width),0,rand(min,max),a);
		}
		a.targets.push(temp);
		temp.force = a.cScale * .25;
		temp.angle = rand(0,2 * a.PI);
		temp.setColor(a.BGC);
		temp.push();
	}
/////////////////////////////////////////////////////////////////////////
//draws and moves all objects in targets array
/////////////////////////////////////////////////////////////////////////
	a.drawTargets = function(){
		for(var i = 0; i < a.targets.length; i++){
			a.targets[i].move();
			a.targets[i].wrap();
			a.targets[i].drawZone();
			for(var j = i + 1; j < a.targets.length; j++){
				if(a.targets[i].circInt(a.targets[j])){
					a.targets[i].collision(a.targets[j]);
				}
			}
		}
	}
/////////////////////////////////////////////////////////////////////////
//initializes bullets array
/////////////////////////////////////////////////////////////////////////
	a.initBullets = function(){
		a.bullets = [];
	}
/////////////////////////////////////////////////////////////////////////
//adds a bullet to the bullets array
/////////////////////////////////////////////////////////////////////////
	a.addBullet = function(){
		var size = a.cScale * 1.25;
		if(a.bulletCount > 0){
			a.bullets.push(new Ball(a.ship.pos.x,a.ship.pos.y,size,a));
			var i = a.bullets.length - 1;
			a.bullets[i].angle = a.ship.angle;
			a.bullets[i].force = a.cScale * 2.5;
			a.bullets[i].push();
			a.bulletCount--;
		}
	}
/////////////////////////////////////////////////////////////////////////
//moves all objects in the bullets array
/////////////////////////////////////////////////////////////////////////
	a.drawBullets = function(){
		for(var i = 0; i < a.bullets.length; i++){
			a.bullets[i].move();
			a.bullets[i].drawZone();
			if(a.upgradeList[1]){
				a.bullets[i].rebound();
			}
		}
	}
/////////////////////////////////////////////////////////////////////////
//removes all objects in the bullets array that are outside of canvas
/////////////////////////////////////////////////////////////////////////
	a.removeBullets = function(){
		for(var i = 0; i < a.bullets.length; i++){
			if(a.bullets[i].pos.x > a.width || a.bullets[i].pos.x < 0 || a.bullets[i].pos.y > a.height || a.bullets[i].pos.y < 0){
				a.bullets.splice(i,1);
			}
		}
	}
/////////////////////////////////////////////////////////////////////////
//initializes stars array
/////////////////////////////////////////////////////////////////////////
	a.initStars = function(){
		a.stars = [];
		var starDist = 0;
		for (var i = 0; i < a.nStars ; i++){
			starDist = rand(.25,2);
			a.stars.push(new Ball(rand(0,a.width),rand(0,a.height),(Math.pow(2,starDist)),a));
			a.stars[i].force = (starDist / 2);
			a.stars[i].angle = 1.75 * PI;
			a.stars[i].push();
		}
	}
/////////////////////////////////////////////////////////////////////////
//draws and moves all objects in stars array
/////////////////////////////////////////////////////////////////////////
	a.drawStars = function(){
		for(var i = 0; i < a.nStars; i++){
			a.stars[i].move();
			a.stars[i].drawZone();
			a.stars[i].wrap();
		}
	}
/////////////////////////////////////////////////////////////////////////
//initializes ship object
/////////////////////////////////////////////////////////////////////////
	a.initShip = function(){
		a.autoFire = false;
		var s = a.cScale * 6; //overall ship scale
		a.ship = new Ball(a.width / 2,a.height / 2,s,a);
		a.ship.setColor(0);
		a.ship.friction = .01;
		a.ship.force = .1;
		a.ship.maxSpeed = a.cScale * .5;
	}
/////////////////////////////////////////////////////////////////////////
//draws and moves ship object
/////////////////////////////////////////////////////////////////////////
	a.drawShip = function(){
		a.ship.drawShip();
		//a.ship.drawZone();
		//cout(a.ship.vel.magnitude());
		if(a.isPushed){
			a.ship.push();
		}
		if(a.turnL == true){
			a.ship.angle = a.ship.angle - (a.turnStep * PI);
		}
		if(a.turnR == true){
			a.ship.angle = a.ship.angle + (a.turnStep * PI);
		}
		a.ship.move();
		a.ship.wrap();
	}
/////////////////////////////////////////////////////////////////////////
//turns on boolean variables to control the ship
//based on keypress events
/////////////////////////////////////////////////////////////////////////
	a.keyPressed = function(){
		//cout(a.keyCode);
		//up key
		if(a.keyCode == 38){a.isPushed = true;}
		//left key
		if(a.keyCode == 37){a.turnL = true;}
		//right key
		if(a.keyCode == 39){a.turnR = true;}
		//spacebar - bullet
		if(a.keyCode == 32){a.addBullet();a.AFon();}
	}
/////////////////////////////////////////////////////////////////////////
//turns off boolean variables to control the ship
//based on keyrelease events
/////////////////////////////////////////////////////////////////////////
	a.keyReleased = function(){
		//up key
		if(a.keyCode == 38){a.isPushed = false;}
		//left key
		if(a.keyCode == 37){a.turnL = false;}
		//right key
		if(a.keyCode == 39){a.turnR = false;}
		//space bar
		if(a.keyCode == 32){a.AFoff();}
	}
}