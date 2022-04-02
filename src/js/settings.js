export const select = {
  templateOf: {
    finderGrid: '#template-finder-grid',
  },

  containerOf: {
    pages: '#pages',
    about: '.about-wrapper',
    finder: '.finder-wrapper',
    grid: '.grid-wrapper',
    headers: '.finder-header',
    buttons: '.button-wrapper',
  },

  DOMelement: {
    gridHeader: '.grid-header',
    gridBox: '.grid-box',
    button: '.button',
    cell: '.cell',
  },


  all: {
    
  },
  
  nav: {
    links: '.main-nav a',
  },
};

export const classNames = {
  cell: {
    
  },
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  }
};

export const templates= {
  finderGrid: Handlebars.compile(document.querySelector(select.templateOf.finderGrid).innerHTML),
};

export const settings = {
  finderGrid: {
    rows: 10,
    columns: 10,
  },
};