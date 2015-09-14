var IconFactory, death_icons, get_location, gotLocation, last_zoom, map, marker_opacity, markers, months, oReq, reqListener, start, toner_layer, url;

get_location = function() {
  if ("geolocation" in navigator) {
    return navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
      return gotLocation([position.coords.latitude, position.coords.longitude]);
    });
  } else {
    return alert("Geolocation not supported by your browser");
  }
};

gotLocation = function(pos) {
  var ll, meters, start_ll;
  ll = L.latLng(pos[0], pos[1]);
  start_ll = new L.LatLng(start[0], start[1]);
  meters = ll.distanceTo(start);
  if (meters < 30000) {
    map.setView(pos, 14);
  }
  return console.log(meters);
};

IconFactory = (function() {
  function IconFactory(types) {
    this.types = types;
  }

  IconFactory.prototype.make = function(type) {
    var an_icon, key, obj, options, seed;
    obj = this.types[type];
    options = new obj.constructor();
    seed = Math.random();
    for (key in obj) {
      if (typeof obj[key] === "function") {
        options[key] = obj[key](seed);
      } else {
        options[key] = obj[key];
      }
    }
    an_icon = L.icon(options);
    return an_icon;
  };

  return IconFactory;

})();

death_icons = new IconFactory({
  medium_skull: {
    iconSize: [80, 106],
    iconAnchor: [40, 106],
    iconUrl: 'img/medium/skull.png'
  },
  medium_glock_skull: {
    iconSize: [80, 106],
    iconAnchor: [40, 106],
    iconUrl: 'img/medium/skull.png',
    shadowSize: [108, 84],
    shadowAnchor: function(seed) {
      var n;
      n = Math.floor(seed * 6);
      if (n <= 2) {
        return [140, 100 * seed + 60];
      } else {
        return [-40, 100 * seed + 60];
      }
    },
    shadowUrl: function(seed) {
      var options;
      options = ["img/medium/glock.png", "img/medium/glock_rot1.png", "img/medium/glock_rot2.png", "img/medium/glock_reverse.png", "img/medium/glock_rot1_reverse.png", "img/medium/glock_rot2_reverse.png"];
      return options[Math.floor(seed * options.length)];
    }
  },
  small_skull: {
    iconSize: [80 / 2, 106 / 2],
    iconAnchor: [40 / 2, 106 / 2],
    iconUrl: 'img/medium/skull.png'
  },
  small_glock_skull: {
    iconSize: [80 / 2, 106 / 2],
    iconAnchor: [40 / 2, 106 / 2],
    iconUrl: 'img/medium/skull.png',
    shadowSize: [108 / 2, 84 / 2],
    shadowAnchor: function(seed) {
      var n;
      n = Math.floor(seed * 6);
      if (n <= 2) {
        return [140 / 2, 100 / 2 * seed + 60 / 2];
      } else {
        return [-40 / 2, 100 / 2 * seed + 60 / 2];
      }
    },
    shadowUrl: function(seed) {
      var options;
      options = ["img/small/glock.png", "img/small/glock_rot1.png", "img/small/glock_rot2.png", "img/small/glock_reverse.png", "img/medium/glock_rot1_reverse.png", "img/medium/glock_rot2_reverse.png"];
      return options[Math.floor(seed * options.length)];
    }
  },
  medium_skull_jitter: {
    iconSize: function(s) {
      return [80, 106];
    },
    iconAnchor: function(s) {
      return [Math.random() * 40 + 40, Math.random() * 40 + 106];
    },
    iconUrl: 'img/medium/skull.png'
  },
  medium_glock_skull_jitter: {
    iconSize: function(s) {
      return [80, 106];
    },
    iconAnchor: function(s) {
      return [Math.random() * 40 + 40, Math.random() * 40 + 106];
    },
    iconUrl: 'img/medium/skull.png',
    shadowSize: [108, 84],
    shadowAnchor: function(seed) {
      var n;
      n = Math.floor(seed * 6);
      if (n <= 2) {
        return [140, 100 * Math.random() + 60];
      } else {
        return [-10, 100 * Math.random() + 60];
      }
    },
    shadowUrl: function(seed) {
      var options;
      options = ["img/medium/glock.png", "img/medium/glock_rot1.png", "img/medium/glock_rot2.png", "img/medium/glock_reverse.png", "img/medium/glock_rot1_reverse.png", "img/medium/glock_rot2_reverse.png"];
      return options[Math.floor(seed * options.length)];
    }
  },
  small_skull_jitter: {
    iconSize: function(s) {
      return [80 / 2, 106 / 2];
    },
    iconAnchor: function(s) {
      return [Math.random() * 20 + 40 / 2, Math.random() * 20 + 106 / 2];
    },
    iconUrl: 'img/small/skull.png'
  },
  small_glock_skull_jitter: {
    iconSize: function(s) {
      return [80 / 2, 106 / 2];
    },
    iconAnchor: function(s) {
      return [Math.random() * 20 + 40 / 2, Math.random() * 20 + 106 / 2];
    },
    iconUrl: 'img/small/skull.png',
    shadowSize: [108 / 2, 84 / 2],
    shadowAnchor: function(seed) {
      var n;
      n = Math.floor(seed * 6);
      if (n <= 2) {
        return [140 / 2, 100 / 2 * Math.random() + 60 / 2];
      } else {
        return [-10, 100 / 2 * Math.random() + 60 / 2];
      }
    },
    shadowUrl: function(seed) {
      var options;
      options = ["img/small/glock.png", "img/small/glock_rot1.png", "img/small/glock_rot2.png", "img/small/glock_reverse.png", "img/medium/glock_rot1_reverse.png", "img/medium/glock_rot2_reverse.png"];
      return options[Math.floor(seed * options.length)];
    }
  },
  tiny_skull_jitter: {
    iconSize: function(s) {
      return [80 / 4, 106 / 4];
    },
    iconAnchor: function(s) {
      return [Math.random() * 20 + 40 / 4, Math.random() * 20 + 106 / 4];
    },
    iconUrl: 'img/medium/skull.png'
  },
  tiny_glock_skull_jitter: {
    iconSize: function(s) {
      return [80 / 4, 106 / 4];
    },
    iconAnchor: function(s) {
      return [Math.random() * 20 + 40 / 4, Math.random() * 20 + 106 / 4];
    },
    iconUrl: 'img/medium/skull.png',
    shadowSize: [108 / 4, 84 / 4],
    shadowAnchor: function(seed) {
      var n;
      n = Math.floor(seed * 6);
      if (n <= 2) {
        return [200 / 4, 100 / 4 * Math.random() + 80 / 4];
      } else {
        return [-5, 100 / 4 * Math.random() + 80 / 4];
      }
    },
    shadowUrl: function(seed) {
      var options;
      options = ["img/tiny/glock.png", "img/tiny/glock_rot1.png", "img/tiny/glock_rot2.png", "img/tiny/glock_reverse.png", "img/medium/glock_rot1_reverse.png", "img/medium/glock_rot2_reverse.png"];
      return options[Math.floor(seed * options.length)];
    }
  }
});

