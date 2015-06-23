(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function(ev) {
    var mobile_rgx = /mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
        sections = document.querySelectorAll(".section--separated .section--header"),
        i;

    for (i = 0; i < sections.length; i++) {
      var section = sections[i].closest(".section--separated");
      sections[i].addEventListener("click", function(ev) {
          this.classList.toggle("section--collapsed");
        }.bind(section));

      if (!mobile_rgx.test(navigator.userAgent)) continue;
      section.classList.add("section--collapsed");
    }
  });

})();
