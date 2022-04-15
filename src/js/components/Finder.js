/* eslint-disable no-prototype-builtins */
import { select, settings, templates, classNames } from '../settings.js';

class Finder {
  constructor() {
    const thisFinder = this;
    thisFinder.rowsNumber = settings.finderGrid.rows,
    thisFinder.columnsNumber = settings.finderGrid.columns,
    thisFinder.gridWrapper = document.querySelector(select.containerOf.grid),
    thisFinder.modal = document.querySelector(select.containerOf.modal),
    thisFinder.headers = document.querySelectorAll(select.DOMelement.gridHeader),
    thisFinder.buttons = document.querySelectorAll(select.DOMelement.button);

    thisFinder.step = 1;
    thisFinder.selectedCells = {};
    thisFinder.allowedMoves = {};
    
    thisFinder.boundHandleClick = thisFinder.handleClick.bind(thisFinder);
    thisFinder.boundStartHandler = thisFinder.startHandler.bind(thisFinder);
    thisFinder.boundfinishHandler = thisFinder.finishHandler.bind(thisFinder);
    
    thisFinder.render();
    thisFinder.drawGrid();
    thisFinder.activeStep(thisFinder.step);
    thisFinder.renderModals();
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
    
    if(stepId == 2){
      thisFinder.initStepTwo();
    } else if(stepId == 3) {
      thisFinder.initStepThree();
    }
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

    document.querySelector(`[class="button-wrapper"] [id="step-3b"]`).addEventListener('click', function(){
      location.reload();
    });

    document.querySelector(select.DOMelement.gridBox).addEventListener('click', thisFinder.boundHandleClick);

    document.querySelector(select.containerOf.modal).addEventListener('click', () => { 
      let modalElem = document.querySelector('.activated');
      modalElem.classList.remove('activated');
      modalElem.classList.add('fade');
    }); 
  }

  handleClick(e){
    const thisFinder = this;

    const target = e.target;
    const cellId = target.getAttribute('cellId');
    thisFinder.cellCheck(cellId, target);
  }

  renderModals(){
    const thisFinder = this;

    thisFinder.data = {items: [
      {
        id: 1,
        title: 'Alert',
        description: 'Please select adjacent cell',
      },
      {
        id: 2,
        title: 'Alert',
        description: 'I can not unselect a cell in the middle of the path',
      },
      {
        id: 3,
        title: 'Alert',
        description: 'Select an element of the path',
      },
      {
        id: 4,
        title: 'Alert',
        description: 'Path can not start and finish at the same point',
      },
      {
        id: 5,
        title: 'Result',
        description: `The shortest path is ${thisFinder.minMoves} moves`,
      }
    ]};

    const generatedModalHTML = templates.modal;
  
    thisFinder.modal.innerHTML = generatedModalHTML(thisFinder.data);
  }

  showModal(id){
    const thisFinder = this;

    const activeModal = thisFinder.modal.querySelector(`div[class='modal fade'][id='${id}']`);
    activeModal.classList.remove('fade');
    activeModal.classList.add('activated');
  }

  cellCheck(cellId, target) {
    const thisFinder = this;

    if (Object.keys(thisFinder.selectedCells).length === 0){
      thisFinder.cellSelect(cellId, target);

    } else if (!thisFinder.selectedCells.hasOwnProperty(cellId)){
      if (thisFinder.allowedMoves[cellId]){
        thisFinder.cellSelect(cellId, target);
      } else { 
        thisFinder.showModal(1);
      }

    } else if (thisFinder.selectedCells.hasOwnProperty(cellId)){ 
      if (!thisFinder.continuityCheck(cellId)){
        thisFinder.showModal(2);
      } else {
        thisFinder.cellUnselect(cellId, target);
      }
    } 
  }

  cellSelect(cellId, target){
    const thisFinder = this;
 
    thisFinder.selectedCells[cellId] = {
      id: cellId,
      selected: 'yes',
      element: target,
      neighbours: {},
      selectedNeighbours: {},
      distance: 0,
      predecessor: null
    };

    target.classList.add(classNames.cell.selected);

    thisFinder.findNeighbours();
    thisFinder.selectedNeighbours();
    thisFinder.nextMoves();
    thisFinder.renderPermitted();

  }

  cellUnselect(cellId, target){
    const thisFinder = this;

    target.classList.remove(classNames.cell.selected);

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
      cell.classList.remove(classNames.cell.permitted);
    }

