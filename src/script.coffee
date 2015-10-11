


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

  # todo
  # try just one icon, see if the whole thing performs better

  # this just populates objects for icon options that were passed to the constructor
  # if one of the options is a function, it gets passed the seed and the return value is used
  make: (type, size, jitter=false) ->
    # console.log @types
    obj = @types[type]
    options = new obj.constructor()
    seed = Math.random()
    ratio = @get_ratio(size)
    jitter_multiplier = 40*2


    for key of obj
        if typeof obj[key] is "function"
          if jitter
            jitter =[(Math.random()-0.5)*jitter_multiplier, (Math.random()-0.5)*jitter_multiplier]
          options[key] = obj[key](size, ratio, seed, jitter)
        else
          options[key] = obj[key]

    an_icon = L.icon options
    return an_icon

  get_ratio: (size)=>
    ratio = @types["sizes"].indexOf(size)
    Math.pow(2, ratio)

better_icons = new BetterIconFactory
    sizes: ["medium", "small", "tiny", "ity"]
    
    skull:
      iconSize: (size, ratio) ->[80/ratio, 106/ratio]
      iconAnchor:   (size, ratio, seed, jitter) ->
        if jitter is false then return [40/ratio, 70/ratio]
        else return [(jitter[0]+40)/ratio, (jitter[1]+70)/ratio]

      iconUrl: (size)-> 
        "img/#{size}/skull.png"
    
    glock_skull:
      iconSize: (size, ratio) ->[80/ratio, 106/ratio]
      iconAnchor:   (size, ratio, seed, jitter) -> 
        # console.log jitter
        [(jitter[0]+40)/ratio, (jitter[1]+70)/ratio]
      iconUrl: (size)-> 
        "img/#{size}/skull.png"
      shadowSize:(size, ratio, seed) -> [108/ratio, 84/ratio]
      shadowAnchor: (size, ratio, seed, jitter)->
        # console.log size, ratio, seed
        n = Math.floor(seed * 6) # options.length below in shadowUrl is 6
        glock_jit_x = (Math.random()-0.5)*20+jitter[0]
        if n <= 2
          glock_jit_y = seed*40+jitter[1]
          # console.log "points right"
          return [(glock_jit_x+140)/ratio, (glock_jit_y+50)/ratio]
        else 
          # console.log jitter[1]
          glock_jit_y = (seed-0.5)*40+jitter[1]
          # console.log "gun points left", glock_jit_y
          [(-30+glock_jit_x)/ratio, (glock_jit_y+50)/ratio]
          # return [-20/ratio, 30/ratio]
        #   [-40, 100*seed+60]
      shadowUrl: (size, ratio, seed)->
        options = ["img/#{size}/glock.png", "img/#{size}/glock_rot1.png", "img/#{size}/glock_rot2.png", "img/#{size}/glock_reverse.png", "img/#{size}/glock_rot1_reverse.png", "img/#{size}/glock_rot2_reverse.png",]
        options[ Math.floor(seed * options.length) ]
    # h, k = circle center (icon anchor)
    # x = r*Math.cos(t) + h;
    # y = r*Math.sin(t) + k;



# BEGIN
# BEGIN


# DEBUG
# DEBUG
# DEBUG
debug = false
# bridge = {lat:40.714736512395284, lng:-73.97661209106445}
bridge = new L.LatLng 40.714736512395284, -73.97661209106445


# start = [40.72677093147629, -73.9226245880127]

toner_layer = new L.StamenTileLayer "toner-lite", 
  attribution: """Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>."""

markers = []

# marker_opacity = 0.4
marker_opacity = 1

last_zoom = 13


map = new L.Map "map", 
  center: bridge
  # center: new L.LatLng(start[0], start[1])
  zoom: last_zoom
  layers: [toner_layer] #watercolor_layer
# map.addLayer(layer)

# DEBUG DEBUG DEBUG
# DEBUG DEBUG DEBUG
# DEBUG DEBUG DEBUG
x= bridge
# old
# mark = L.marker(bridge, {icon: better_icons.make("medium_glock_skull_jitter"), clickable: false, opacity: marker_opacity, title: "hello"})
# mark.addTo(map)

# mark = L.marker(bridge, {icon: better_icons.make("skull", "tiny"), clickable: false, opacity: marker_opacity, title: "hello"})


# mark = L.marker(bridge, {icon: better_icons.make("skull", "medium", true), clickable: false, opacity: marker_opacity, title: "hello"})
# .addTo(map)

# mark = L.marker(bridge, {icon: better_icons.make("skull", "small", true), clickable: false, opacity: marker_opacity, title: "hello"})
# .addTo(map)

mark = L.marker(bridge, {icon: better_icons.make("glock_skull", "tiny", true), clickable: false, opacity: marker_opacity, title: "hello"})
.addTo(map)

# mark = L.marker(bridge, {icon: better_icons.make("small_skull"), clickable: false, opacity: marker_opacity, title: "hello"})
# mark.addTo(map)

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


  # if current_zoom is 12 and last_zoom is 13
  #   for mark in markers
  #     if mark["homicide"]
  #       mark.setIcon better_icons.make("ity_glock_skull_jitter")
  #     else
  #       mark.setIcon better_icons.make("ity_skull_jitter")

  # # default
  # # if current_zoom <= 13 and last_zoom in [13, 14]
  # if current_zoom is 13 and last_zoom is 14 or current_zoom is 13 and last_zoom is 12
  #   console.log 'def'
  #   for mark in markers
  #     if mark["homicide"]
  #       mark.setIcon better_icons.make("tiny_glock_skull_jitter")
  #     else
  #       mark.setIcon better_icons.make("tiny_skull_jitter")
  # #     marker.setOpacity 0.5

  # # zoomed in view, automatic if got_location is in nyc
  # # if current_zoom > 13 and last_zoom in [13, 14]
  # if current_zoom is 14 and last_zoom is 13 or current_zoom is 14 and last_zoom is 15
  #   for mark in markers
  #     if mark["homicide"]
  #       mark.setIcon better_icons.make("small_glock_skull_jitter")
  #     else
  #       mark.setIcon better_icons.make("small_skull_jitter")

  # if current_zoom is 15 and last_zoom is 14
  #   for mark in markers
  #     if mark["homicide"]
  #       mark.setIcon better_icons.make("medium_glock_skull_jitter")
  #     else
  #       mark.setIcon better_icons.make("medium_skull_jitter")


  last_zoom = current_zoom
# OR try it this way, maybe use two different actual sizes to keep it relatively performant
# http://jsfiddle.net/paulovieira/vNLaP/
# https://groups.google.com/forum/#!topic/leaflet-js/9ouCSvTIU3c



reqListener =()->
  data = JSON.parse this.responseText
  # a_tiny_skull_icon = better_icons.make("skull", "tiny")
  for x, i in data
    # make the markers, add them to map
    # mark = L.marker([x.lat, x.long], {icon: a_tiny_skull_icon, clickable: false, opacity: marker_opacity, title: "hello"})
    mark = L.marker([x.lat, x.long], {icon: better_icons.make("skull", "tiny", true), clickable: false, opacity: marker_opacity, title: "hello"})
    mark.addTo(map)
    markers.push mark

url = "motor_related_deaths.json"

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
    # mark = L.marker([x.latitude, x.longitude], {icon: a_tiny_skull_icon, riseOnHover:true, clickable: false, opacity: marker_opacity, title: title})
    mark = L.marker([x.latitude, x.longitude], {icon: better_icons.make("glock_skull", "tiny", true), riseOnHover:true, clickable: false, opacity: marker_opacity, title: title})

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
