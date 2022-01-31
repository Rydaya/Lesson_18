
const N = 20;
const snakeClassName = 'black';
const cherryClassName = 'green';
const superCherryClassName = 'red';

let field = [];

let $score = document.createElement('div'); //создала div для записи счета
$score.classList.add('score');
document.body.appendChild($score);

let $message = document.createElement('div'); //создала div для game over
$message.classList.add('message');
document.body.appendChild($message);

for (let i = 0; i < N; i++) {
 let $row = document.createElement('div');
 $row.classList.add('row');
 let row = [];
 for (let j = 0; j < N; j++) {
 let $cel = document.createElement('div');
 $cel.classList.add('col');
 $row.appendChild($cel);
 row.push($cel);
 }
 field.push(row);
 document.body.appendChild($row);
}

class Point {
 constructor(x, y) {
 this._x = x;
 this._y = y;
 }

 get x() {
 return this._x;
 }

 get y() {
 return this._y;
 }

 isEqual(another){
 return this._x === another._x && this._y === another.y;
 }

 changeX(x){
 return new Point(x, this._y);
 }

 changeY(y){
 return new Point(this._x, y);
 }
}

let direction = {
	x: 1,
	y: 0
};

let body = [
	new Point(0,0),
];

let cherry = new Point(5,5);

function drawPoint(field, point, className) {
	field[point.y][point.x].classList.add(className);
}

function clearField(...classNames){
	for(let className of classNames){
 		let elements = document.querySelectorAll('.' + className);
 		for(let element of elements){
 			element.classList.remove(className);
 		}
 	}
}

function makePointGenerator(x,y){
	return function () {
		return new Point(
			Math.round(Math.random() * x),
 			Math.round(Math.random() * y),
 		); 
 	}
}

function drawSnake(field, body){
	for (let point of body){
 		drawPoint(field, point, snakeClassName);
 	}
}

let pointGenerator = makePointGenerator(N - 1, N -1);

drawPoint(field, cherry, cherryClassName);

function cherryGenerator(){ //счетчик для изменения вишенки 
	let cherryCounter = 0;
	return function(){
		return ++cherryCounter;
	}
}
let checkCherry = cherryGenerator();
let drawDoublePoint = false; //проверка нужно ли добавлять еще точку для змейки

let interval = setInterval(function () {
	clearField(snakeClassName); 
 	let head = body[0];
 	let newHead = new Point(
 		head.x + direction.x,
 		head.y + direction.y
 	);

 	if (newHead.x > N - 1) {
 		newHead = newHead.changeX(0);
 	}
 	if (newHead.x < 0) {
 		newHead = newHead.changeX(N - 1);
 	}
 	if (newHead.y > N - 1) {
 		newHead = newHead.changeY(0);
 	}
 	if (newHead.y < 0) {
 		newHead = newHead.changeY(N - 1);
 	}

 	for(let coordinate of body){ //находит совпадение координат тела змейки и останавлтвает interval
 		if(newHead.isEqual(coordinate)){
 			clearInterval(interval);
 			$message.innerHTML = 'Game over!';
 		}
 	}
 
 	body.unshift(newHead);

	if(newHead.isEqual(cherry)){
		
		if(drawDoublePoint == true){ //если проверка true, добавляем точку
			body.unshift(newHead);
		}
		drawDoublePoint = false;

 		clearField(cherryClassName);
 		clearField(superCherryClassName);

 		cherry = pointGenerator();
 		let checkNumberCherry = checkCherry();

 		if(checkNumberCherry % 4 == 0){   
 				drawPoint(field,cherry, superCherryClassName); //рисует крассную вишенку каждый третий раз
 				drawDoublePoint = true;
 		} else {
 				drawPoint(field,cherry, cherryClassName);
 		}
 		$score.innerHTML = `Score: ${body.length}`; //записываю счет
	}else{
		body.pop();
	}
	drawSnake(field,body);
}, 200);

document.addEventListener('keydown', function (e) {
 switch (e.code) {
 case 'ArrowUp':
 direction = {x: 0, y: -1};
 break;
 case 'ArrowDown':
 direction = {x: 0, y: 1};
 break;
 case 'ArrowLeft':
 direction = {x: -1, y: 0};
 break;
 case 'ArrowRight':
 direction = {x: 1, y: 0};
 break;
 }
});
