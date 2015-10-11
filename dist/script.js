var BetterIconFactory, IconFactory, better_icons, bridge, debug, get_location, gotLocation, last_zoom, map, mark, marker_opacity, markers, months, oReq, reqListener, toner_layer, url, x,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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

BetterIconFactory = (function() {
  function BetterIconFactory(types) {
    this.types = types;
    this.get_ratio = __bind(this.get_ratio, this);
  }

  BetterIconFactory.prototype.make = function(type, size, jitter) {
    var an_icon, jitter_multiplier, key, obj, options, ratio, seed;
    if (jitter == null) {
      jitter = false;
    }
    obj = this.types[type];
    options = new obj.constructor();
    seed = Math.random();
    ratio = this.get_ratio(size);
    jitter_multiplier = 40 * 2;
    for (key in obj) {
      if (typeof obj[key] === "function") {
        if (jitter) {
          jitter = [(Math.random() - 0.5) * jitter_multiplier, (Math.random() - 0.5) * jitter_multiplier];
        }
        options[key] = obj[key](size, ratio, seed, jitter);
      } else {
        options[key] = obj[key];
      }
    }
    an_icon = L.icon(options);
    return an_icon;
  };

  BetterIconFactory.prototype.get_ratio = function(size) {
    var ratio;
    ratio = this.types["sizes"].indexOf(size);
    return Math.pow(2, ratio);
  };

  return BetterIconFactory;

})();

better_icons = new BetterIconFactory({
  sizes: ["medium", "small", "tiny", "ity"],
  skull: {
    iconSize: function(size, ratio) {
      return [80 / ratio, 106 / ratio];
    },
    iconAnchor: function(size, ratio, seed, jitter) {
      if (jitter === false) {
        return [40 / ratio, 70 / ratio];
      } else {
        return [(jitter[0] + 40) / ratio, (jitter[1] + 70) / ratio];
      }
    },
    iconUrl: function(size) {
      return "img/" + size + "/skull.png";
    }
  },
  glock_skull: {
    iconSize: function(size, ratio) {
      return [80 / ratio, 106 / ratio];
    },
    iconAnchor: function(size, ratio, seed, jitter) {
      return [(jitter[0] + 40) / ratio, (jitter[1] + 70) / ratio];
    },
    iconUrl: function(size) {
      return "img/" + size + "/skull.png";
    },
    shadowSize: function(size, ratio, seed) {
      return [108 / ratio, 84 / ratio];
    },
    shadowAnchor: function(size, ratio, seed, jitter) {
      var glock_jit_x, glock_jit_y, n;
      n = Math.floor(seed * 6);
      glock_jit_x = (Math.random() - 0.5) * 20 + jitter[0];
      if (n <= 2) {
        glock_jit_y = seed * 40 + jitter[1];
        return [(glock_jit_x + 140) / ratio, (glock_jit_y + 50) / ratio];
      } else {
        glock_jit_y = (seed - 0.5) * 40 + jitter[1];
        return [(-30 + glock_jit_x) / ratio, (glock_jit_y + 50) / ratio];
      }
    },
    shadowUrl: function(size, ratio, seed) {
      var options;
      options = ["img/" + size + "/glock.png", "img/" + size + "/glock_rot1.png", "img/" + size + "/glock_rot2.png", "img/" + size + "/glock_reverse.png", "img/" + size + "/glock_rot1_reverse.png", "img/" + size + "/glock_rot2_reverse.png"];
      return options[Math.floor(seed * options.length)];
    }
  }
});

debug = false;

bridge = new L.LatLng(40.714736512395284, -73.97661209106445);

toner_layer = new L.StamenTileLayer("toner-lite", {
  attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, under <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a>. Data by <a href=\"http://openstreetmap.org\">OpenStreetMap</a>, under <a href=\"http://www.openstreetmap.org/copyright\">ODbL</a>."
});

markers = [];

marker_opacity = 1;

last_zoom = 13;

map = new L.Map("map", {
  center: bridge,
  zoom: last_zoom,
  layers: [toner_layer]
});

x = bridge;

mark = L.marker(bridge, {
  icon: better_icons.make("glock_skull", "tiny", true),
  clickable: false,
  opacity: marker_opacity,
  title: "hello"
}).addTo(map);

toner_layer.setOpacity(0.5);

map.on('zoomend', function() {
  var current_zoom;
  current_zoom = map.getZoom();
  console.log(current_zoom, last_zoom);
  return last_zoom = current_zoom;
});

reqListener = function() {
  var data, i, _i, _len, _results;
  data = JSON.parse(this.responseText);
  _results = [];
  for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
    x = data[i];
    mark = L.marker([x.lat, x.long], {
      icon: better_icons.make("skull", "tiny", true),
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

if (!debug) {
  oReq.send();
}

months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

reqListener = function() {
  var data, i, title, _i, _len, _results;
  data = JSON.parse(this.responseText);
  _results = [];
  for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
    x = data[i];
    title = months[x["MO"]] + ' ' + x["YR"];
    mark = L.marker([x.latitude, x.longitude], {
      icon: better_icons.make("glock_skull", "tiny", true),
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

if (!debug) {
  oReq.send();
}
