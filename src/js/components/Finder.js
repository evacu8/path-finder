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
    thisFinder.permittedNext = {};

    
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

    if (Object.keys(thisFinder.selectedCells).length === 0){
      thisFinder.cellSelect(cellId, target);

    } else if (!thisFinder.selectedCells.hasOwnProperty(cellId)){
      if (thisFinder.permittedNext[cellId]){
        thisFinder.cellSelect(cellId, target);
      } else { 
        alert('Please select adjacent cell');
      }

    } else if (thisFinder.selectedCells.hasOwnProperty(cellId)){
      thisFinder.cellDisselect(cellId, target);
    } 
  }

  permittedSelection(cellId) {
    const thisFinder = this;

    const selectedRow = cellId.split('-')[0];
    const selectedCol= cellId.split('-')[1];

    const cells = document.querySelectorAll(select.DOMelement.cell);

    for (let cell of cells){
      const rowNumber = cell.getAttribute('cellid').split('-')[0];
      const colNumber = cell.getAttribute('cellid').split('-')[1];
      const comparedCell = rowNumber + '-' + colNumber;

      if(!thisFinder.selectedCells.hasOwnProperty(comparedCell)){
        if((colNumber == selectedCol && selectedRow == rowNumber -1) ||
          (colNumber == selectedCol && rowNumber == selectedRow - 1) ||
          (rowNumber == selectedRow && selectedCol == colNumber - 1) ||
          (rowNumber == selectedRow && colNumber == selectedCol - 1)
        ){
          thisFinder.permittedNext[comparedCell] = {
            element: cell,
          };
        }
      } 
    }
  }

  cellSelect(cellId, target){
    const thisFinder = this;
 
    thisFinder.selectedCells[cellId] = {
      selected: 'yes',
      element: target,
    };

    target.classList.add('selected');
    thisFinder.permittedSelection(cellId);
  }

  cellDisselect(cellId, target){
    const thisFinder = this;

    target.classList.remove('selected');
    delete thisFinder.selectedCells[cellId];
 
  }
}


export default Finder;