

# TODO

# [ ] Write generalized loader for markers
# [ ] Try L.transform for zoom http://jsfiddle.net/paulovieira/vNLaP/


start = [40.6294862,-74.022639]

layer = new L.StamenTileLayer "toner-lite", 
  attribution: """Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>."""
map = new L.Map "map", 
  center: new L.LatLng(start[0], start[1])
  zoom: 13
map.addLayer(layer)


map.on 'zoomend', ->
  currentZoom = map.getZoom()
  console.log currentZoom
  # smaller numbers are zoomed further out
  
  # TODO
  # one for zoom of 11

  #codify this, spend 15m making a tool for different states

  # if currentZoom <= 12
  #   for marker in markers
  #     marker.setIcon tiny_skull
  #     marker.setOpacity 0.5

  # if currentZoom > 12
  #   console.log 'change'
  #   for marker in markers
  #     marker.setIcon small_skull
  #     marker.setOpacity 0.7



# todo, generalize size, have it adjust on zoom
# also ask for location

# OR try it this way, maybe use two different actual sizes to keep it relatively performant
# http://jsfiddle.net/paulovieira/vNLaP/
# https://groups.google.com/forum/#!topic/leaflet-js/9ouCSvTIU3c

small_skull = L.icon
  iconUrl: 'small_skull.png',
  shadowUrl: 'small_skull_shadow_lighter.png',
  iconSize:     [80, 106],
  shadowSize:   [143, 112],
  iconAnchor:   [40, 106], # point of the icon which will correspond to marker's location
  shadowAnchor: [10, 112],  # the same for the shadow
  popupAnchor:  [-3, -76]


tiny_skull = L.icon
  iconUrl: 'small_skull.png',
  # shadowUrl: 'small_skull_shadow.png',
  iconSize:     [40, 53],
  shadowSize:   [121, 56],
  iconAnchor:   [20, 53], # point of the icon which will correspond to marker's location
  shadowAnchor: [5,  56],  # the same for the shadow
  popupAnchor:  [-3, -76]

# skullIcon = new GeneralIcon()
    # redIcon = new GeneralIcon({iconUrl: 'leaf-red.png'}),
    # orangeIcon = new GeneralIcon({iconUrl: 'leaf-orange.png'})


glock_skull = L.icon
  iconUrl: 'glock_skull.png',
  # shadowUrl: 'small_skull_shadow_lighter.png',
  iconSize:     [149 , 208],
  # shadowSize:   [143, 112],
  iconAnchor:   [40, 106], # point of the icon which will correspond to marker's location
  shadowAnchor: [10, 112],  # the same for the shadow
  popupAnchor:  [-3, -76]

markers = []

reqListener =()->
  data = JSON.parse this.responseText
  for x, i in data
    # make the markers, add them to map
    markers.push L.marker([x.lat, x.long], {icon: small_skull, clickable: false, opacity: 0.7}).addTo(map);


url = "motor_related_deaths.json"

oReq = new XMLHttpRequest()
oReq.addEventListener('load', reqListener)
oReq.open("get", url, true)
oReq.send()

# SAME AS ABOVE
# but with glock_skull, and longitude, lat

reqListener =()->
  data = JSON.parse this.responseText
  for x, i in data
    # make the markers, add them to map
    markers.push L.marker([x.latitude, x.longitude], {icon: glock_skull, clickable: false, opacity: 0.7}).addTo(map);


url = "murders.json"

oReq = new XMLHttpRequest()
oReq.addEventListener('load', reqListener)
oReq.open("get", url, true)
oReq.send()


# var myMarker = new L.CircleMarker([10,10], { /* Options */ });

# map.on('zoomend', function() {
#   var currentZoom = map.getZoom();
#   myMarker.setRadius(currentZoom);
# });


# setIcon




