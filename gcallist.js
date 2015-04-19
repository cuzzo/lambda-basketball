NodeList.prototype.forEach = Array.prototype.forEach;

var GEvent = function(when, where, uri, title, summary) {
  this.when = when;
  this.where = where;
  this.uri = uri;
  this.title = title;
  this.summary = summary;
};

var GEventCollection = function() {
  this.get_cal_url = function(cal_id) {
    params = "?orderby=starttime&sortorder=ascending&futureevents=true&alt=json"
    return "https://www.google.com/calendar/feeds/"
        + cal_id
        + "%40group.calendar.google.com/public/basic"
        + params;
  };

  this.parse_when = function(when_str) {
    when_str = when_str.replace(/^When:/, "");
    parts = when_str.split(String.fromCharCode(10));
    if (parts.length === 1) {
      date_str = parts[0];
      tz_str = "";
    }
    else if (parts.length === 2) {
      date_str = parts[0];
      tz_str = parts[1];
    }

    var comma_index = date_str.indexOf(",");
    if (comma_index !== -1) {
      var dt_str = date_str.substring(0, comma_index + 6);
      var time_str = date_str.replace(dt_str, "");
    }
    else {
      var dt_str = "";
      var time_str = date_sftr;
    }
    return {
      date: dt_str,
      time: time_str,
      timezone: tz_str
    };
  };

  this.parse_where = function(where_str) {
    where_str = where_str.replace(/^Where:/, "")
    var display_name = where_str.replace(/, united states$/i, "");
    if (display_name.split(",").length >= 3) {
      display_name = display_name.substring(0, display_name.indexOf(","));
    }
    else {
      display_name.replace(/, [A-Z]{2} \d{5}$/, "");
      display_name.replace(/, [A-Z]{2} \d{5}-\d{4}$/, "");
    }

    return {
      name: display_name,
      link: "https://maps.google.com?q=" + where_str.replace(/ /g, "+")
    };
  };

  this.get_content = function(entry) {
    return entry.content.$t.split("<br />")
        .map(function(line) {
          return line
              .replace(/\s+/, "")
              .trim();
        })
        .filter(function(line) {
          return line.length > 0;
        });
  };

  this.fetch = function(cal_id, callback) {
    $.getJSON(this.get_cal_url(cal_id), function(resp) {
      var events = resp.feed.entry;
      if (!events) return callback(null, []);

      events = events.map(function(entry) {
        content = this.get_content(entry);
        return new GEvent(
            this.parse_when(content[0]),
            this.parse_where(content[1]),
            entry.link[0].href,
            entry.title.$t,
            content[3]
          );
      }.bind(this));

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
      $li.innerHTML = '<span class="gcalevent__date">' + event.when.date + '</span>:'
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
    var events = new GEventCollection();
    events.fetch($el.getAttribute("data-calendar-id"), function(err, resp) {
      if (err) return console.error(err);
      var list_view = new GEventListView($el, resp);
      list_view.render();
    });
  });
});
