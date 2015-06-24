NodeList.prototype.forEach = Array.prototype.forEach;

var Slideshow = function(client_id) {
  this.client_id = client_id;
  this.api_root = "https://api.imgur.com/3";

  this.fetch = function(id, callback) {
    $.ajax({
      url: this.api_root + "/album/" + id,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Client-ID " + this.client_id
      },
      method: "GET",
      success: function(resp) { callback(null, resp.data); },
      error: function(resp) { callback(resp); }
    });
  };
};

var SlideshowView = function($el, album) {
  this.$el = $el;
  this.album = album;
  this.interval = parseInt($el.getAttribute("data-scroll-interval")) || 5000;
  this.index = 0;

  this.render = function() {
    this.$el.innerHTML = "";
    this.$el.classList.add("imgur-slideshow");
    this.$el.addEventListener("click", this.goto_slide);

    var $left = document.createElement("button"),
        $right = document.createElement("button");

    $left.classList.add(
        "imgur-slideshow__scroll-button",
        "imgur-slideshow__scroll-button--left"
      );
    $right.classList.add(
        "imgur-slideshow__scroll-button",
        "imgur-slideshow__scroll-button--right"
      );

    $left.addEventListener("click", function(ev) {
      ev.stopPropagation();
      this.decrement_index();
      this.change();
    }.bind(this));
    $right.addEventListener("click", function(ev) {
      ev.stopPropagation();
      this.increment_index();
      this.change();
    }.bind(this));

    this.$el.appendChild($left);
    this.$el.appendChild($right);
  };

  this.change = function() {
    var image = this.album.images[this.index];
    $el.style.backgroundImage = "url('" + image.link + "')";
    image.description
        ? $el.classList.add("imgur-slideshow--clickable")
        : $el.classList.remove("imgur-slideshow--clickable");
  };

  this.increment_index = function() {
    this.index += 1;
    if (this.index >= this.album.images.length) {
      this.index = 0;
    }
  };

  this.decrement_index = function() {
    this.index -= 1;
    if (this.index < 0) {
      this.index = this.album.images.length - 1;
    }
  };

  this.goto_slide = function(ev) {
    ev.preventDefault();

    var image = this.album.images[this.index];
    if (!image.description) return;

    window.location = image.description;
  }.bind(this);

  setInterval(function() {
      this.increment_index();
      this.change();
    }.bind(this), this.interval);
  this.change();
};

var client_id = document.currentScript.getAttribute("data-client-id");

document.addEventListener("DOMContentLoaded", function(ev) {
  var slideshow = new Slideshow(client_id);
  $els = document.querySelectorAll("*[data-imgur-album-id]");
  $els.forEach(function($el) {
    slideshow.fetch($el.getAttribute("data-imgur-album-id"), function(err, resp) {
        if (err) return console.error(err);

        var slideshow_view = new SlideshowView($el, resp);
        slideshow_view.render();
    });
  });
});
