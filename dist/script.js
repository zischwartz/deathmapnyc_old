var App, BetterIconFactory, better_icons,
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
    this.setup_nav = __bind(this.setup_nav, this);
    this.got_location = __bind(this.got_location, this);
    this.get_location = __bind(this.get_location, this);
    this.load_data = __bind(this.load_data, this);
    this.setup_map = __bind(this.setup_map, this);
    this.markers = [];
  }

  App.prototype.setup_map = function() {
    var bingGeocoder, hash, toner_layer;
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
    this.map.on('dblclick', (function(_this) {
      return function() {
        return $("#overlay").show();
      };
    })(this));
    this.map.on('zoomstart', (function(_this) {
      return function() {
        return $("#overlay").show();
      };
    })(this));
    this.map.on('zoomend', (function(_this) {
      return function() {
        var current_zoom, mark, size, _i, _len, _ref;
        current_zoom = _this.map.getZoom();
        size = _this.zoom_to_marker_size(current_zoom);
        _ref = _this.markers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          mark = _ref[_i];
          if (mark["homicide"]) {
            mark.setIcon(_this.options.factory.make("glock_skull", size, _this.options.jitter));
          } else {
            mark.setIcon(_this.options.factory.make("skull", size, _this.options.jitter));
          }
        }
        return $("#overlay").hide();
      };
    })(this));
    bingGeocoder = new L.Control.BingGeocoder("Aha580ykg9iksjSa0IlZlMV40YvQvVce26awizJYO2bLD3vWkkuUu-O199Fzm9Yi", {
      position: "bottomleft"
    });
    this.map.addControl(bingGeocoder);
    return hash = new L.Hash(this.map);
  };

  App.prototype.load_data = function() {
    var debug, icons, jitter_bool, map, marker_opacity, markers, months, oReq, reqListener, size, url;
    map = this.map;
    debug = this.options.debug;
    markers = this.markers;
    marker_opacity = this.options.marker_opacity;
    icons = this.options.factory;
    jitter_bool = this.options.jitter;
    size = this.zoom_to_marker_size(this.options.zoom);
    reqListener = function() {
      var data, i, mark, title, x, _i, _len, _results;
      data = JSON.parse(this.responseText);
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
        x = data[i];
        title = x['d'];
        mark = L.marker([x.lat, x.long], {
          icon: icons.make("skull", size, jitter_bool),
          clickable: false,
          opacity: marker_opacity,
          title: title
        });
        mark.addTo(map);
        _results.push(markers.push(mark));
      }
      return _results;
    };
    url = "veh.json";
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
        mark = L.marker([x.lat, x.long], {
          icon: icons.make("glock_skull", size, jitter_bool),
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
    console.log(meters);
    if (meters < 30000) {
      this.map.setView(pos, 15);
      if (this.circle) {
        return this.circle.setLatLng(ll);
      } else {
        this.circle = new L.CircleMarker(ll);
        return this.circle.addTo(this.map);
      }
    } else {
      return $("nav").append("<p>Sorry, you don't seem to be in new york city</p>");
    }
  };

  App.prototype.setup_nav = function() {
    $("nav div.about").hide();
    return $((function(_this) {
      return function() {
        $("nav a.about").on("click", function(e) {
          $("nav div.about").toggle();
          e.preventDefault();
          return false;
        });
        return $("nav a.goto, #goto_mobile_button").on("click", function() {
          _this.get_location();
          return $("#goto_mobile_button").hide();
        });
      };
    })(this));
  };

  return App;

})();

$(function() {
  var app;
  app = new App({
    center: new L.LatLng(40.714736512395284, -73.97661209106445),
    zoom: 12,
    maxZoom: 17,
    minZoom: 10,
    factory: better_icons,
    marker_opacity: 1,
    jitter: true
  });
  app.setup_map();
  app.load_data();
  app.setup_nav();
  $("#overlay").hide();
  return window.app = app;
});

L.Control.BingGeocoder = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topright',
		text: 'Locate',
		callback: function (results) {
			var bbox = results.resourceSets[0].resources[0].bbox,
				first = new L.LatLng(bbox[0], bbox[1]),
				second = new L.LatLng(bbox[2], bbox[3]),
				bounds = new L.LatLngBounds([first, second]);
			this._map.fitBounds(bounds);
		}
	},

	_callbackId: 0,

	initialize: function (key, options) {
		this.key = key;
		L.Util.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;
		var className = 'leaflet-control-geocoder',
			container = this._container = L.DomUtil.create('div', className);

		L.DomEvent.disableClickPropagation(container);

		var form = this._form = L.DomUtil.create('form', className + '-form');

		var input = this._input = L.DomUtil.create('input', className + '-input', form);
		input.type = 'text';

		var submit = this._createButton(className, this.options.text);
		form.appendChild(submit);

		L.DomEvent.on(form, 'submit', this._geocode, this);

		if (this.options.collapsed) {
			L.DomEvent.on(container, 'mouseover', this._expand, this);
			L.DomEvent.on(container, 'mouseout', this._collapse, this);

			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Bing Geocoder';

			L.DomEvent.on(link, L.Browser.touch ? 'click' : 'focus', this._expand, this);

			this._map.on('movestart', this._collapse, this);
		} else {
			this._expand();
		}

		container.appendChild(form);

		return container;
	},

	_createButton: function(css, text) {
		var btn = '<button type="submit" class="' + css + '-button" />' + text + '</button>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = btn;

		return radioFragment.firstChild;
	},

	_geocode : function (event) {
		L.DomEvent.preventDefault(event);
		this._callbackId = '_l_binggeocoder_' + (this._callbackId++);
		window[this._callbackId] = L.Util.bind(this.options.callback, this);

		var params = {
			query: this._input.value,
			key : this.key,
			jsonp : this._callbackId
		},
		url = 'http://dev.virtualearth.net/REST/v1/Locations' + L.Util.getParamString(params),
		script = L.DomUtil.create('script', '', document.getElementsByTagName('head')[0]);

		script.type = 'text/javascript';
		script.src = url;
		script.id = this._callbackId;
	},

	_expand: function () {
		L.DomUtil.addClass(this._container, 'leaflet-control-geocoder-expanded');
	},

	_collapse: function () {
		L.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-expanded');
	}
});

