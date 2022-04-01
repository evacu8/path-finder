import { select, settings, templates } from '../settings.js';
// import utils from '../utils.js';

class Finder {
  constructor() {
    const thisFinder = this;
    thisFinder.rowsNumber = settings.finderGrid.rows,
    thisFinder.columnsNumber = settings.finderGrid.columns,
    thisFinder.gridWrapper = document.querySelector(select.containerOf.grid),
    thisFinder.headers = document.querySelectorAll(select.DOMelement.gridHeader),
    thisFinder.buttons = document.querySelectorAll(select.DOMelement.button);

    thisFinder.step = 1;
    
    thisFinder.drawGrid();
    thisFinder.render();
    thisFinder.activeStep(thisFinder.step);
    thisFinder.initActions();
  }

  render() {
    const thisFinder = this;

    const data = {
      rowsNumber: thisFinder.rowsNumber,
      columnsNumber: thisFinder.columnsNumber,
    };

    const generatedHTML = templates.finderGrid;
  
    thisFinder.gridWrapper.innerHTML = generatedHTML(data);
    console.log(generatedHTML(data));

  }

  drawGrid() {
    // const thisFinder = this;

    /* draw 'columnsNumber' cells for each of 'rowsNumber' rows */

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

    thisFinder.activeButton = document.querySelector(`[class="button-wrapper"] [id="step-${stepId}"]`);
    thisFinder.activeButton.classList.add('active');
  }

  initActions() {
    const thisFinder = this;
    
    document.querySelector(`[class="button-wrapper"] [id="step-1"]`).addEventListener('click', function(e){
      e.preventDefault();
      thisFinder.step = 2;
      thisFinder.activeStep(thisFinder.step);
    });

    document.querySelector(`[class="button-wrapper"] [id="step-2"]`).addEventListener('click', function(e){
      e.preventDefault();
      thisFinder.step = 3;
      thisFinder.activeStep(thisFinder.step);
    });

    document.querySelector(`[class="button-wrapper"] [id="step-3"]`).addEventListener('click', function(e){
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