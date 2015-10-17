# DEBUG DEBUG DEBUG
# DEBUG DEBUG DEBUG
# DEBUG DEBUG DEBUG
# x= bridge
# old
# mark = L.marker(bridge, {icon: better_icons.make("medium_glock_skull_jitter"), clickable: false, opacity: marker_opacity, title: "hello"})
# mark.addTo(map)

# mark = L.marker(bridge, {icon: better_icons.make("skull", "tiny"), clickable: false, opacity: marker_opacity, title: "hello"})


# mark = L.marker(bridge, {icon: better_icons.make("skull", "medium", true), clickable: false, opacity: marker_opacity, title: "hello"})
# .addTo(map)

# mark = L.marker(bridge, {icon: better_icons.make("skull", "small", true), clickable: false, opacity: marker_opacity, title: "hello"})
# .addTo(map)

# mark = L.marker(bridge, {icon: better_icons.make("glock_skull", "medium", true), clickable: false, opacity: marker_opacity, title: "hello"}).addTo(map)
# mark = L.marker(bridge, {icon: better_icons.make("glock_skull", "medium", true), clickable: false, opacity: marker_opacity, title: "hello"}).addTo(map)
# mark = L.marker(bridge, {icon: better_icons.make("glock_skull", "medium", true), clickable: false, opacity: marker_opacity, title: "hello"}).addTo(map)

# mark = L.marker(bridge, {icon: better_icons.make("small_skull"), clickable: false, opacity: marker_opacity, title: "hello"})
# mark.addTo(map)

# map.on 'click', (e)-> 
#     console.log (e.latlng)



# OR try it this way, maybe use two different actual sizes to keep it relatively performant
# http://jsfiddle.net/paulovieira/vNLaP/
# https://groups.google.com/forum/#!topic/leaflet-js/9ouCSvTIU3c


# var myMarker = new L.CircleMarker([10,10], { /* Options */ });

# map.on('zoomend', function() {
#   var currentZoom = map.getZoom();
#   myMarker.setRadius(currentZoom);
# });




# watercolor_layer = new L.StamenTileLayer "watercolor", 
#   attribution: """Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>."""
