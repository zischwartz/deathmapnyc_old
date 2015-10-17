(function () {

    function defineSnogylop(L) {

        var worldLatlngs = [
            L.latLng([90, 180]),
            L.latLng([90, -180]),
            L.latLng([-90, -180]),
            L.latLng([-90, 180])
        ];

        L.extend(L.Polygon.prototype, {

            initialize: function (latlngs, options) {
                worldLatlngs = (options.worldLatLngs ? options.worldLatLngs : worldLatlngs);

                if (options && options.invert && !options.invertMultiPolygon) {
                    // Create a new set of latlngs, adding our world-sized ring
                    // first
                    var newLatlngs = [];
                    newLatlngs.push(worldLatlngs);
                    newLatlngs.push(latlngs[0]);
                    latlngs = newLatlngs;
                }

                L.Polyline.prototype.initialize.call(this, latlngs, options);
                this._initWithHoles(latlngs);
            },

            getBounds: function () {
                if (this.options.invert) {
                    // Don't return the world-sized ring's bounds, that's not
                    // helpful!
                    return new L.LatLngBounds(this._holes);
                }
                return new L.LatLngBounds(this.getLatLngs());
            },

        });

        L.extend(L.MultiPolygon.prototype, {

            initialize: function (latlngs, options) {
                worldLatlngs = (options.worldLatLngs ? options.worldLatLngs : worldLatlngs);
                this._layers = {};
                this._options = options;

                if (options.invert) {
                    // Let Polygon know we're part of a MultiPolygon
                    options.invertMultiPolygon = true;

                    // Create a new set of latlngs, adding our world-sized ring
                    // first
                    var newLatlngs = [];
                    newLatlngs.push(worldLatlngs);
                    for (var l in latlngs) {
                        newLatlngs.push(latlngs[l][0]);
                    }
                    latlngs = [newLatlngs];
                }

                this.setLatLngs(latlngs);
            },

        });

    }

    if (typeof define === 'function' && define.amd) {
        // Try to add snogylop to Leaflet using AMD
        define(['leaflet'], function (L) {
            defineSnogylop(L);
        });
    }
    else {
        // Else use the global L
        defineSnogylop(L);
    }

})();

var App, BetterIconFactory, app, better_icons,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

