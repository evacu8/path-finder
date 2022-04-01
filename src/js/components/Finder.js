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

    thisFinder.drawGrid();
    thisFinder.render();
    thisFinder.activeStep();
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

    thisFinder.step = 1;

  }

  drawGrid() {
    // const thisFinder = this;

    /* draw 'columnsNumber' cells for each of 'rowsNumber' rows */

  }

  activeStep() {
    const thisFinder = this;

    const stepId = `step-${thisFinder.step}`;
   
    for (let header of thisFinder.headers) {
      header.classList.remove('active');
    }

    for (let button of thisFinder.buttons) {
      button.classList.remove('active');
    }

    const activeHeader = document.querySelector(`[class="finder-header"] [id="${stepId}"]`);
    activeHeader.classList.add('active');

    const activeButton = document.querySelector(`[class="button-wrapper"] [id="${stepId}"]`);
    activeButton.classList.add('active');
  }

  initActions() {
    // const thisFinder = this;
    /* add event listeners for buttons that change thisFinder.stepId */

    /* add event listener for all cells that invokes cellSelect() */
  }

  cellSelect() {
    // const thisFinder = this;

    /* changes cell class to selected, reduces the next selection to neighbours */

  }
}


export default Finder;