start = [40.72677093147629, -73.9226245880127];

toner_layer = new L.StamenTileLayer("toner-lite", {
  attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, under <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a>. Data by <a href=\"http://openstreetmap.org\">OpenStreetMap</a>, under <a href=\"http://www.openstreetmap.org/copyright\">ODbL</a>."
});

markers = [];

marker_opacity = 1;

last_zoom = 13;

map = new L.Map("map", {
  center: new L.LatLng(start[0], start[1]),
  zoom: last_zoom,
  layers: [toner_layer]
});

toner_layer.setOpacity(0.5);

map.on('zoomend', function() {
  var current_zoom, mark, _i, _j, _k, _len, _len1, _len2;
  current_zoom = map.getZoom();
  console.log(current_zoom, last_zoom);
  if (current_zoom === 13 && last_zoom === 14) {
    for (_i = 0, _len = markers.length; _i < _len; _i++) {
      mark = markers[_i];
      if (mark["homicide"]) {
        mark.setIcon(death_icons.make("tiny_glock_skull_jitter"));
      } else {
        mark.setIcon(death_icons.make("tiny_skull_jitter"));
      }
    }
  }
  if (current_zoom === 14 && last_zoom === 13 || current_zoom === 14 && last_zoom === 15) {
    for (_j = 0, _len1 = markers.length; _j < _len1; _j++) {
      mark = markers[_j];
      if (mark["homicide"]) {
        mark.setIcon(death_icons.make("small_glock_skull_jitter"));
      } else {
        mark.setIcon(death_icons.make("small_skull_jitter"));
      }
    }
  }
  if (current_zoom === 15 && last_zoom === 14) {
    for (_k = 0, _len2 = markers.length; _k < _len2; _k++) {
      mark = markers[_k];
      if (mark["homicide"]) {
        mark.setIcon(death_icons.make("medium_glock_skull_jitter"));
      } else {
        mark.setIcon(death_icons.make("medium_skull_jitter"));
      }
    }
  }
  return last_zoom = current_zoom;
});

reqListener = function() {
  var data, i, mark, x, _i, _len, _results;
  data = JSON.parse(this.responseText);
  _results = [];
  for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
    x = data[i];
    mark = L.marker([x.lat, x.long], {
      icon: death_icons.make("tiny_skull_jitter"),
      clickable: false,
      opacity: marker_opacity,
      title: "hello"
    });
    mark.addTo(map);
    _results.push(markers.push(mark));
  }
  return _results;
};

url = "motor_related_deaths.json";

oReq = new XMLHttpRequest();

oReq.addEventListener('load', reqListener);

oReq.open("get", url, true);

oReq.send();

months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

reqListener = function() {
  var data, i, mark, title, x, _i, _len, _results;
  data = JSON.parse(this.responseText);
  _results = [];
  for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
    x = data[i];
    title = months[x["MO"]] + ' ' + x["YR"];
    mark = L.marker([x.latitude, x.longitude], {
      icon: death_icons.make("tiny_glock_skull_jitter"),
      riseOnHover: true,
      clickable: false,
      opacity: marker_opacity,
      title: title
    });
    mark.addTo(map);
    mark["homicide"] = true;
    _results.push(markers.push(mark));
  }
  return _results;
};

url = "murders.json";

oReq = new XMLHttpRequest();

oReq.addEventListener('load', reqListener);

oReq.open("get", url, true);

oReq.send();