BetterIconFactory = (function() {
  function BetterIconFactory(types) {
    this.types = types;
    this.get_ratio = __bind(this.get_ratio, this);
  }

  BetterIconFactory.prototype.make = function(type, size, jitter) {
    var an_icon, jitter_multiplier, key, normal, obj, options, ratio, seed;
    if (jitter == null) {
      jitter = false;
    }
    jitter_multiplier = 100;
    obj = this.types[type];
    options = new obj.constructor();
    seed = Math.random();
    ratio = this.get_ratio(size);
    if (jitter) {
      normal = d3.random.normal(0, 0.5);
      jitter = [normal() * jitter_multiplier, normal() * jitter_multiplier];
    }
    for (key in obj) {
      if (typeof obj[key] === "function") {
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
  sizes: ["medium", "small", "tiny", "ity", "minute"],
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
      if (jitter === false) {
        return [40 / ratio, 70 / ratio];
      } else {
        return [(jitter[0] + 40) / ratio, (jitter[1] + 70) / ratio];
      }
    },
    iconUrl: function(size) {
      return "img/" + size + "/skull.png";
    },
    shadowSize: function(size, ratio, seed) {
      return [108 / ratio, 84 / ratio];
    },
    shadowAnchor: function(size, ratio, seed, jitter) {
      var glock_jit_x, glock_jit_y, n, normal;
      if (!jitter) {
        jitter = [0, 0];
      }
      n = Math.floor(seed * 6);
      normal = d3.random.normal(0, 1);
      glock_jit_x = normal() * 10 + jitter[0];
      glock_jit_y = (seed - 0.5) * 5 + jitter[1];
      if (n <= 2) {
        return [(glock_jit_x + 140) / ratio, (glock_jit_y + 50) / ratio];
      } else {
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

App = (function() {
  function App(options) {
    this.options = options;
    this.got_location = __bind(this.got_location, this);
    this.get_location = __bind(this.get_location, this);
    this.load_data = __bind(this.load_data, this);
    this.setup_map = __bind(this.setup_map, this);
    this.markers = [];
  }

  App.prototype.setup_map = function() {
    var toner_layer;
    toner_layer = new L.StamenTileLayer("toner-lite", {
      attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, under <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a>. Data by <a href=\"http://openstreetmap.org\">OpenStreetMap</a>, under <a href=\"http://www.openstreetmap.org/copyright\">ODbL</a>."
    });
    this.map = new L.Map("map", {
      center: this.options.center,
      zoom: this.options.zoom,
      layers: [toner_layer],
      maxZoom: this.options.maxZoom,
      minZoom: this.options.minZoom
    });
    this.zoom_to_marker_size = d3.scale.quantize().domain([17, 10]).range(this.options.factory.types.sizes);
    toner_layer.setOpacity(0.5);
    this.map.on('zoomstart', (function(_this) {
      return function() {
        return console.log("zoom start!");
      };
    })(this));
    return this.map.on('zoomend', (function(_this) {
      return function() {
        var current_zoom, mark, size, _i, _len, _ref, _results;
        current_zoom = _this.map.getZoom();
        size = _this.zoom_to_marker_size(current_zoom);
        console.log(current_zoom, size);
        _ref = _this.markers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          mark = _ref[_i];
          if (mark["homicide"]) {
            _results.push(mark.setIcon(_this.options.factory.make("glock_skull", size, true)));
          } else {
            _results.push(mark.setIcon(_this.options.factory.make("skull", size, true)));
          }
        }
        return _results;
      };
    })(this));
  };

  App.prototype.load_data = function() {
    var debug, icons, map, marker_opacity, markers, months, oReq, reqListener, size, url;
    map = this.map;
    debug = this.options.debug;
    markers = this.markers;
    marker_opacity = this.options.marker_opacity;
    size = this.zoom_to_marker_size(this.options.zoom);
    icons = this.options.factory;
    reqListener = function() {
      var data, i, mark, x, _i, _len, _results;
      data = JSON.parse(this.responseText);
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
        x = data[i];
        mark = L.marker([x.lat, x.long], {
          icon: icons.make("skull", size, true),
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
      var data, i, mark, title, x, _i, _len, _results;
      data = JSON.parse(this.responseText);
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
        x = data[i];
        title = months[x["MO"]] + ' ' + x["YR"];
        mark = L.marker([x.latitude, x.longitude], {
          icon: icons.make("glock_skull", size, true),
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
    reqListener = function() {
      var data, style;
      data = JSON.parse(this.responseText);
      style = {
        "color": "white",
        "weight": 0,
        "fillOpacity": 0.9
      };
      return L.geoJson(data, {
        invert: true,
        style: style
      }).addTo(map);
    };
    url = "nyc.json";
    oReq = new XMLHttpRequest();
    oReq.addEventListener('load', reqListener);
    oReq.open("get", url, true);
    if (!debug) {
      return oReq.send();
    }
  };

  App.prototype.get_location = function() {
    if ("geolocation" in navigator) {
      return navigator.geolocation.getCurrentPosition((function(_this) {
        return function(position) {
          console.log(position);
          return _this.got_location([position.coords.latitude, position.coords.longitude]);
        };
      })(this));
    } else {
      return alert("Geolocation not supported by your browser");
    }
  };

  App.prototype.got_location = function(pos) {
    var ll, meters;
    ll = L.latLng(pos[0], pos[1]);
    meters = ll.distanceTo(this.options.center);
    if (meters < 30000) {
      this.map.setView(pos, 14);
    }
    return console.log(meters);
  };

  return App;

})();

app = new App({
  center: new L.LatLng(40.714736512395284, -73.97661209106445),
  zoom: 12,
  maxZoom: 17,
  minZoom: 10,
  factory: better_icons,
  marker_opacity: 1
});

app.setup_map();

app.load_data();
