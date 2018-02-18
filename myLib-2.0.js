//*******************************************************************
//author: Daniel McLeod - 6/7/17
//this file contains:
//	- a utility function library
//	- a timer and stopwatch class
//	- a vector class
//	- a ball sprite class
//	- a rectangle sprite class
//	version 1.1
//	major updates include:
//	- addition of clock/timer/stopwatch objects
//	- inclusion of rectangle object
//	- added a rounding function to the library
//	- added a subtract vector function to the library
//	- added spin functionality to implement angular momentum on the
//	  ball and rectangle objects
//version 2.0
// major updates include:
//	- updates to timer functionality (like set start time)
//	- a new clockface objects the simulates a real world hand clock
//	- embedded canvas objects into Ball/Rectangle/ClockFace objects
//	- added color attribute to Ball and Rectangle objects
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//Utility function library
//*******************************************************************

//Constants
var PI = 3.141592653589793;

/////////////////////////////////////////////////////////////////////
//returns a random number between max and min
//if no max, returns random number between 0 and 1
//if no min, returns random number betwee 0 and max
/////////////////////////////////////////////////////////////////////
function rand(max,min){
	if(max == null){return Math.random();}
	if(max != null && min == null){return Math.random() * max;}
	if(max != null && min != null){return (Math.random() * (Math.max(max,min) - Math.min(max,min)) + Math.min(max,min));}
}
/////////////////////////////////////////////////////////////////////
//returns the passed number rounded to the specified decimal place
//if no place is passed it rounds to the nearest integer
//n is the number to be round, sf (significant figure) is how many
//places to round the number to.
/////////////////////////////////////////////////////////////////////
function round(n,sf){
	if(sf == null){
		return Math.round(n);
	}else{
		return (Math.round(n * (Math.pow(10,sf))) / (Math.pow(10,sf)));
	}
}
/////////////////////////////////////////////////////////////////////
//finds distance between two points
/////////////////////////////////////////////////////////////////////
function dist(x1,y1,x2,y2){
	modX = Math.pow(Math.max(x1,x2) - Math.min(x1,x2),2);
	modY = Math.pow(Math.max(y1,y2) - Math.min(y1,y2),2);
	return Math.pow(modX + modY,.5);
}
/////////////////////////////////////////////////////////////////////
//finds angle between two points
/////////////////////////////////////////////////////////////////////
function angle(x1,y1,x2,y2){
	return Math.atan2(y2 - y1,x2 - x1);
}
/////////////////////////////////////////////////////////////////////
//adds two vector objects and returns a new vector
/////////////////////////////////////////////////////////////////////
function addVectors(vec1, vec2){
	var tempVec = new Vector();
	tempVec.x = vec1.x + vec2.x;
	tempVec.y = vec1.y + vec2.y;
	return tempVec;
}
/////////////////////////////////////////////////////////////////////
//subtracts two vector objects and returns a new vector
/////////////////////////////////////////////////////////////////////
function subtractVectors(vec1, vec2){
	var tempVec = new Vector();
	tempVec.x = vec1.x - vec2.x;
	tempVec.y = vec1.y - vec2.y;
	return tempVec;
}
/////////////////////////////////////////////////////////////////////
//takes two (2D) vectors as input and returns the scalar dot product 
/////////////////////////////////////////////////////////////////////
function dotProduct(vec1, vec2){
	return((vec1.x * vec2.x) + (vec1.y * vec2.y))
}
/////////////////////////////////////////////////////////////////////
//returns true if two circle objects intersect, 
//takes two x,y and r/radius parameters
/////////////////////////////////////////////////////////////////////
function circInt(circ1, circ2){
	return dist(circ1.pos.x,circ1.pos.y,circ2.pos.x,circ2.pos.y) < (circ1.r + circ2.r);
}
/////////////////////////////////////////////////////////////////////
//returns true if a circle and point objects intersect, 
//takes an x,y and a circle 
/////////////////////////////////////////////////////////////////////
function circPointInt(x, y, circ){
	return dist(x,y,circ.pos.x,circ.pos.y) < (circ.r);
}
/////////////////////////////////////////////////////////////////////
//returns true if two rectangle objects intersect, 
//takes two x,y and r/radius parameters
/////////////////////////////////////////////////////////////////////
function rectPointInt(x,y,rect){
	return inRange(x, rect.p1().x, rect.p1().x + rect.w) &&
	inRange(y, rect.p1().y, rect.p1().y + rect.h);
}
/////////////////////////////////////////////////////////////////////
//returns true if a value falls within a range
/////////////////////////////////////////////////////////////////////
function inRange(val,min,max){
	return val >= Math.min(min,max) && val <= Math.max(max,min);
}
/////////////////////////////////////////////////////////////////////
//returns true if one range intersects another range
/////////////////////////////////////////////////////////////////////
function rangeInt(min1,max1,min2,max2){
	return Math.max(min1,max1) >= Math.min(min2,max2) &&
	Math.min(min1,max1) <= Math.max(min2,max2);
}
/////////////////////////////////////////////////////////////////////
//checks if two rectangles intersect using the rangeInt function
/////////////////////////////////////////////////////////////////////
function rectInt(rect1,rect2){
	return rangeInt(rect1.p1().x,rect1.p1().x + rect1.w,rect2.p1().x,rect2.p1().x + rect2.w) &&
	rangeInt(rect1.p1().y,rect1.p1().y + rect1.h,rect2.p1().y,rect2.p1().y + rect2.h);
}
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//this section contains the clock, timer, ClockFace and
//stopwatch objects
//*******************************************************************
//////////////////////////////////////////////////////////////////
//a clock has a time(second, minute, and hour), a way to increment time
//by the second and a way to print out formatted time.
//this object is made to be used with the timer object.
//////////////////////////////////////////////////////////////////
function Clock(){
	this.cs = 0; //centisecond
	this.ds = 0; //decisecond
	this.s = 0; //second
	this.m = 0; //minute
	this.h = 0; //hour
	//increments time by the second
	this.updateSec = function(){
		this.s = this.s + 1;
		if(this.s > 59){
			this.s = 0;
			this.m = this.m + 1;}
		if(this.m > 59){
			this.m = 0;
			this.h = this.h + 1;}}
	//increments time by centisecond
	this.updateCentiSec = function(){
		this.cs = this.cs + 1;
		if(this.cs > 9){
			this.ds = this.ds + 1;
			this.cs = 0;}
		if(this.ds > 9){
			this.s = this.s + 1;
			this.ds = 0;}
		if(this.s > 59){
			this.s = 0;
			this.m = this.m + 1;}
		if(this.m > 59){
			this.m = 0;
			this.h = this.h + 1;}}
	//returns a formatted text of the time
	//to the second
	this.printTime = function(){
		var s = this.s;
		var m = this.m;
		var h = this.h;
		if(this.s < 10){s = "0" + this.s;}
		if(this.m < 10){m = "0" + this.m;}
		if(this.h < 10){h = "0" + this.h;}
		return h + ":" + m + ":" + s;}
	//returns a formatted text of the time
	//to the centisecond
	this.printCsTime = function(){
		var s = this.s;
		var m = this.m;
		var h = this.h;
		if(this.s < 10){s = "0" + this.s;}
		if(this.m < 10){m = "0" + this.m;}
		if(this.h < 10){h = "0" + this.h;}
		return m + ":" + s + "." + this.ds + this.cs;}
	this.elapsedSec = function(){
		return this.s + (this.m * 60) + (this.h * 3600);}
	this.elapsedMin = function(){
		return round((this.s / 60) + (this.m) + (this.h * 60), 2);}
	this.elapsedHour = function(){
		return round((this.s / 3600) + (this.m / 60) + this.h, 3);}
}
//////////////////////////////////////////////////////////////////
//makes a clock and increments it on an interval.  made to be
//used with the clock object.  Precision to the second
//////////////////////////////////////////////////////////////////
function Timer(){
	var clock = new Clock();
	var myInt = setInterval(function(){clock.updateSec()},1000);
	this.print = function(){return clock.printTime();}
	this.stop = function(){clearInterval(myInt);}
	this.getElapsed = function(){return clock.elapsedSec();}
	this.setTime = function(h,m,s){
		clock.h = h;
		clock.m = m;
		clock.s = s;
	}
}
//////////////////////////////////////////////////////////////////
//makes a clock and increments it on an interval.  made to be
//used with the clock object.  Precision to the centi-second
//////////////////////////////////////////////////////////////////
function StopWatch(){
	var clock = new Clock();
	var myInt = setInterval(function(){clock.updateCentiSec()},10);
	this.print = function(){return clock.printCsTime();}
	this.stop = function(){clearInterval(myInt);}
	this.setTime = function(h,m,s){
		clock.h = h;
		clock.m = m;
		clock.s = s;
	}
}
//////////////////////////////////////////////////////////////////
//makes a clock face.  made to be used with the clock object,
//ball object and vector object.
//////////////////////////////////////////////////////////////////
function ClockFace(x,y,r,canvas){
	//initialize basic objects
	if(canvas != null){
		this.canvas = canvas;
	}
	this.timer = new Timer();
	if(canvas != null){
		this.face = new Ball(x,y,r,canvas);
	}else{
		this.face = new Ball(x,y,r);
	}
	//set constants
	this.faceBuffer = .65;
	this.tickBuffer = .95;
	this.smallTickWeight = this.face.r * .01;
	this.bigTickWeight = this.face.r * .015;
	this.secHandBuf = .9;
	this.secInt = (2 * PI) / 60;
	this.secHandWeight = this.face.r * .01;
	this.minHandBuf = .75;
	this.minInt = (2 * PI) / (60 * 60);
	this.minHandWeight = this.face.r * .02;
	this.hourHandBuf = .5;
	this.hourHandWeight = this.face.r * .03;
	this.hourInt = (2 * PI) / (60 * 60 * 12);
	
	//identify clock markers
	this.secHand = new Vector(0,-(this.face.r * this.secHandBuf));
	this.minHand = new Vector(0,-(this.face.r * this.minHandBuf));
	this.hourHand = new Vector(0,-(this.face.r * this.hourHandBuf));
	this.smallTick = new Vector(0,-(this.face.r * .9));
	this.bigTick = new Vector(0,-(this.face.r * .85));
	
/////////////////////////////////////////////////////////////////////
//sets the canvas object
/////////////////////////////////////////////////////////////////////	
	this.setCanvas = function(canvas){
		this.canvas = canvas;
		this.face.setCanvas(canvas);
	}
	
	//sets a new position for the clockface
	this.setPos = function(x,y){
		this.face.setPos(x,y);
	}
	//rescales the clockface
	this.setSize = function(r){
		this.face.r = r;
		this.secHand.set(0,-(this.face.r * this.secHandBuf));
		this.secHandWeight = this.face.r * .01;
		this.minHand.set(0,-(this.face.r * this.minHandBuf));
		this.minHandWeight = this.face.r * .02;
		this.hourHand.set(0,-(this.face.r * this.hourHandBuf));
		this.hourHandWeight = this.face.r * .03;
		this.smallTick.set(0,-(this.face.r * .9));
		this.smallTickWeight = this.face.r * .01;
		this.bigTick.set(0,-(this.face.r * .85));
		this.bigTickWeight = this.face.r * .015;
	}
	//draws the face onto the p5 canvas object
	this.draw = function(){
		this.face.drawZone();
		this.drawNumbers();
		this.drawSmallTicks();
		this.drawBigTicks();
		this.drawHour();
		this.drawMin();
		this.drawSec();
	}
	//draws numbers on face
	this.drawNumbers = function(){
		this.canvas.push();
		this.canvas.translate(this.face.pos.x,this.face.pos.y);
		this.canvas.textAlign(this.canvas.CENTER,this.canvas.CENTER);
		this.canvas.textSize(this.face.r / 3);
		this.canvas.text(12, 0,-(this.face.r * this.faceBuffer));//draws 12
		this.canvas.text(3, (this.face.r * this.faceBuffer), 0);//draws 3
		this.canvas.text(6, 0, (this.face.r * this.faceBuffer));//draws 6
		this.canvas.text(9,-(this.face.r * this.faceBuffer), 0);//draws 9
		this.canvas.pop();
	}
	//draws big tick marks
	this.drawBigTicks = function(){
		for(var i = 0; i < 12 ; i++){
			this.canvas.push();
			this.canvas.translate(this.face.pos.x,this.face.pos.y);
			this.canvas.rotate(this.secInt * i * 5);
			this.canvas.strokeWeight(this.bigTickWeight);
			this.canvas.line(this.bigTick.x,this.bigTick.y,0,(-this.face.r * this.tickBuffer));
			this.canvas.pop();
		}
	}
	//draws small tick marks
	this.drawSmallTicks = function(){
		for(var i = 0; i < 60 ; i++){
			this.canvas.push();
			this.canvas.translate(this.face.pos.x,this.face.pos.y);
			this.canvas.rotate(this.secInt * i);
			this.canvas.strokeWeight(this.smallTickWeight);
			this.canvas.line(this.smallTick.x,this.smallTick.y,0,(-this.face.r * this.tickBuffer));
			this.canvas.pop();
		}
	}
	//draws hour hand
	this.drawHour = function(){
		this.canvas.push();
		this.canvas.strokeWeight(this.hourHandWeight);
		this.canvas.translate(this.face.pos.x,this.face.pos.y);
		this.canvas.rotate(this.hourInt * this.timer.getElapsed());
		this.canvas.line(0,0,this.hourHand.x,this.hourHand.y);
		this.canvas.pop();
	}
	//draws minute hand
	this.drawMin = function(){
		this.canvas.push();
		this.canvas.strokeWeight(this.minHandWeight);
		this.canvas.translate(this.face.pos.x,this.face.pos.y);
		this.canvas.rotate(this.minInt * this.timer.getElapsed());
		this.canvas.line(0,0,this.minHand.x,this.minHand.y);
		this.canvas.pop();
	}
	//draws second hand
	this.drawSec = function(){
		this.canvas.push();
		this.canvas.strokeWeight(this.secHandWeight);
		this.canvas.translate(this.face.pos.x,this.face.pos.y);
		this.canvas.rotate(this.secInt * this.timer.getElapsed());
		this.canvas.line(0,0,this.secHand.x,this.secHand.y);
		this.canvas.line(0,this.face.r * .1,0,0);//draws tail
		this.canvas.pop();
	}
	//stops the clock
	this.stop = function(){
		this.timer.stop();
	}
	//sets time on clock
	this.setTime = function(h,m,s){
		this.timer.setTime(h,m,s);
	}
	//returns formatted time
	this.print = function(){return this.timer.print();}
}
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//defines a vector object, can also be used as a point
//*******************************************************************
function Vector(x,y){
	//object values
	this.x = x;//x coordinate/magnitude
	this.y = y;//y coordinate/magnitude
/////////////////////////////////////////////////////////////////////
//sets this vector to the same x,y values as another vector
/////////////////////////////////////////////////////////////////////
	this.setVector = function(vec){
		this.x = vec.x;
		this.y = vec.y;
	}
/////////////////////////////////////////////////////////////////////
//sets this vector to the passed x,y values
/////////////////////////////////////////////////////////////////////
	this.set = function(x,y){
		this.x = x;
		this.y = y;
	}
/////////////////////////////////////////////////////////////////////
//adds another vector object to this vector object
/////////////////////////////////////////////////////////////////////
	this.add = function(vec){
		this.x += vec.x;
		this.y += vec.y;
	}
/////////////////////////////////////////////////////////////////////
//subtracts another vector object to this vector object
/////////////////////////////////////////////////////////////////////
	this.subtract = function(vec){
		this.x -= vec.x;
		this.y -= vec.y;
	}
/////////////////////////////////////////////////////////////////////
//multiplies another vector object to this vector object
/////////////////////////////////////////////////////////////////////
	this.multiplyVector = function(vec){
		this.x *= vec.x;
		this.y *= vec.y;
	}
/////////////////////////////////////////////////////////////////////
//multiplies a scalar to this vector object
/////////////////////////////////////////////////////////////////////
	this.multiplyScalar = function(scalar){
		this.x *= scalar;
		this.y *= scalar;
	}
/////////////////////////////////////////////////////////////////////
//returns the dot product of this vector with a passed vector
/////////////////////////////////////////////////////////////////////
	this.dotProduct = function(vec){
		return ((this.x * vec.x) + (this.y * vec.y));
	}	
/////////////////////////////////////////////////////////////////////
//returns the distance of this vector object to another vector object
/////////////////////////////////////////////////////////////////////
	this.dist = function(vec){
		return dist(this.x,this.y,vec.x,vec.y);
	}
/////////////////////////////////////////////////////////////////////
//returns magnitude/length/norm of vector
/////////////////////////////////////////////////////////////////////
	this.magnitude = function(){
		return dist(this.x,this.y,0,0);
	}
/////////////////////////////////////////////////////////////////////
//returns a radian value of the angle of a vector
/////////////////////////////////////////////////////////////////////		
	this.getAngle = function(){
		return Math.atan2(this.y, this.x);
	}
/////////////////////////////////////////////////////////////////////
//sets vector based on an angle
/////////////////////////////////////////////////////////////////////
	this.setAngle = function(angle){
		this.x = Math.cos(angle);
		this.y = Math.sin(angle);
	}
/////////////////////////////////////////////////////////////////////
//returns a string containing the parameters of a Vector
/////////////////////////////////////////////////////////////////////	
	this.print = function(){
		return Math.round(this.x) + " / " + Math.round(this.y);
	}
}
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//makes a ball object, r is radius
//*******************************************************************
function Ball(x,y,diameter,canvas){
	if(canvas != null){
		this.canvas = canvas;
		this.color = this.canvas.color(255);
	}
	this.pos = new Vector(x,y); //position vector
	this.vel = new Vector(0,0); //velocity vector
	this.a = new Vector(0,0); //acceleration vector
	this.f = new Vector(0,0); //force vector
	this.g = new Vector(0,0); //gravity vector
	this.r = diameter / 2; //turns diameter into radius
	this.maxSpeed = 100; //used for speed limit
	this.angle = 0; //used for rotation
	this.isTurned = false; //used for rotation state
	this.isPushed = false; //if a force is acting on the ball
	this.force = 1; //magnitude of force applied to ball
	this.m = 1; //mass of ball
	this.img = "img/default.png"; //default image path
	this.friction = 0; //friction coefficient
	this.spinFriction = 0; //friction applied to spin
	this.inelastic = 1; //inelastic collision coefficient
	this.spin = 0; //angular momentum
	//if spin is negative then it is CCW, if spin is positive it is CW
	//the absolute value of spin is how hard it is spinning
	this.value = 0;
	this.active = true;
	
	this.scale = this.r * 2;
	//ship coordinates for body
	this.body = [-this.scale*.5,this.scale,this.scale*.5,this.scale,0,-this.scale,0,this.scale*.8];//body shape/coordinates
/////////////////////////////////////////////////////////////////////
//sets the canvas object
/////////////////////////////////////////////////////////////////////	
	this.setCanvas = function(canvas){
		this.canvas = canvas;
	}
/////////////////////////////////////////////////////////////////////
//sets the x and y to the pos vector
/////////////////////////////////////////////////////////////////////
	this.setPos = function(x,y){
		this.pos.x = x;
		this.pos.y = y;
	}
/////////////////////////////////////////////////////////////////////
//sets the x and y to the vel vector
/////////////////////////////////////////////////////////////////////
	this.setVel = function(x,y){
		this.vel.x = x;
		this.vel.y = y;
	}
/////////////////////////////////////////////////////////////////////
//sets the color, if only one value is given then a grayscale value
//is assigned, if all 3 are given then a RGB value is assigned
/////////////////////////////////////////////////////////////////////
	this.setColor = function(R,G,B){
		if(G == null && B == null){
			this.color = this.canvas.color(R);
		}else{
			this.color = this.canvas.color(R,G,B);
		}
	}
/////////////////////////////////////////////////////////////////////
//sets the x and y to the vel vector
/////////////////////////////////////////////////////////////////////
	this.setImg = function(filePath){
		if(filePath){
			this.img = this.canvas.loadImage(filePath);
		}else{
			this.img = this.canvas.loadImage(this.img);
		}
	}
/////////////////////////////////////////////////////////////////////
//draws the ball on the passed p5 canvas
/////////////////////////////////////////////////////////////////////
	this.drawZone = function(){
		this.canvas.push();
		if(this.color != null){
			this.canvas.fill(this.color);
		}
		this.canvas.ellipse(this.pos.x,this.pos.y,this.r * 2,this.r * 2);
		this.canvas.pop();
	}
/////////////////////////////////////////////////////////////////////
//draws the img on the passed p5 canvas
/////////////////////////////////////////////////////////////////////
	this.drawImg = function(){
		this.canvas.push();
		this.canvas.translate(this.pos.x, this.pos.y);
		this.canvas.rotate(this.angle);
		this.canvas.image(this.img,-this.r,-this.r,this.r * 2,this.r * 2);
		this.canvas.pop();
	}
/////////////////////////////////////////////////////////////////////
//draws a ship body onto the attached p5 canvas
/////////////////////////////////////////////////////////////////////
	this.drawShip = function(){
		this.canvas.push();
		if(this.color != null){
			this.canvas.fill(this.color);
		}
		
		//this.canvas.rect(this.p1().x,this.p1().y,this.w,this.h);
		this.canvas.translate(this.pos.x,this.pos.y);
		this.canvas.rotate(this.angle + (.5 * PI));
		this.canvas.stroke(0);
		this.canvas.triangle(this.body[0],this.body[1],this.body[2],this.body[3],this.body[4],this.body[5]);
		this.canvas.stroke(255);
		this.canvas.line(this.body[2],this.body[3],this.body[4],this.body[5]);
		this.canvas.line(this.body[0],this.body[1],this.body[4],this.body[5]);
		this.canvas.line(this.body[0],this.body[1],this.body[6],this.body[7]);
		this.canvas.line(this.body[2],this.body[3],this.body[6],this.body[7]);
		this.canvas.pop();
	}
/////////////////////////////////////////////////////////////////////
//returns true if this ball intersects with another ball
/////////////////////////////////////////////////////////////////////
	this.circInt = function(ball){
		return dist(this.pos.x,this.pos.y,ball.pos.x,ball.pos.y) < (this.r + ball.r);
	}
/////////////////////////////////////////////////////////////////////
//returns true if this ball intersects with a specified point
/////////////////////////////////////////////////////////////////////
	this.pointInt = function(x,y){
		return circPointInt(x,y,this);
	}
/////////////////////////////////////////////////////////////////////
//sets new velocity vector based on a perfect elastic collision
//with another ball
/////////////////////////////////////////////////////////////////////
	this.collision = function(ball){
		//calculations
		var a1 = angle(this.pos.x,this.pos.y,ball.pos.x,ball.pos.y);
		var a2 = angle(ball.pos.x,ball.pos.y,this.pos.x,this.pos.y);
		var m1 = ((this.m - ball.m) / (this.m + ball.m) * this.vel.magnitude()) + ((2*ball.m / (this.m + ball.m)) * ball.vel.magnitude());
		var m2 = ((ball.m - this.m) / (this.m + ball.m) * ball.vel.magnitude()) + ((2*this.m / (this.m + ball.m)) * this.vel.magnitude());
		
		//assignments
		this.vel.setAngle(a2);
		ball.vel.setAngle(a1);
		this.vel.multiplyScalar(m1 * this.inelastic);
		ball.vel.multiplyScalar(m2 * this.inelastic);
	}
/////////////////////////////////////////////////////////////////////
//sets new velocity vector based on an imperfect elastic collision
//with another ball
/////////////////////////////////////////////////////////////////////
	this.collision2 = function(ball){
		//calculations
		var a1 = angle(this.pos.x,this.pos.y,ball.pos.x,ball.pos.y);
		var a2 = angle(ball.pos.x,ball.pos.y,this.pos.x,this.pos.y);
		var mTot = (this.m * this.vel.magnitude()) + (ball.m * ball.vel.magnitude());
		var m1 = (mTot / 2) / this.m;
		var m2 = (mTot / 2) / ball.m;
		
		//assignments
		this.vel.setAngle(a2);
		ball.vel.setAngle(a1);
		this.vel.multiplyScalar(m1 * this.inelastic);
		ball.vel.multiplyScalar(m2 * this.inelastic);
	}
/////////////////////////////////////////////////////////////////////
//checks to see if force is applied
//adds gravity to force vector
//converts force vector to acceleration vector
//changes velocity vector with acceleration vector
//applies friction
//changes pos vector by vel vector
/////////////////////////////////////////////////////////////////////
	this.move = function(){
		this.f.set(0,0); //initializes force vector
		if(this.isPushed){
			this.f.setAngle(this.angle); //find angle/direction of force
			this.f.multiplyScalar(this.force); //applies magnitude of force
		}
		if(this.spin != 0){
			var tempAngle = this.vel.getAngle();
			var tempSpeed = this.vel.magnitude();
			
			this.vel.setAngle(tempAngle + this.spin);
			this.vel.multiplyScalar(tempSpeed);
		}
		this.a.setVector(this.f); //copies f to a
		this.a.multiplyScalar(1/this.m); //corrects force by applying mass to a=F/m
		this.a.add(this.g);//applies gravity
		this.vel.add(this.a); //adds acceleration to velocity
		this.vel.multiplyScalar(1 - this.friction); //applies friction
		this.spin = this.spin * (1 - this.spinFriction);
		this.speedLimit();
		this.pos.add(this.vel); //makes new position
	}
/////////////////////////////////////////////////////////////////////
//used to push the ball once
/////////////////////////////////////////////////////////////////////
	this.push = function(){
		this.isPushed = true;
		this.move();
		this.isPushed = false;
	}
/////////////////////////////////////////////////////////////////////
//will wrap the ball around the screen when a boundary is hit
/////////////////////////////////////////////////////////////////////
	this.wrap = function(){
		if((this.pos.x - this.r) > this.canvas.width){
			this.pos.x = -this.r;
		}else if((this.pos.x + this.r) < 0){
			this.pos.x = this.canvas.width + this.r;
		}
		
		if((this.pos.y - this.r) > this.canvas.height){
			this.pos.y = -this.r;
		}else if((this.pos.y + this.r) < 0){
			this.pos.y = this.canvas.height + this.r;
		}
	}
/////////////////////////////////////////////////////////////////////
//will rebound the ball when a screen boundary is reached
/////////////////////////////////////////////////////////////////////
	this.rebound = function(){
		if((this.pos.x + this.r) > this.canvas.width){
			this.pos.x = this.canvas.width - this.r;
			this.vel.x = -this.vel.x * this.inelastic;
		}else if((this.pos.x - this.r) < 0 && this.vel.x < 0){
			this.pos.x = this.r;
			this.vel.x = -this.vel.x * this.inelastic;
		}
		
		if((this.pos.y + this.r) > this.canvas.height){
			this.pos.y = this.canvas.height - this.r;
			this.vel.y = -this.vel.y * this.inelastic;
		}else if((this.pos.y - this.r) < 0){
			this.pos.y = this.r;
			this.vel.y = -this.vel.y * this.inelastic;
		}
	}
/////////////////////////////////////////////////////////////////////
//redistributes the velocity vector's x/y magnitude when maxSpeed is
//reached
/////////////////////////////////////////////////////////////////////
	this.speedLimit = function(){
		if(this.maxSpeed){
			if(this.vel.magnitude() > this.maxSpeed){
				this.vel.setAngle(this.vel.getAngle());
				this.vel.multiplyScalar(this.maxSpeed);
			}
		}
	}
/////////////////////////////////////////////////////////////////////
//returns a string containing the parameters of a Ball
/////////////////////////////////////////////////////////////////////	
	this.print = function(){
		return this.pos.x + " / " + this.pos.y + " / " + this.r;
	}
}
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************
//makes a rectangle/rect object, w is width, h is height
//*******************************************************************
function Rectangle(x,y,w,h,canvas){
	//basic passed values of rectangle
	if(canvas != null){
		this.canvas = canvas;
		this.color = this.canvas.color(255);
	}
	//x and y represent the center point
	this.pos = new Vector(x,y); //position vector
	this.vel = new Vector(0,0); //velocity vector
	this.w = w; //width
	this.h = h; //height
	this.s = (w + h) / 2;
	this.a = new Vector(0,0); //acceleration vector
	this.f = new Vector(0,0); //force vector
	this.g = new Vector(0,0); //gravity vector
	this.maxSpeed = 100; //used for speed limit
	this.angle = 0; //used for rotation
	this.isTurned = false; //used for rotation state
	this.isPushed = false; //if a force is acting on the rect
	this.force = 1; //magnitude of force applied to rect
	this.m = 1; //mass of rect
	this.img = "img/default.png"; //default image path
	this.friction = 0; //friction coefficient
	this.spinFriction = 0; //friction applied to spin
	this.inelastic = 1; //inelastic collision coefficient
	this.spin = 0; //angular momentum
	//if spin is negative then it is CCW, if spin is positive it is CW
	//the absolute value of spin is how hard it is spinning

	//derived corner values of rectangle
	this.pos1 = new Vector(-(w*.5),-(h*.5));
	this.pos2 = new Vector((w*.5),-(h*.5));
	this.pos3 = new Vector((w*.5),(h*.5));
	this.pos4 = new Vector(-(w*.5),(h*.5));
	
	//ship coordinates for body
	this.body = [-this.s*.5,this.s,this.s*.5,this.s,0,-this.s,0,this.s*.8];//body shape/coordinates
/////////////////////////////////////////////////////////////////////
//these set of functions return an adjusted
//corner value for drawing the rectangle
/////////////////////////////////////////////////////////////////////	
	this.p1 = function(){
		return addVectors(this.pos, this.pos1);
	}
	this.p2 = function(){
		return addVectors(this.pos, this.pos2);
	}
	this.p3 = function(){
		return addVectors(this.pos, this.pos3);
	}
	this.p4 = function(){
		return addVectors(this.pos, this.pos4);
	}
/////////////////////////////////////////////////////////////////////
//sets the canvas object
/////////////////////////////////////////////////////////////////////	
	this.setCanvas = function(canvas){
		this.canvas = canvas;
	}
/////////////////////////////////////////////////////////////////////
//sets the x and y to the pos vector
/////////////////////////////////////////////////////////////////////
	this.setPos = function(x,y){
		this.pos.x = x;
		this.pos.y = y;
	}
/////////////////////////////////////////////////////////////////////
//sets the x and y to the vel vector
/////////////////////////////////////////////////////////////////////
	this.setVel = function(x,y){
		this.vel.x = x;
		this.vel.y = y;
	}
/////////////////////////////////////////////////////////////////////
//sets the color, if only one value is given then a grayscale value
//is assigned, if all 3 are given then a RGB value is assigned
/////////////////////////////////////////////////////////////////////
	this.setColor = function(R,G,B){
		if(this.canvas != null){
			if(G == null && B == null){
				this.color = this.canvas.color(R);
			}else{
				this.color = this.canvas.color(R,G,B);
			}
		}
	}
/////////////////////////////////////////////////////////////////////
//draws the rectangle onto the attached p5 canvas
/////////////////////////////////////////////////////////////////////
	this.drawZone = function(){
		this.canvas.push();
		if(this.color != null){
			this.canvas.fill(this.color);
		}
		this.canvas.rect(this.p1().x,this.p1().y,this.w,this.h);
		this.canvas.pop();
	}
/////////////////////////////////////////////////////////////////////
//draws a ship body onto the attached p5 canvas
/////////////////////////////////////////////////////////////////////
	this.drawShip = function(){
		this.canvas.push();
		if(this.color != null){
			this.canvas.fill(this.color);
		}
		this.canvas.stroke(255);
		//this.canvas.rect(this.p1().x,this.p1().y,this.w,this.h);
		this.canvas.translate(this.pos.x,this.pos.y);
		this.canvas.rotate(this.angle + (.5 * PI));
		this.canvas.line(this.body[2],this.body[3],this.body[4],this.body[5]);
		this.canvas.line(this.body[0],this.body[1],this.body[4],this.body[5]);
		this.canvas.line(this.body[0],this.body[1],this.body[6],this.body[7]);
		this.canvas.line(this.body[2],this.body[3],this.body[6],this.body[7]);
		this.canvas.pop();
	}
/////////////////////////////////////////////////////////////////////
//draws the rectangle as a ball onto the attached p5 canvas
/////////////////////////////////////////////////////////////////////
	this.drawBall = function(){
		this.canvas.push();
		if(this.color != null){
			this.canvas.fill(this.color);
		}
		this.canvas.ellipse(this.pos.x,this.pos.y,this.w,this.h);
		this.canvas.pop();
	}
/////////////////////////////////////////////////////////////////////
//sets the image from the desired file path or uses the default image
/////////////////////////////////////////////////////////////////////
	this.setImg = function(filePath){
		if(filePath){
			this.img = this.canvas.loadImage(filePath);
		}else if(this.canvas != null){
			this.img = this.canvas.loadImage(this.img);
		}
	}
/////////////////////////////////////////////////////////////////////
//draws the img on the passed p5 canvas
/////////////////////////////////////////////////////////////////////
	this.drawImg = function(){
		this.canvas.push();
		this.canvas.translate(this.pos.x, this.pos.y);
		this.canvas.rotate(this.angle);
		this.canvas.image(this.img,-this.w / 2,-this.h / 2,this.w,this.h);
		this.canvas.pop();
	}
/////////////////////////////////////////////////////////////////////
//returns true if the passed rectangle intersects this rectangle
/////////////////////////////////////////////////////////////////////
	this.rectInt = function(rect){
		return rectInt(this,rect);
	}
/////////////////////////////////////////////////////////////////////
//returns true if a passed point intersects the rectangle
/////////////////////////////////////////////////////////////////////	
	this.pointInt = function(x,y){
		return rectPointInt(x,y,this);
	}
/////////////////////////////////////////////////////////////////////
//sets new velocity vector based on elastic collision with another rect
/////////////////////////////////////////////////////////////////////
	this.collision = function(rect){
		//calculations
		var a1 = angle(this.pos.x,this.pos.y,rect.pos.x,rect.pos.y);
		var a2 = angle(rect.pos.x,rect.pos.y,this.pos.x,this.pos.y);
		var m1 = ((this.m - rect.m) / (this.m + rect.m) * this.vel.magnitude()) + ((2*rect.m / (this.m + rect.m)) * rect.vel.magnitude());
		var m2 = ((rect.m - this.m) / (this.m + rect.m) * rect.vel.magnitude()) + ((2*this.m / (this.m + rect.m)) * this.vel.magnitude());
		
		//assignments
		this.vel.setAngle(a2);
		rect.vel.setAngle(a1);
		this.vel.multiplyScalar(m1 * this.inelastic);
		rect.vel.multiplyScalar(m2 * this.inelastic);
	}
/////////////////////////////////////////////////////////////////////
//sets new velocity vector based on an imperfect elastic collision
//with another rectangle
/////////////////////////////////////////////////////////////////////
	this.collision2 = function(rect){
		//calculations
		var a1 = angle(this.pos.x,this.pos.y,rect.pos.x,rect.pos.y);
		var a2 = angle(rect.pos.x,rect.pos.y,this.pos.x,this.pos.y);
		var mTot = (this.m * this.vel.magnitude()) + (rect.m * rect.vel.magnitude());
		var m1 = (mTot / 2) / this.m;
		var m2 = (mTot / 2) / rect.m;
		
		//assignments
		this.vel.setAngle(a2);
		rect.vel.setAngle(a1);
		this.vel.multiplyScalar(m1 * this.inelastic);
		rect.vel.multiplyScalar(m2 * this.inelastic);
	}
/////////////////////////////////////////////////////////////////////
//checks to see if force is applied
//adds gravity to force vector
//converts force vector to acceleration vector
//changes velocity vector with acceleration vector
//applies friction
//changes pos vector by vel vector
/////////////////////////////////////////////////////////////////////
	this.move = function(){
		this.f.set(0,0); //initializes force vector
		if(this.isPushed){
			this.f.setAngle(this.angle); //find angle/direction of force
			this.f.multiplyScalar(this.force); //applies magnitude of force
		}
		if(this.spin != 0){
			var tempAngle = this.vel.getAngle();
			var tempSpeed = this.vel.magnitude();
			
			this.vel.setAngle(tempAngle + this.spin);
			this.vel.multiplyScalar(tempSpeed);
		}
		this.a.setVector(this.f); //copies f to a
		this.a.multiplyScalar(1/this.m); //corrects force by applying mass to a=F/m
		this.a.add(this.g);//applies gravity
		this.vel.add(this.a); //adds acceleration to velocity
		this.vel.multiplyScalar(1 - this.friction); //applies friction
		this.spin = this.spin * (1 - this.spinFriction);
		this.speedLimit();
		this.pos.add(this.vel); //makes new position
	}
/////////////////////////////////////////////////////////////////////
//used to push the rect once
/////////////////////////////////////////////////////////////////////
	this.push = function(){
		this.isPushed = true;
		this.move();
		this.isPushed = false;
	}
/////////////////////////////////////////////////////////////////////
//will wrap the rect around the screen when a boundary is hit
/////////////////////////////////////////////////////////////////////
	this.wrap = function(){
		if((this.pos.x - (this.w / 2)) > this.canvas.width){
			this.pos.x = -(this.w / 2);
		}else if((this.pos.x + (this.w / 2)) < 0){
			this.pos.x = this.canvas.width + (this.w / 2);
		}
		
		if((this.pos.y - (this.h / 2)) > this.canvas.height){
			this.pos.y = -(this.h / 2);
		}else if((this.pos.y + (this.h / 2)) < 0){
			this.pos.y = this.canvas.height + (this.h / 2);
		}
	}
/////////////////////////////////////////////////////////////////////
//will rebound the rect when a screen boundary is reached
/////////////////////////////////////////////////////////////////////
	this.rebound = function(){
		if((this.pos.x + (this.w / 2)) > this.canvas.width){
			this.pos.x = this.canvas.width - (this.w / 2);
			this.vel.x = -this.vel.x * this.inelastic;
		}else if((this.pos.x - (this.w / 2)) < 0 && this.vel.x < 0){
			this.pos.x = (this.w / 2);
			this.vel.x = -this.vel.x * this.inelastic;
		}
		
		if((this.pos.y + (this.h / 2)) > this.canvas.height){
			this.pos.y = this.canvas.height - (this.h / 2);
			this.vel.y = -this.vel.y * this.inelastic;
		}else if((this.pos.y - (this.h / 2)) < 0){
			this.pos.y = (this.h / 2);
			this.vel.y = -this.vel.y * this.inelastic;
		}
	}
/////////////////////////////////////////////////////////////////////
//redistributes the velocity vector's x/y magnitude when maxSpeed is
//reached
/////////////////////////////////////////////////////////////////////
	this.speedLimit = function(){
		if(this.maxSpeed){
			if(this.vel.magnitude() > this.maxSpeed){
				this.vel.setAngle(this.vel.getAngle());
				this.vel.multiplyScalar(this.maxSpeed);
			}
		}
	}
/////////////////////////////////////////////////////////////////////
//returns a string containing the parameters of a Rectangle
/////////////////////////////////////////////////////////////////////	
	this.print = function(){
		return this.x + " / " + this.y + " / " + this.w + " / " + this.h;
	}
}