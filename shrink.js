(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function(ev) {
    var mobile_rgx = /mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
        sections = document.querySelectorAll(".section--separated .section--header"),
        i;

    for (i = 0; i < sections.length; i++) {
      sections[i].addEventListener("click", function(ev) {
          this.closest(".section--separated")
              .classList.toggle("section--collapsed");
        });

      if (!mobile_rgx.test(navigator.userAgent)) continue;
      sections[i].classList.add("section--collapsed");
    }
  });

})();
