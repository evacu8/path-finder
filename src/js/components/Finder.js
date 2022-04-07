/* eslint-disable no-prototype-builtins */
import { select, settings, templates } from '../settings.js';

class Finder {
  constructor() {
    const thisFinder = this;
    thisFinder.rowsNumber = settings.finderGrid.rows,
    thisFinder.columnsNumber = settings.finderGrid.columns,
    thisFinder.gridWrapper = document.querySelector(select.containerOf.grid),
    thisFinder.headers = document.querySelectorAll(select.DOMelement.gridHeader),
    thisFinder.buttons = document.querySelectorAll(select.DOMelement.button);

    thisFinder.step = 1;
    thisFinder.selectedCells = {};
    thisFinder.allowedMoves = {};


    thisFinder.render();
    thisFinder.drawGrid();
    thisFinder.activeStep(thisFinder.step);
    thisFinder.initActions();
  }

  render() {
    const thisFinder = this;

    const generatedHTML = templates.finderGrid;
  
    thisFinder.gridWrapper.innerHTML = generatedHTML();
  }

  drawGrid() {
    const thisFinder = this;

    const gridBox = document.querySelector(select.DOMelement.gridBox);

    let html = '';

    for (let rowId = 1; rowId <= thisFinder.rowsNumber; rowId++){
      html+= `<div class="row" rowId="${rowId}">`;
      for (let cellId = 1; cellId <= thisFinder.columnsNumber; cellId++){
        html+= `<div class="cell" cellId="${rowId}-${cellId}"></div>`;
      }
      html+= '</div>';
    }

    gridBox.innerHTML = html;
  }

  activeStep(stepId) {
    const thisFinder = this;

    thisFinder.step = stepId;
   
    for (let header of thisFinder.headers) {
      header.classList.remove('active');
    }

    for (let button of thisFinder.buttons) {
      button.classList.remove('active');
    }

    const activeHeader = document.querySelector(`[class="finder-header"] [id="step-${stepId}"]`);
    activeHeader.classList.add('active');

    thisFinder.activeButton = document.querySelector(`[class="button-wrapper"] [id="step-${stepId}b"]`);
    thisFinder.activeButton.classList.add('active');
  }

  initActions() {
    const thisFinder = this;
    
    document.querySelector(`[class="button-wrapper"] [id="step-1b"]`).addEventListener('click', function(e){
      e.preventDefault();
      thisFinder.step = 2;
      thisFinder.activeStep(thisFinder.step);
    });

    document.querySelector(`[class="button-wrapper"] [id="step-2b"]`).addEventListener('click', function(e){
      e.preventDefault();
      thisFinder.step = 3;
      thisFinder.activeStep(thisFinder.step);
    });

    document.querySelector(`[class="button-wrapper"] [id="step-3b"]`).addEventListener('click', function(e){
      e.preventDefault();
      thisFinder.step = 1;
      thisFinder.activeStep(thisFinder.step);
    });

    document.querySelector(select.DOMelement.gridBox).addEventListener('click', function(e){
      const target = e.target;
      const cellId = target.getAttribute('cellId');
      thisFinder.cellCheck(cellId, target);
    });
  }

  cellCheck(cellId, target) {
    const thisFinder = this;

    if (Object.keys(thisFinder.selectedCells).length === 0){
      thisFinder.cellSelect(cellId, target);

    } else if (!thisFinder.selectedCells.hasOwnProperty(cellId)){
      if (thisFinder.allowedMoves[cellId]){
        thisFinder.cellSelect(cellId, target);
      } else { 
        alert('Please select adjacent cell');
      }

    } else if (thisFinder.selectedCells.hasOwnProperty(cellId)){ 
      if (!thisFinder.continuityCheck(cellId)){
        alert('I can not unselect a cell in the middle of the path');
      } else {
        thisFinder.cellUnselect(cellId, target);
      }
    } 
  }

  cellSelect(cellId, target){
    const thisFinder = this;
 
    thisFinder.selectedCells[cellId] = {
      selected: 'yes',
      element: target,
      neighbours: {},
      selectedNeighbours: {},
    };

    target.classList.add('selected');

    thisFinder.findNeighbours();
    thisFinder.selectedNeighbours();
    thisFinder.nextMoves();
    thisFinder.renderPermitted();

  }

