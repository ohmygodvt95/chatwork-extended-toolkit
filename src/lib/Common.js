import $ from 'jquery';

const Common = {
  insertAtCursor: function(selector, str) {
    var cursorPos = $(selector).prop('selectionStart');
    var v = $(selector).val();
    var textBefore = v.substring(0, cursorPos);
    var textAfter = v.substring(cursorPos, v.length);

    $(selector).val(textBefore + str + textAfter).trigger('input').focus();
  },
  injectScript: function(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
  },
};

export default Common;