L.control.bingGeocoder = function (key, options) {
		return new L.Control.BingGeocoder(key, options);
};
(function(window) {
	var HAS_HASHCHANGE = (function() {
		var doc_mode = window.documentMode;
		return ('onhashchange' in window) &&
			(doc_mode === undefined || doc_mode > 7);
	})();

	L.Hash = function(map) {
		this.onHashChange = L.Util.bind(this.onHashChange, this);

		if (map) {
			this.init(map);
		}
	};

	L.Hash.parseHash = function(hash) {
		if(hash.indexOf('#') === 0) {
			hash = hash.substr(1);
		}
		var args = hash.split("/");
		if (args.length == 3) {
			var zoom = parseInt(args[0], 10),
			lat = parseFloat(args[1]),
			lon = parseFloat(args[2]);
			if (isNaN(zoom) || isNaN(lat) || isNaN(lon)) {
				return false;
			} else {
				return {
					center: new L.LatLng(lat, lon),
					zoom: zoom
				};
			}
		} else {
			return false;
		}
	};

	L.Hash.formatHash = function(map) {
		var center = map.getCenter(),
		    zoom = map.getZoom(),
		    precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2));

		return "#" + [zoom,
			center.lat.toFixed(precision),
			center.lng.toFixed(precision)
		].join("/");
	},

	L.Hash.prototype = {
		map: null,
		lastHash: null,

		parseHash: L.Hash.parseHash,
		formatHash: L.Hash.formatHash,

		init: function(map) {
			this.map = map;

			// reset the hash
			this.lastHash = null;
			this.onHashChange();

			if (!this.isListening) {
				this.startListening();
			}
		},

		removeFrom: function(map) {
			if (this.changeTimeout) {
				clearTimeout(this.changeTimeout);
			}

			if (this.isListening) {
				this.stopListening();
			}

			this.map = null;
		},

		onMapMove: function() {
			// bail if we're moving the map (updating from a hash),
			// or if the map is not yet loaded

			if (this.movingMap || !this.map._loaded) {
				return false;
			}

			var hash = this.formatHash(this.map);
			if (this.lastHash != hash) {
				location.replace(hash);
				this.lastHash = hash;
			}
		},

		movingMap: false,
		update: function() {
			var hash = location.hash;
			if (hash === this.lastHash) {
				return;
			}
			var parsed = this.parseHash(hash);
			if (parsed) {
				this.movingMap = true;

				this.map.setView(parsed.center, parsed.zoom);

				this.movingMap = false;
			} else {
				this.onMapMove(this.map);
			}
		},

		// defer hash change updates every 100ms
		changeDefer: 100,
		changeTimeout: null,
		onHashChange: function() {
			// throttle calls to update() so that they only happen every
			// `changeDefer` ms
			if (!this.changeTimeout) {
				var that = this;
				this.changeTimeout = setTimeout(function() {
					that.update();
					that.changeTimeout = null;
				}, this.changeDefer);
			}
		},

		isListening: false,
		hashChangeInterval: null,
		startListening: function() {
			this.map.on("moveend", this.onMapMove, this);

			if (HAS_HASHCHANGE) {
				L.DomEvent.addListener(window, "hashchange", this.onHashChange);
			} else {
				clearInterval(this.hashChangeInterval);
				this.hashChangeInterval = setInterval(this.onHashChange, 50);
			}
			this.isListening = true;
		},

		stopListening: function() {
			this.map.off("moveend", this.onMapMove, this);

			if (HAS_HASHCHANGE) {
				L.DomEvent.removeListener(window, "hashchange", this.onHashChange);
			} else {
				clearInterval(this.hashChangeInterval);
			}
			this.isListening = false;
		}
	};
	L.hash = function(map) {
		return new L.Hash(map);
	};
	L.Map.prototype.addHash = function() {
		this._hash = L.hash(this);
	};
	L.Map.prototype.removeHash = function() {
		this._hash.removeFrom();
	};
})(window);

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
