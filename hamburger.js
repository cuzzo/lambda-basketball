(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function(ev) {
    var toggles = document.querySelectorAll(".hamburger"),
        toggle_active = function(ev) {
          ev.preventDefault();
          this.classList.toggle("hamburger--active");
          document.getElementById(this.dataset.toggleEl)
              .classList.toggle("hamburger--active");
        },
        i;

    for (i = toggles.length - 1; i >= 0; i--) {
      toggles[i].addEventListener("click", toggle_active);
    };
  });
})();
