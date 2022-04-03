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

    for (let rowId = 1; rowId <= thisFinder.rowsNumber; rowId++){
      const rowElement = document.createElement('div');
      rowElement.classList.add('row');
      rowElement.setAttribute('rowId', rowId);
      gridBox.appendChild(rowElement);

      for (let cellId = 1; cellId <= thisFinder.rowsNumber; cellId++){
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.setAttribute('cellId', `${rowId}-${cellId}`);
        rowElement.appendChild(cellElement);
      }
    }
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

    if (Object.keys(thisFinder.selectedCells).length === 0){  // first selection - OK
      thisFinder.cellSelect(cellId, target);
      thisFinder.nextMoves();

    } else if (!thisFinder.selectedCells.hasOwnProperty(cellId)){ // next selections different than first - OK
      if (thisFinder.allowedMoves[cellId]){ //and being permitted - OK
        thisFinder.cellSelect(cellId, target);
      } else { 
        alert('Please select adjacent cell');
      }

    } else if (thisFinder.selectedCells.hasOwnProperty(cellId)){ // unselect a cell - OK
      if (thisFinder.continuityCheck(cellId)){ // check if this cell has exactly two adjacent selected cells
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
      // notSelectedNeighbours: {}, 
    };

    target.classList.add('selected');

    thisFinder.findNeighbours(); // look in the grid for neighbours
    console.log('neighbours', thisFinder.selectedCells[cellId].neighbours);
    thisFinder.selectedNeighbours(); // check if there are any selected neighbours
    console.log('selected neighbours', thisFinder.selectedCells[cellId].selectedNeighbours);
    thisFinder.nextMoves(); // check permitted moves
    console.log('allowedMoves', thisFinder.allowedMoves);

    // thisFinder.renderPermitted();

  }

  cellUnselect(cellId, target){
    const thisFinder = this;

    target.classList.remove('selected');

    delete thisFinder.selectedCells[cellId];
  
    thisFinder.findNeighbours(); // look in the grid for neighbours
    // console.log('neighbours', thisFinder.selectedCells[cellId].neighbours);
    thisFinder.selectedNeighbours(); // check if there are any selected neighbours
    // console.log('selected neighbours', thisFinder.selectedCells[cellId].selectedNeighbours);
    thisFinder.nextMoves(); // check permitted moves
    console.log('allowedMoves', thisFinder.allowedMoves);

    // thisFinder.renderPermitted();

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
        
        if((colNumber == selectedCol && selectedRow == rowNumber -1) || // check if cell is adjacent to cellId
        (colNumber == selectedCol && rowNumber == selectedRow - 1) ||
        (rowNumber == selectedRow && selectedCol == colNumber - 1) ||
        (rowNumber == selectedRow && colNumber == selectedCol - 1)
        ){
          thisFinder.selectedCells[cellId].neighbours[comparedCell] = { // add it to it's neighbours
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
      
      for (let neighbour in neighbours){
        if (thisFinder.selectedCells.hasOwnProperty(neighbour)){ // check if cell is selected
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


  continuityCheck(cellId){
    const thisFinder = this;
    
    return Object.keys(thisFinder.selectedCells[cellId].selectedNeighbours.length === 2);
  }
}


export default Finder;