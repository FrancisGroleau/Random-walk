var canvas,
	cellsIndex = 0,
	cells = {},
	cellWidth = 5,
	cellHeight = 5,
	path = {},
	pathIndex = 0;
	var grid = [];
	var NumberOfRow, NumberOfCol;
	var index = 0;
	var pathDone = false;


window.onload = function(){

		canvas = document.getElementById("canvas"),
		c = canvas.getContext("2d");
		canvas.width = 800;
		canvas.height =  800;
			

		c.fillStyle = "rgba(0,0,0,0.2)";
		c.fillRect(0,0,canvas.width,canvas.height);
		
		initializeCanvas();
		
}

function initializeCanvas(){

	c.fillStyle = "rgba(0,0,0,0.2)";
	c.fillRect(0,0,canvas.width,canvas.height);
	
	NumberOfRow = (canvas.width / cellWidth);
	NumberOfCol = (canvas.height / cellHeight);

	//2D array lolz woot
	grid = new Array(NumberOfRow)
	for(var j = 0; j < NumberOfCol; j++)
		grid[j] = new Array(NumberOfRow);
	
	//create the cells
	for(var row = 0; row < NumberOfRow; row++){
		for(var col = 0; col < NumberOfCol; col++){
			grid[row][col] = new cell((row * cellWidth),(col * cellHeight),cellWidth,cellHeight, '#B8B8B8', 'rgba(0,0,0,0.2)', false);
		}
	} 

	createPath();
	//getPath;

	//draw them cells
	for( var ce in cells){	
		cells[ce].draw();
	}
	
	

}

function getPath(){

	for(var row = 0; row < NumberOfRow; row++){
		for(var col = 0; col < NumberOfCol; col++){
			var selectedCell = grid[row][col];
			if(selectedCell.isPath){
				path[pathIndex] = selectedCell;	
				pathIndex++;				
			}
		}
	}


}

function createPath(){
 	

	 var indexesOfCellsInLastCol = new Array();
	 for(var o = NumberOfRow; o < (NumberOfRow * NumberOfRow); o+= NumberOfRow)
		 indexesOfCellsInLastCol.push(o);

	 var indexesOfCellsInFirstCol = new Array();
	 for(var k = 1; k < (NumberOfRow * NumberOfRow); k+= NumberOfRow)
		 indexesOfCellsInFirstCol.push(k);
		
	 var usedDirection = [];
		
	 var x = 2;
	 var y = 2;
	 
	 // random walk without crossing
	 for(var i = 0; i < 5000; i++){
		var direction = Math.floor((Math.random()*4));
		
			//always start the same way
		if(i < 10){
			if(i == 9){
				grid[2][i].isPath = true;
				grid[1][i].isPath = true;
				x = i;
				y = 2;
			}
			grid[0][i].isPath = true;
		}	
		else
		{
			switch(direction){
					//left
					case 0: 
						if(!contains(usedDirection, 0)){
							if(collideDirection(y,x - 1) == 1 && collideDirection(y, x - 2) == 0) {
								//check if you are not in first col, because if you go left while you're in first col you go back to last row.
								if(!contains(indexesOfCellsInFirstCol, x) && !grid[y][x - 1].isPath){
									grid[y][x - 1].isPath = true;
									x--;
									usedDirection = [];
								}
								else
									usedDirection.push(0);
							}
						}
					break;
					//up
					case 1:
						if(!contains(usedDirection, 1)){
							if(collideDirection(y - 1,x) == 1 && collideDirection(y - 2,x) == 0){
								if(y - 1 > 1 && !grid[y - 1][x].isPath){
									grid[y - 1][x].isPath = true;
									y--;
									usedDirection = [];
								}
								else
									usedDirection.push(1);
							}
						}					
					break;
					//right
					case 2:
						if(!contains(usedDirection, 2)){				
							if(collideDirection(y,x + 1) == 1 && collideDirection(y,x + 2) == 0){
								//same as going left whil you're on the first col
								if(!contains(indexesOfCellsInLastCol, x) && !grid[y][x + 1].isPath){
									grid[y][x + 1].isPath = true;
									x++;
									usedDirection = [];
								}
								//don't be no fool and try to repeat your self
								else
									usedDirection.push(2);
							}
						}					
					break
					//down
					case 3:
						if(!contains(usedDirection, 3)){
							if(collideDirection(y + 1,x) == 1 && collideDirection(y + 2,x) == 0 ){
								if((y + 1 < (NumberOfRow - 1)) && !grid[y + 1][x].isPath){
									grid[y + 1][x].isPath = true;
									y++;
									usedDirection = [];
								}
								else
									usedDirection.push(3);
							}	
						}					
					break;
				}
			}
		}

}

function collideDirection(y, x){

	var numberOfCollidingCells = 0;
	if((x - 1 > 0) && (y - 1 > 1) && (x + 1 < NumberOfRow) && (y + 1 < NumberOfRow))
	{
		if(grid[y - 1][x].isPath)
			numberOfCollidingCells++;
		if(grid[y][x - 1].isPath)
			numberOfCollidingCells++;
		if(grid[y][x].isPath)
			numberOfCollidingCells++;
		if(grid[y][x + 1].isPath)
			numberOfCollidingCells++;
		if(grid[y + 1][x].isPath)
			numberOfCollidingCells++;
	
		return numberOfCollidingCells;
	}
	else
		return 0;
}

function clear(x,y,width,height){

	// Store the current transformation matrix
	c.save();

	// Use the identity matrix while clearing the canvas
	c.setTransform(1, 0, 0, 1, 0, 0);
	c.clearRect ( x , y , width , height );

	// Restore the transform
	c.restore();
	
}

function cell(x, y, width, height, borderColor, color, isPath){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.borderColor = borderColor;
	this.color = color;
	this.isPath = isPath;
	this.tower = null;
	this.isHover = false;
	this.isBase = false;
	this.leftArrow = false;
	
	//manage cells

	cells[cellsIndex] = this;		
	this.id = cellsIndex;
	cellsIndex++;


	
	this.draw = function(){
		if(this.isPath){	
		
			c.beginPath();
				c.lineWidth="1";
				c.strokeStyle= "black";//"rgba(255, 255, 0, 0.30)";
				c.rect(this.x,this.y,this.width,this.height);
			c.stroke(); 
		
			c.fillStyle = "yellow";
			c.fillRect(this.x,this.y,this.width,this.height);	
		}else{
			//Draw the normal cell
			c.beginPath();
				c.lineWidth="1";
				c.strokeStyle= this.borderColor;
				c.rect(this.x,this.y,this.width,this.height);
			c.stroke(); 
			
			c.fillStyle = "black";
			c.fillRect(this.x,this.y,this.width,this.height);
		}
		
	}

}

function contains(array, obj){
		 for (var i = 0; i < array.length; i++) {
        if (array[i] == obj  ) {
            return true;
        }
    }
    return false;

}



function intersect(rectA, rectB) {
  return !(rectA.x + rectA.width < rectB.x ||
           rectB.x + rectB.width < rectA.x ||
           rectA.y + rectA.height < rectB.y ||
           rectB.y + rectB.height < rectA.y);
}; 


	


