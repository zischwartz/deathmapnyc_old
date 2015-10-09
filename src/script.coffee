

get_location = ->
  if "geolocation" of navigator
    navigator.geolocation.getCurrentPosition (position)->
      console.log position
      gotLocation([position.coords.latitude, position.coords.longitude])
      # map.setView([position.coords.latitude, position.coords.longitude])
  else alert("Geolocation not supported by your browser")

gotLocation = (pos) ->
  ll = L.latLng(pos[0], pos[1])
  start_ll = new L.LatLng(start[0], start[1])
  meters = ll.distanceTo(start)

  if meters < 30000
    map.setView pos, 14
  console.log meters


class IconFactory 
  constructor: (@types)->
  # console.log types

  # this just populates objects for icon options that were passed to the constructor
  # if one of the options is a function, it gets passed the seed and the return value is used
  make: (type) ->
    obj = @types[type]
    options = new obj.constructor()
    seed = Math.random()
    for key of obj
        if typeof obj[key] is "function"
          options[key] = obj[key](seed)
        else
          options[key] = obj[key]

    an_icon = L.icon options
    return an_icon



class BetterIconFactory 
  constructor: (@types)->
  # console.log types

  set_icon_sizes: (@sizes)->

  # this just populates objects for icon options that were passed to the constructor
  # if one of the options is a function, it gets passed the seed and the return value is used
  make: (type) ->
    obj = @types[type]
    options = new obj.constructor()
    seed = Math.random()
    for key of obj
        if typeof obj[key] is "function"
          options[key] = obj[key](seed)
        else
          options[key] = obj[key]

    an_icon = L.icon options
    return an_icon



