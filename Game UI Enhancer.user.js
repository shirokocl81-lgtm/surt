// ==UserScript==
// @name         Surviv Game UI Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhance Surviv game UI with blur effects
// @author       You
// @match        *://survev.io/*
// @match        *://zurviv.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  function addStyle(cssStr) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssStr;
    document.head.appendChild(style);
  }

  // Add blur effect to start overlay
  addStyle(`
    #start-overlay {
      backdrop-filter: blur(10px) brightness(0.9);
    }

    /* Optional: Add more UI enhancements */
    .ui-button {
      transition: all 0.2s ease;
    }

    .ui-button:hover {
      transform: scale(1.05);
    }
  `);

  console.log('[Surviv UI Enhancer] Styles applied');
})();
