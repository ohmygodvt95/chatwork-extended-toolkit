import { Bootstrap } from './content_scripts/Bootstrap';
import $ from 'jquery';
import Common from './lib/Common';
import lozad from 'lozad'
import './style.css'

window.Common = Common;

window.Common.injectScript(chrome.extension.getURL('/injectScript.js'), 'body');

// set up the mutation observer
var observer = new MutationObserver(function(mutations, me) {
  // `mutations` is an array of mutations that occurred
  // `me` is the MutationObserver instance
  if ($('currentselectedroom').length) {
    Bootstrap.boot();
    me.disconnect(); // stop observing
    return true;
  }
});

// start observing
observer.observe(document, {
  childList: true,
  subtree: true,
});

// lazyload image
window.observerImage = lozad(); // lazy loads elements with default selector as '.lozad'
