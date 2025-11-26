import { initModal, displayWorks, filters, login, editionMode, userConnected } from "/scripts/script.js";

switch (window.location.href) {
    case "http://127.0.0.1:5500/index.html":
        displayWorks();
        initModal();
        if (userConnected() === null) filters();
        else editionMode();
        break;
    case "http://127.0.0.1:5500/login.html":
        login();
        break;
    default:
        break;
}