# use it
death_icons = new IconFactory
  medium_skull:
    iconSize: [80, 106]
    iconAnchor:   [40, 106]
    iconUrl: 'img/medium/skull.png'
  medium_glock_skull:
    iconSize: [80, 106]
    iconAnchor:   [40, 106]
    iconUrl: 'img/medium/skull.png'
    shadowSize:[108, 84]
    shadowAnchor: (seed)->
      n = Math.floor(seed * 6) # options.length below is 6
      if n <= 2
        [140, 100*seed+60]
      else 
        [-40, 100*seed+60]
    shadowUrl: (seed)->
      options = ["img/medium/glock.png", "img/medium/glock_rot1.png", "img/medium/glock_rot2.png", "img/medium/glock_reverse.png", "img/medium/glock_rot1_reverse.png", "img/medium/glock_rot2_reverse.png",]
      options[ Math.floor(seed * options.length) ]


  small_skull:
    iconSize: [80/2, 106/2]
    iconAnchor:   [40/2, 106/2]
    iconUrl: 'img/medium/skull.png'
  small_glock_skull:
    iconSize: [80/2, 106/2]
    iconAnchor:   [40/2, 106/2]
    iconUrl: 'img/medium/skull.png'
    shadowSize:[108/2, 84/2]
    shadowAnchor: (seed)->
      n = Math.floor(seed * 6) # options.length below is 6
      if n <= 2
        [140/2, 100/2*seed+60/2]
      else 
        [-40/2, 100/2*seed+60/2]
    shadowUrl: (seed)->
      options = ["img/small/glock.png", "img/small/glock_rot1.png", "img/small/glock_rot2.png", "img/small/glock_reverse.png", "img/medium/glock_rot1_reverse.png", "img/medium/glock_rot2_reverse.png",]
      options[ Math.floor(seed * options.length) ]


  medium_skull_jitter:
    iconSize: (s)->[80, 106]
    iconAnchor: (s)->  [Math.random()*40+40, Math.random()*40+106]
    iconUrl: 'img/medium/skull.png'
  medium_glock_skull_jitter:
    iconSize: (s)->[80, 106]
    iconAnchor:  (s)-> [Math.random()*40+40, Math.random()*40+106]
    iconUrl: 'img/medium/skull.png'
    shadowSize:[108, 84]
    shadowAnchor: (seed)->
      n = Math.floor(seed * 6) # options.length below is 6
      if n <= 2
        [140, 100*Math.random()+60]
      else 
        [-10, 100*Math.random()+60]
    shadowUrl: (seed)->
      options = ["img/medium/glock.png", "img/medium/glock_rot1.png", "img/medium/glock_rot2.png", "img/medium/glock_reverse.png", "img/medium/glock_rot1_reverse.png", "img/medium/glock_rot2_reverse.png",]
      options[ Math.floor(seed * options.length) ]


  small_skull_jitter:
    iconSize: (s)->[80/2, 106/2]
    iconAnchor: (s)->  [Math.random()*20+40/2, Math.random()*20+106/2]
    iconUrl: 'img/small/skull.png'
  small_glock_skull_jitter:
    iconSize: (s)->[80/2, 106/2]
    iconAnchor:  (s)-> [Math.random()*20+40/2, Math.random()*20+106/2]
    iconUrl: 'img/small/skull.png'
    shadowSize:[108/2, 84/2]
    shadowAnchor: (seed)->
      n = Math.floor(seed * 6) # options.length below is 6
      if n <= 2
        [140/2, 100/2*Math.random()+60/2]
      else 
        [-10, 100/2*Math.random()+60/2]
    shadowUrl: (seed)->
      options = ["img/small/glock.png", "img/small/glock_rot1.png", "img/small/glock_rot2.png", "img/small/glock_reverse.png", "img/medium/glock_rot1_reverse.png", "img/medium/glock_rot2_reverse.png",]
      options[ Math.floor(seed * options.length) ]


  tiny_skull_jitter:
    iconSize: (s)->[80/4, 106/4]
    iconAnchor: (s)->  [Math.random()*20+40/4, Math.random()*20+106/4]
    iconUrl: 'img/tiny/skull.png'
  tiny_glock_skull_jitter:
    iconSize: (s)->[80/4, 106/4]
    iconAnchor:  (s)-> [Math.random()*20+40/4, Math.random()*20+106/4]
    iconUrl: 'img/tiny/skull.png'
    shadowSize:[108/4, 84/4]
    shadowAnchor: (seed)->
      n = Math.floor(seed * 6) # options.length below is 6
      if n <= 2
        [200/4, 100/4*Math.random()+80/4]
      else 
        # glocks on the right, that point left
        [-5, 100/4*Math.random()+80/4]
    shadowUrl: (seed)->
      options = ["img/tiny/glock.png", "img/tiny/glock_rot1.png", "img/tiny/glock_rot2.png", "img/tiny/glock_reverse.png", "img/tiny/glock_rot1_reverse.png", "img/tiny/glock_rot2_reverse.png",]
      options[ Math.floor(seed * options.length) ]

  ity_skull_jitter:
    iconSize: (s)->[80/8, 106/8]
    iconAnchor: (s)->  [Math.random()*20+40/8, Math.random()*20+106/8]
    iconUrl: 'img/ity/skull.png'
  ity_glock_skull_jitter:
    iconSize: (s)->[80/8, 106/8]
    iconAnchor:  (s)-> [Math.random()*20+40/8, Math.random()*20+106/8]
    iconUrl: 'img/ity/skull.png'
    shadowSize:[108/8, 84/8]
    shadowAnchor: (seed)->
      n = Math.floor(seed * 6) # options.length below is 6
      if n <= 2
        [34, 100/8*Math.random()+80/8]
      else 
        # glocks on the right, that point left
        [-5, 100/8*Math.random()+80/8]
    shadowUrl: (seed)->
      options = ["img/ity/glock.png", "img/ity/glock_rot1.png", "img/ity/glock_rot2.png", "img/ity/glock_reverse.png", "img/ity/glock_rot1_reverse.png", "img/ity/glock_rot2_reverse.png",]
      options[ Math.floor(seed * options.length) ]




start = [40.72677093147629, -73.9226245880127]

toner_layer = new L.StamenTileLayer "toner-lite", 
  attribution: """Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>."""

markers = []

# marker_opacity = 0.4
marker_opacity = 1

last_zoom = 13


map = new L.Map "map", 
  center: new L.LatLng(start[0], start[1])
  zoom: last_zoom
  layers: [toner_layer] #watercolor_layer
# map.addLayer(layer)


# map.on 'click', (e)-> 
#     console.log (e.latlng)