    for (let allowedMove in thisFinder.allowedMoves){
      this.allowedMoves[allowedMove].element.classList.add(classNames.cell.permitted);
    }
  }

  continuityCheck(cellId){ 
    const thisFinder = this;

    const selectedNeighbours = thisFinder.selectedCells[cellId].selectedNeighbours;
    const sltdNeighboursArray = Object.keys(selectedNeighbours);

    thisFinder.queue = [];
    thisFinder.visited = [];
    thisFinder.visited.push(cellId);
    
    const checker = (array1, array2) => array2.every(v => array1.includes(v));

    thisFinder.queue.push(sltdNeighboursArray[0]);
    
    while (thisFinder.queue.length !== 0){
      let cell = thisFinder.queue.shift();
      thisFinder.visited.push(cell);

      if(checker(thisFinder.visited, sltdNeighboursArray)){
        return true;

      } else {
        const nextLevelNeighbours = Object.keys(thisFinder.selectedCells[cell].selectedNeighbours);
        const filteredNeighbours = nextLevelNeighbours.filter(e => !thisFinder.visited.includes(e));

        for (let a of filteredNeighbours){
          thisFinder.queue.push(a);
        }
      }
    }
  }

  initStepTwo(){
    const thisFinder = this;

    thisFinder.removePermitted();
    thisFinder.disableListener();
    thisFinder.selectStart();

  }

  removePermitted(){
    const thisFinder = this;

    for(let cell in thisFinder.allowedMoves){
      thisFinder.allowedMoves[cell].element.classList.remove(classNames.cell.permitted);
    }
  }

  disableListener(){
    const thisFinder = this;

    document.querySelector(select.DOMelement.gridBox).removeEventListener('click', thisFinder.boundHandleClick);
  }

  selectStart(){
    const thisFinder = this;

    document.querySelector(select.DOMelement.gridBox).addEventListener('click', thisFinder.boundStartHandler);
  }

  findInSelected(className){
    const thisFinder = this;

    for (let cellId in thisFinder.selectedCells){
      const element = thisFinder.selectedCells[cellId].element;
      if(element.classList.contains(className)){
        thisFinder[className] = cellId;
      }
    }
  }

  startHandler(e){
    const thisFinder = this;

    const target = e.target;

    if(target.classList.contains(classNames.cell.selected)){
      target.classList.add(classNames.cell.start);

      thisFinder.findInSelected(classNames.cell.start);

      document.querySelector(select.DOMelement.gridBox).removeEventListener('click', thisFinder.boundStartHandler);
  
      thisFinder.selectFinish();
    } else {
      thisFinder.showModal(3);
    }
  }

  selectFinish(){
    const thisFinder = this;
    document.querySelector(select.DOMelement.gridBox).addEventListener('click', thisFinder.boundfinishHandler);
  }

  finishHandler(e){
    const thisFinder = this;

    const target = e.target;

    if(target.classList.contains('selected start')){
      thisFinder.showModal(4);
    } else if (!target.classList.contains(classNames.cell.selected)){
      thisFinder.showModal(3);
    } else {
      target.classList.add(classNames.cell.finish);
  
      thisFinder.findInSelected(classNames.cell.finish);

      thisFinder.disableFinishHandler();
    }
  }

  disableFinishHandler(){
    const thisFinder = this;
    document.querySelector(select.DOMelement.gridBox).removeEventListener('click', thisFinder.boundfinishHandler);
  }

  initStepThree(){
    const thisFinder = this;

    const start = thisFinder.start;
    const finish = thisFinder.finish;

    thisFinder.computeShortestPath(start, finish);
  }

  computeShortestPath(start, finish){
    const thisFinder = this;
    thisFinder.selectedCells[start].distance = 0;
    const selectedNeighbours = thisFinder.selectedCells[start].selectedNeighbours;
    const sltdNeighboursArray = Object.keys(selectedNeighbours);

    thisFinder.queue = [];
    thisFinder.visitedObj = {};
    thisFinder.visited = [];
    thisFinder.visited.push(start);

    sltdNeighboursArray.forEach(elem => thisFinder.queue.push(elem));
    sltdNeighboursArray.forEach(elem => thisFinder.selectedCells[elem].predecessor = start);
    
    while (thisFinder.queue.length !== 0){
      let cell = thisFinder.queue.shift();

      if(!thisFinder.visited.includes(cell)){
        thisFinder.visited.push(cell);
      }
      
      if(thisFinder.selectedCells[cell].id === thisFinder.selectedCells[finish].id){
        thisFinder.minMoves = thisFinder.selectedCells[finish].distance + 1;
        thisFinder.renderShortestPath();
      } else {
        const nextLevelNeighbours = Object.keys(thisFinder.selectedCells[cell].selectedNeighbours);
        const filteredNeighbours = nextLevelNeighbours.filter(e => !thisFinder.visited.includes(e));
        for (let a of filteredNeighbours){
          thisFinder.queue.push(a);
          thisFinder.selectedCells[a].predecessor = cell;
          thisFinder.selectedCells[a].distance = thisFinder.selectedCells[cell].distance +1;
        }

      }
    }

    thisFinder.visited.forEach(elem => thisFinder.visitedObj[elem] = thisFinder.selectedCells[elem]);
  }

  renderShortestPath(){
    const thisFinder = this;

    thisFinder.shortestPath = [thisFinder.finish];

    thisFinder.shortestPathQueue = [thisFinder.finish];

    while (thisFinder.shortestPathQueue.length !== 0){
      let cell = thisFinder.shortestPathQueue.shift();
      thisFinder.shortestPath.push(thisFinder.selectedCells[cell]);
      thisFinder.selectedCells[cell].element.classList.add(classNames.cell.shortest);

      if(thisFinder.selectedCells[cell].predecessor){
        thisFinder.shortestPathQueue.push(thisFinder.selectedCells[cell].predecessor);
      }
    }

    thisFinder.renderModals();
    thisFinder.showModal(5);

  }
}

export default Finder;