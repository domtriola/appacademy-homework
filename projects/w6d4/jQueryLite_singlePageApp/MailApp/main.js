const Router = require('./router.js');
const Inbox = require('./inbox.js');
const Sent = require('./sent.js');

document.addEventListener("DOMContentLoaded", () => {
  initializeButtons();
  initializeRouter();
  location.hash = "#inbox";
});

function initializeButtons() {
  const sidebarItems = document.querySelectorAll(".sidebar-nav li");
  sidebarItems.forEach(item => {
    item.addEventListener("click", (e) => {
      let innerText = e.currentTarget.innerText.toLowerCase();
      window.location.hash = innerText;
    });
  });
}

function initializeRouter() {
  const content = document.querySelector('.content');
  const router = new Router(content, routes);
  router.start();
}

const routes = {
  inbox: Inbox,
  sent: Sent
};
