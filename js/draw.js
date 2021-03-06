'use strict'

var drawArea = document.querySelector('.draw__area');
var drawCell = document.querySelector('.draw__cell');
var drawCells = document.querySelectorAll('.draw__cell');

var timeSeconds = document.querySelector('.time__seconds');
var timeMinutes = document.querySelector('.time__minutes');

var btnTurn = document.querySelector('.draw__btn--tern');
var btnResult = document.querySelector('.draw__btn--result');

var canvas = document.querySelector('.draw__result');

var filledPixel = 0;
var drawAreaTurn = 90;
var startInterval = null;

function parseDomNodeForSVG(element) {
  var nodeWrap = document.createElement('div');

  element.setAttribute('xmlns' , 'http://www.w3.org/1999/xhtml');
  nodeWrap.appendChild(element);
  return nodeWrap.innerHTML;
}

function drawAreaCloneForCanvas() {
  var drawAreaClone  =  drawArea.cloneNode(true);

  drawAreaClone.style.width = '100%';
  drawAreaClone.style.height = '100%';
  Array.prototype.forEach.call(drawAreaClone.querySelectorAll('.draw__cell'), (element) => {
    if (element.classList.contains('draw__cell--filled')) {
      element.style.backgroundColor = '#000000';
    }
  });
  return drawAreaClone;
}

function stopwatchStart() {
  var second = 0;
  var minute = 0;

  var timedatas = [];

  startInterval = setInterval(() => {
    second++
    if (second === 60) {
      second = 0;
      minute += 1;
    }
    second < 10 ?  timeSeconds.innerHTML = '0' + second : timeSeconds.innerHTML = second ;
    minute < 10 ? timeMinutes.innerHTML = '0' + minute : timeMinutes.innerHTML = minute;
    
  }, 1000);

}

function onDrawCellClick() {
  this.classList.toggle('draw__cell--filled');
  drawArea = document.querySelector('.draw__area');
  if(this.classList.contains('draw__cell--filled')) {
    filledPixel++;
  } else {
    filledPixel--;
  }
}

function onDrawAreaClick() {
  stopwatchStart();
  drawArea.removeEventListener('click', onDrawAreaClick);
}

function rotateDrawArea() {
  drawArea.style.transform = 'rotate(' + drawAreaTurn + 'deg)';
  drawArea = document.querySelector('.draw__area');
  drawAreaTurn += 90;
}

function showCanvas() {
  canvas.classList.add('animated', 'zoomIn');
}

Array.prototype.forEach.call(drawCells, (element) => {
  element.style.flex = '0 0 25%';
  element.style.borderWidth = '1px';
  element.style.borderColor = 'rgba(255, 255, 255, .7)';
  element.style.borderStyle = 'solid';
  element.style.boxSizing = 'border-box';
  element.addEventListener('click',  onDrawCellClick);
})

drawArea.addEventListener('click', onDrawAreaClick);

btnTurn.addEventListener('click', () => {
  rotateDrawArea();
});

btnResult.addEventListener('click', () => {
  clearInterval(startInterval);
  fillCanvas();
  showCanvas();
});

function createSVG(svgWidth, svgHeight) {
  var dataDraw = '<svg xmlns="http://www.w3.org/2000/svg" ' + 'width="' +svgWidth + '" ' + 'height="' + svgHeight + '" ' + '>'+
                  '<foreignObject width="100%" height="100%">' +
                  parseDomNodeForSVG(drawAreaCloneForCanvas()) +
                  '</foreignObject>' +
                  '</svg>';
  var DOMURL = window.URL || window.webkitURL || window;
  var img = new Image();
  var svg = new Blob([dataDraw], {type: 'image/svg+xml'});
  var url = DOMURL.createObjectURL(svg);

  img.onload = function() {
    DOMURL.revokeObjectURL(url);
  }
  img.src = url;
  return img; 
}

function fillCanvas() {
  var svg = createSVG(101, 101);
  svg.onload = function() {
     ctx.drawImage(svg, (canvas.width / 2 - svg.width / 2), 29);
  }
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e8e8e8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000000';
  ctx.fillText('Пикселей: ' + filledPixel, canvas.width / 2, 186) ;
  ctx.fillText('Время: ' + timeMinutes.innerHTML + ':' + timeSeconds.innerHTML, canvas.width / 2, 226 );
}



