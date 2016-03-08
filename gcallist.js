NodeList.prototype.forEach = Array.prototype.forEach;

var GEvent = function(when, where, uri, title, summary) {
  this.when = when;
  this.where = where;
  this.uri = uri;
  this.title = title;
  this.summary = summary;
};

var GEventCollection = function() {

  this.get_cal_url = function(cal_id, cal_key) {
    return "https://www.googleapis.com/calendar/v3/calendars/"
    + cal_id
    + "/events?key="
    + cal_key
    + "&orderBy=startTime&maxResults=25&singleEvents=true&timeMin="
    + new Date().toISOString();
  };

  this.parse_when = function(entry) {
    var start = (entry.start && entry.start.dateTime) || null,
        end = (entry.end && entry.end.dateTime) || null;

    if (start) {
      start = new Date(start);
      if (end) {
        end = new Date(end);
        return {
          date: start.toDateString().split(" ").slice(1, 3).join(" "),
          time: start.toLocaleTimeString() + " - " + end.toLocaleTimeString()
        }
      }
      else {
        return {
          date: start.toDateString(),
          time: start.toLocaleTimeString()
        }
      }
    }

    return {};
  };

  this.parse_location = function(entry) {
    if (!entry.location) return {};
    return {
      link: "https://www.google.com/maps/place/" + entry.location.replace(" ", "+"),
      name: entry.location.split(",")[0]
    };
  };

  this.fetch = function(cal_id, cal_key, callback) {
    $.getJSON(this.get_cal_url(cal_id, cal_key), function(resp) {
      var events = resp.items;
      if (!events) return callback(null, []);

      events = events
        .filter(function(entry) {
          return entry.start && (entry.start.dateTime || entry.start.date);
        })
        .sort(function(a, b) {
          return new Date(a.start.dateTime || a.start.date).getTime() -
                 new Date(b.start.dateTime || b.start.date).getTime();
        })
        .map(function(entry) {
          return new GEvent(
              this.parse_when(entry),
              this.parse_location(entry),
              entry.htmlLink,
              entry.summary,
              entry.description
            );
        }.bind(this))
        .filter(function(event) {
          return event.when.date && event.where.name;
        })
        .slice(0, 5);

      return callback(null, events);
    }.bind(this));
  };
};

var GEventListView = function($el, event_list) {
  this.$el = $el;
  this.event_list = event_list;

  this.render = function() {
    $el.innerHTML = "";
    $list = document.createElement("ul");
    event_list.forEach(function(event) {
      $li = document.createElement("li");
      $li.innerHTML = '<span class="gcalevent__date">' + event.when.date + '</span>: '
          + '<span class="gcalevent__time">' + event.when.time + '</span> <br />'
          + '<a href="' + event.uri + '" class="gcalevent__title">' + event.title + '</a> @ '
          + '<a href="' + event.where.link + '" class="gcalevent__where">' + event.where.name + '</a>';
      $list.appendChild($li);
    });
    $el.appendChild($list);
  };
};

document.addEventListener("DOMContentLoaded", function(ev) {
  $els = document.querySelectorAll("*[data-calendar-id]");
  $els.forEach(function($el) {
    var events = new GEventCollection(),
        cal_id = $el.getAttribute("data-calendar-id"),
        cal_key = $el.getAttribute("data-calendar-key");

    events.fetch(cal_id, cal_key, function(err, resp) {
      if (err) return console.error(err);
      var list_view = new GEventListView($el, resp);
      list_view.render();
    });
  });
});
