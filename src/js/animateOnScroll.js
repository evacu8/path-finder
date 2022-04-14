const scrollOffset = 100;
 
const scrollElements = document.querySelectorAll('.js-scroll');

for(let scrollElement of scrollElements){
  const elementInView = (el, offset = 0) => {
    const elementTop = el.getBoundingClientRect().top;
   
    return (
      elementTop <= 
      ((window.innerHeight || document.documentElement.clientHeight) - offset)
    );
  };
   
  const displayScrollElement = () => {
    scrollElement.classList.add('scrolled');
  };
   
  const hideScrollElement = () => {
    scrollElement.classList.remove('scrolled');
  };
   
  const handleScrollAnimation = () => {
    if (elementInView(scrollElement, scrollOffset)) {
      displayScrollElement();
    } else {
      hideScrollElement();
    }
  };
   
  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });
}