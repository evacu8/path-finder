import { select, settings, templates } from '../settings.js';
// import utils from '../utils.js';

class Finder {
  constructor() {
    const thisFinder = this;
    thisFinder.rowsNumber = settings.finderGrid.rows,
    thisFinder.columnsNumber = settings.finderGrid.columns,
    thisFinder.gridWrapper = document.querySelector(select.containerOf.grid),
    thisFinder.headers = document.querySelectorAll(select.DOMelement.gridHeader),

    thisFinder.drawGrid();
    thisFinder.render();
    thisFinder.activeHeader();
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

  activeHeader() {
    const thisFinder = this;

    /* add class active to header assigned to step */
    console.log(thisFinder.headers);
  }

  initActions() {
    // const thisFinder = this;

  }
}


export default Finder;