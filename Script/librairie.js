var canvas,
	cells = [],
	cellWidth = 5,
	cellHeight = 5;
	var grid = [];
	var NumberOfRow, NumberOfCol;
	var index = 0;
	var pathDone = false;
	var tries = [];
	var directionFrequency = [0, 0, 0, 0];

window.onload = function(){

		canvas = document.getElementById("canvas"),
		c = canvas.getContext("2d");
		canvas.width = 800;
		canvas.height =  800;
			
		initializeCanvas();	
}

function initializeCanvas(){

	c.fillStyle = "black";
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
			var tmpCell = cell((row * cellWidth),(col * cellHeight),cellWidth,cellHeight, '#B8B8B8', 'black', false);
			cells.push(tmpCell);
			grid[row][col] = tmpCell;
			
		}
	} 

	createPath();
	drawCells();	
}

function clearGrid(){

	cells = [];
	tries = [];
	directionFrequency = [0, 0, 0, 0];
	
	c.clearRect (0 , 0 , canvas.width, canvas.height);
	c.fillStyle = "black";
	c.fillRect(0,0,canvas.width,canvas.height);

	grid = [];
	grid = new Array(NumberOfRow)
	for(var j = 0; j < NumberOfCol; j++)
		grid[j] = new Array(NumberOfRow);
		
	for(var row = 0; row < NumberOfRow; row++){
		for(var col = 0; col < NumberOfCol; col++){
			var tmpCell = cell((row * cellWidth),(col * cellHeight),cellWidth,cellHeight, '#B8B8B8', 'black', false);
			cells.push(tmpCell);
			grid[row][col] = tmpCell;
			
		}
	} 

	drawCells();
}

function emptyGrid(){
	
	cells = [];
	grid = [];
	directionFrequency = [0, 0, 0, 0];
	
	grid = new Array(NumberOfRow)
	for(var j = 0; j < NumberOfCol; j++)
		grid[j] = new Array(NumberOfRow);
		
	for(var row = 0; row < NumberOfRow; row++){
		for(var col = 0; col < NumberOfCol; col++){
			var tmpCell = cell((row * cellWidth),(col * cellHeight),cellWidth,cellHeight, '#B8B8B8', 'black', false);
			grid[row][col] = tmpCell;
			cells.push(tmpCell);
		}
	}

	drawCells();

}

function regenerate(){
	
	tries.push(cells);
	
	
	emptyGrid();
	createPath();

	drawCells();
	

	
	for(var i = 0; i < tries.length; i++){
		var cellsForCurrentTry = tries[i];
		for( var j = 0; j < cellsForCurrentTry.length; j++){
			cellsForCurrentTry[j].isNotCurrentGeneration = true;
			cellsForCurrentTry[j].draw();
		}
	
	}
	
	/*
	for( var t in tries){
		var cellsForCurrentTry = tries[t];
		for( var ce in cellsForCurrentTry){
			cellsForCurrentTry[ce].isNotCurrentGeneration = true;
			cellsForCurrentTry[ce].draw();
		}
	
	}
	
	*/
	
	
}

function drawCells(){
	for( var i =0; i < cells.length; i++){
		cells[i].draw();
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
		
	var x = 0;
	var y = 0;
	 
	 // random walk without crossing
	for(var i = 0; i < 5000; i++){
		var direction = Math.floor((Math.random()*4));
		directionFrequency[direction]++;
		
			//always start the same way
		if(i < 4){
			if(i == 3){
				grid[2][i].isPath = true;
				grid[1][i].isPath = true;
				x = i;
				y = 2;
			}
			grid[0][i].isPath = true;
		}else{
		
			var lowerFrequency = getLowerFrequency();
		    if (direction == lowerFrequency) {
		        direction = getAlternateDirection();
		    }
		
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
							if(collideDirection(y + 1,x) == 1 && collideDirection(y + 2,x) == 0){
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



function cell(x, y, width, height, borderColor, color, isPath){
	var self = {
		x : x,
		y : y,
		width : width,
		height : height,
		borderColor : borderColor,
		color : color,
		isPath : isPath,
		isNotCurrentGeneration : false,

		
		
		draw : function(){
			if(self.isPath){	
				c.beginPath();
					c.lineWidth="1";
					c.strokeStyle = self.isNotCurrentGeneration ? "#B8B8B8" : "black"
					c.rect(self.x,self.y,self.width,self.height);
				c.stroke(); 
			
				if(self.isNotCurrentGeneration){
					c.fillStyle = "black";
					c.fillRect(self.x,self.y,self.width,self.height);
					c.fillStyle = "rgba(255, 255, 0, 0.50)"; //yellow
					c.fillRect(self.x,self.y,self.width,self.height);
				}else{
					c.fillStyle = "yellow"; //yellow
					c.fillRect(self.x,self.y,self.width,self.height);
				}			
			}else{
				//Draw the normal cell
				c.beginPath();
					c.lineWidth="1";
					c.strokeStyle = self.borderColor;
					c.rect(self.x,self.y,self.width,self.height);
				c.stroke(); 
				
				c.fillStyle = self.color;
				c.fillRect(self.x,self.y,self.width,self.height);
			}
			
		}

	}
	
	return self;
}

function contains(array, obj){
		 for (var i = 0; i < array.length; i++) {
        if (array[i] == obj  ) {
            return true;
        }
    }
    return false;

}




function getHigherFrequency() {
    var higherFrequency = -1;
    var higerFrequencyValue = -1;
    for (var i = 0; i < 4; i++) {
        if (directionFrequency[i] > higerFrequencyValue) {
            higherFrequency = i;
            higerFrequencyValue = directionFrequency[i];
        }
    }
    return higherFrequency;
};

function getLowerFrequency() {
    var lowerFrequency = 4;
    var lowerFrequencyValue = 1000000;
    for (var i = 0; i < 4; i++) {
        if (directionFrequency[i] < lowerFrequencyValue) {
            lowerFrequency = i;
            lowerFrequencyValue = directionFrequency[i];
        }
    }
    return lowerFrequency;
};

function getAlternateDirection(actualDirection) {
    switch (actualDirection) {
        case 0:
            return 1;
        case 1:
            return 2;
        case 2:
            return 3;
        case 3:
            return 0;
    }
};


	


