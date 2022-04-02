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
      gridBox.appendChild(rowElement);

      for (let cellId = 1; cellId <= thisFinder.rowsNumber; cellId++){
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
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
    // console.log(thisFinder.activeButton);
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

    /* add event listener for all cells that invokes cellSelect() */
  }

  cellSelect() {
    // const thisFinder = this;

    /* changes cell class to selected, reduces the next selection to neighbours */

  }
}


export default Finder;