  cellUnselect(cellId, target){
    const thisFinder = this;

    target.classList.remove('selected');

    delete thisFinder.selectedCells[cellId];
  
    thisFinder.findNeighbours();
    thisFinder.selectedNeighbours();
    thisFinder.nextMoves();
    thisFinder.renderPermitted();

  }

  findNeighbours(){ 
    const thisFinder = this;
    
    thisFinder.allowedMoves = {};

    for (let cellId in thisFinder.selectedCells){
      
      const selectedRow = cellId.split('-')[0];
      const selectedCol= cellId.split('-')[1];

      const cells = document.querySelectorAll(select.DOMelement.cell);
      
      for (let cell of cells){
        const rowNumber = cell.getAttribute('cellid').split('-')[0];
        const colNumber = cell.getAttribute('cellid').split('-')[1];
        const comparedCell = rowNumber + '-' + colNumber;
        
        if((colNumber == selectedCol && selectedRow == rowNumber -1) ||
        (colNumber == selectedCol && rowNumber == selectedRow - 1) ||
        (rowNumber == selectedRow && selectedCol == colNumber - 1) ||
        (rowNumber == selectedRow && colNumber == selectedCol - 1)
        ){
          thisFinder.selectedCells[cellId].neighbours[comparedCell] = {
            element: cell,
          };
          thisFinder.allowedMoves[comparedCell] = {
            element: cell,
          };
        }
      }
    }
  }

  selectedNeighbours(){
    const thisFinder = this;

    for (let cellId in thisFinder.selectedCells){
      const neighbours = thisFinder.selectedCells[cellId].neighbours;
      
      thisFinder.selectedCells[cellId].selectedNeighbours = {};

      for (let neighbour in neighbours){
        if (thisFinder.selectedCells.hasOwnProperty(neighbour)){
          thisFinder.selectedCells[cellId].selectedNeighbours[neighbour] = {
            element: neighbours[neighbour].element,
          };
        }
      }
    }
  }

  nextMoves(){
    const thisFinder = this;

    for (let cellId in thisFinder.selectedCells){
      delete thisFinder.allowedMoves[cellId];
    }    
  }

  renderPermitted(){
    const thisFinder = this;

    const allCells = document.querySelectorAll('.cell');
    for (let cell of allCells){
      cell.classList.remove('permitted');
    }

    for (let allowedMove in thisFinder.allowedMoves){
      this.allowedMoves[allowedMove].element.classList.add('permitted');
    }
  }

  continuityCheck(cellId){ 
    const thisFinder = this;

    const selectedNeighbours = thisFinder.selectedCells[cellId].selectedNeighbours;
    // console.log('selectedNeighbours', selectedNeighbours);
    const sltdNeighboursArray = Object.keys(selectedNeighbours);
    // console.log('sltdNeighboursArray', sltdNeighboursArray);

    thisFinder.queue = [];
    thisFinder.visited = [];
    thisFinder.visited.push(cellId);

    
    const checker = (array1, array2) => array2.every(v => array1.includes(v));

    thisFinder.queue.push(sltdNeighboursArray[0]);
    
    while (thisFinder.queue.length !== 0){
      let cell = thisFinder.queue[0];
      // console.log('current cell', cell);
      thisFinder.visited.push(cell);
      // console.log('queue', thisFinder.queue);

      thisFinder.queue.shift();
      // console.log('queue behind current cell after shift', thisFinder.queue);
 
      if(checker(thisFinder.visited, sltdNeighboursArray)){
        // console.log('checker result', checker(thisFinder.visited, sltdNeighboursArray));
        // console.log('found all neigbours of cellId in visited');
        // console.log('queue2', thisFinder.queue);
        // console.log('visited', thisFinder.visited);

        return true;
      } else {
        const nextLevelNeighbours = Object.keys(thisFinder.selectedCells[cell].selectedNeighbours);
        // console.log('next level neighbours', nextLevelNeighbours);
        const filteredNeighbours = nextLevelNeighbours.filter(e => !thisFinder.visited.includes(e));
        // console.log('filtered next level neighbours', filteredNeighbours);
        for (let a of filteredNeighbours){
          thisFinder.queue.push(a);
        }
      }
    }
  }
}


export default Finder;