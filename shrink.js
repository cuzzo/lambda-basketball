(function (ELEMENT) {
  ELEMENT.matches = ELEMENT.matches
      || ELEMENT.mozMatchesSelector
      || ELEMENT.msMatchesSelector
      || ELEMENT.oMatchesSelector
      || ELEMENT.webkitMatchesSelector;

  ELEMENT.closest = ELEMENT.closest || function closest(selector) {
    var element = this;
    while (element) {
      if (element.matches(selector)) break;
      element = element.parentElement;
    }
    return element;
  };
}(Element.prototype));

(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function(ev) {
    var mobile_rgx = /mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
        sections = document.querySelectorAll(".section--collapsible .section__header"),
        i;

    for (i = 0; i < sections.length; i++) {
      var section = sections[i].closest(".section--collapsible");
      sections[i].addEventListener("click", function(ev) {
          this.classList.toggle("section--collapsed");
        }.bind(section));

      if (!mobile_rgx.test(navigator.userAgent)) continue;
      section.classList.add("section--collapsed");
    }
  });
})();
