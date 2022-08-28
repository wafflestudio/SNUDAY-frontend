let ongoingTouches = [];
function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    let id = ongoingTouches[i].identifier;
    if (id === idToFind) return i;
  }
  return -1; // not found
}
window.ontouchstart = (e) => {
  if (
    window.navigator.standalone ||
    window.matchMedia('(display-mode: standalone)').matches
  )
    return; //iOS||Android standalone
  for (let touch of e.changedTouches) ongoingTouches.push(touch);
};
window.ontouchmove = (e) => {
  if (
    window.navigator.standalone ||
    window.matchMedia('(display-mode: standalone)').matches
  )
    return;

  const NavBar = document.getElementById('navigation-bar');
  const AddButton = document.getElementById('add-button');
  for (let touch of e.changedTouches) {
    let id = ongoingTouchIndexById(touch.identifier);
    if (id >= 0)
      if (touch.clientY < ongoingTouches[id].clientY - 12) {
        //scrollDown
        // if (NavBar) NavBar.style.bottom = '-' + NavBar.offsetHeight + 'px';
        if (NavBar) NavBar.classList.add(['hide']);
        if (NavBar && AddButton) AddButton.style.bottom = '0';
        ongoingTouches.splice(id, 1, touch);
      } else if (touch.clientY > ongoingTouches[id].clientY + 12) {
        //scrollUp
        // if (NavBar) NavBar.style.bottom = '0';
        if (NavBar) NavBar.classList.remove(['hide']);
        if (NavBar && AddButton)
          AddButton.style.bottom = NavBar.offsetHeight + 'px';
        ongoingTouches.splice(id, 1, touch);
      }
  }
};
window.ontouchend = (e) => {
  if (
    window.navigator.standalone ||
    window.matchMedia('(display-mode: standalone)').matches
  )
    return;

  const NavBar = document.getElementById('navigation-bar');
  const AddButton = document.getElementById('add-button');
  for (let touch of e.changedTouches) {
    let id = ongoingTouchIndexById(touch.identifier);
    if (id >= 0) {
      if (touch.clientY < ongoingTouches[id].clientY - 5) {
        //scrollDown
        // if (NavBar) NavBar.style.bottom = '-' + NavBar.offsetHeight + 'px';
        if (NavBar) NavBar.classList.add(['hide']);
        if (NavBar && AddButton) AddButton.style.bottom = '0';
      } else if (touch.clientY > ongoingTouches[id].clientY + 5) {
        //scrollUp
        // if (NavBar) NavBar.style.bottom = '0';
        if (NavBar) NavBar.classList.remove(['hide']);
        if (NavBar && AddButton)
          AddButton.style.bottom = NavBar.offsetHeight + 'px';
      }
      ongoingTouches.splice(id, 1);
    }
  }
};