toner_layer.setOpacity(0.5)

map.on 'zoomend', ->
  current_zoom = map.getZoom()
  console.log current_zoom, last_zoom
  # smaller numbers are zoomed further out
  
  # TODO
  # tiny at 13
  # at 14 use small


  if current_zoom is 12 and last_zoom is 13
    for mark in markers
      if mark["homicide"]
        mark.setIcon death_icons.make("ity_glock_skull_jitter")
      else
        mark.setIcon death_icons.make("ity_skull_jitter")

  # default
  # if current_zoom <= 13 and last_zoom in [13, 14]
  if current_zoom is 13 and last_zoom is 14 or current_zoom is 13 and last_zoom is 12
    console.log 'def'
    for mark in markers
      if mark["homicide"]
        mark.setIcon death_icons.make("tiny_glock_skull_jitter")
      else
        mark.setIcon death_icons.make("tiny_skull_jitter")
  #     marker.setOpacity 0.5

  # zoomed in view, automatic if got_location is in nyc
  # if current_zoom > 13 and last_zoom in [13, 14]
  if current_zoom is 14 and last_zoom is 13 or current_zoom is 14 and last_zoom is 15
    for mark in markers
      if mark["homicide"]
        mark.setIcon death_icons.make("small_glock_skull_jitter")
      else
        mark.setIcon death_icons.make("small_skull_jitter")

  if current_zoom is 15 and last_zoom is 14
    for mark in markers
      if mark["homicide"]
        mark.setIcon death_icons.make("medium_glock_skull_jitter")
      else
        mark.setIcon death_icons.make("medium_skull_jitter")


  last_zoom = current_zoom
# OR try it this way, maybe use two different actual sizes to keep it relatively performant
# http://jsfiddle.net/paulovieira/vNLaP/
# https://groups.google.com/forum/#!topic/leaflet-js/9ouCSvTIU3c



reqListener =()->
  data = JSON.parse this.responseText
  for x, i in data
    # make the markers, add them to map
    mark = L.marker([x.lat, x.long], {icon: death_icons.make("tiny_skull_jitter"), clickable: false, opacity: marker_opacity, title: "hello"})
    mark.addTo(map)
    markers.push mark

url = "motor_related_deaths.json"

# DEBUG
# DEBUG
# DEBUG
debug = true
bridge = {lat:40.714736512395284, long:-73.97661209106445}
x= bridge
mark = L.marker([x.lat, x.long], {icon: death_icons.make("medium_glock_skull_jitter"), clickable: false, opacity: marker_opacity, title: "hello"})
mark.addTo(map)
mark = L.marker([x.lat, x.long], {icon: death_icons.make("small_skull"), clickable: false, opacity: marker_opacity, title: "hello"})
mark.addTo(map)


oReq = new XMLHttpRequest()
oReq.addEventListener('load', reqListener)
oReq.open("get", url, true)
if not debug 
  oReq.send()

# # SAME AS ABOVE
# # but with glock_skull, and longitude, lat
months = ["January","February","March","April","May","June","July","August","September","October","November","December"]


reqListener =()->
  data = JSON.parse this.responseText
  for x, i in data
    title = months[ x["MO"] ]+ ' '+ x["YR"]
    # make the markers, add them to map
    # markers.push L.marker([x.latitude, x.longitude], {icon: glock_skull, clickable: false, opacity: 0.7}).addTo(map);
    mark = L.marker([x.latitude, x.longitude], {icon: death_icons.make("tiny_glock_skull_jitter"), riseOnHover:true, clickable: false, opacity: marker_opacity, title: title})
    mark.addTo(map)
    mark["homicide"] = true
    markers.push mark

url = "murders.json"

oReq = new XMLHttpRequest()
oReq.addEventListener('load', reqListener)
oReq.open("get", url, true)
if not debug 
  oReq.send()


# var myMarker = new L.CircleMarker([10,10], { /* Options */ });

# map.on('zoomend', function() {
#   var currentZoom = map.getZoom();
#   myMarker.setRadius(currentZoom);
# });




# watercolor_layer = new L.StamenTileLayer "watercolor", 
#   attribution: """Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>."""
