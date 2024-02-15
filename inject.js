function injectScript(file) {
  const th = document.head || document.documentElement;
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", chrome.runtime.getURL(file));
  th.appendChild(script);
  script.onload = function () {
    this.remove();
  };
}

// Call injectScript with the path to injectScript.js
injectScript("injected.js");
