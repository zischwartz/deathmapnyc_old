


class BetterIconFactory 
  constructor: (@types)->
  # this just populates objects for icon options that were passed to the constructor
  # if one of the options is a function, it gets passed the seed and the return value is used
  make: (type, size, jitter=false) ->
    # console.log @types
    jitter_multiplier = 100
    obj = @types[type]
    options = new obj.constructor()
    seed = Math.random()
    ratio = @get_ratio(size)
    if jitter
      normal =d3.random.normal(0, 0.5)
      jitter = [normal()*jitter_multiplier, normal()*jitter_multiplier]
    for key of obj
        if typeof obj[key] is "function"
          options[key] = obj[key](size, ratio, seed, jitter)
        else
          options[key] = obj[key]

    an_icon = L.icon options
    return an_icon

  get_ratio: (size)=>
    ratio = @types["sizes"].indexOf(size)
    Math.pow(2, ratio)

better_icons = new BetterIconFactory
    sizes: ["medium", "small", "tiny", "ity", "minute"]
    
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
        if jitter is false then return [40/ratio, 70/ratio]
        else return [(jitter[0]+40)/ratio, (jitter[1]+70)/ratio]
      iconUrl: (size)-> 
        "img/#{size}/skull.png"
      shadowSize:(size, ratio, seed) -> [108/ratio, 84/ratio]
      shadowAnchor: (size, ratio, seed, jitter)->
        if not jitter then jitter =[0,0]
        # console.log size, ratio, seed
        n = Math.floor(seed * 6) # options.length below in shadowUrl is 6
        normal =d3.random.normal(0, 1)
        # normal = -> 0
        glock_jit_x = normal()*10+jitter[0]
        glock_jit_y = (seed-0.5)*5+jitter[1]
        if n <= 2
          return [(glock_jit_x+140)/ratio, (glock_jit_y+50)/ratio]
        else 
          [(-30+glock_jit_x)/ratio, (glock_jit_y+50)/ratio]
      shadowUrl: (size, ratio, seed)->
        options = ["img/#{size}/glock.png", "img/#{size}/glock_rot1.png", "img/#{size}/glock_rot2.png", "img/#{size}/glock_reverse.png", "img/#{size}/glock_rot1_reverse.png", "img/#{size}/glock_rot2_reverse.png",]
        options[ Math.floor(seed * options.length) ]



class App
  constructor: (@options)->
    @markers = []

  setup_map: =>

    toner_layer = new L.StamenTileLayer "toner-lite", 
      attribution: """Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>."""
    
    @map = new L.Map "map", 
      center: @options.center
      zoom: @options.zoom
      layers: [toner_layer]
      maxZoom: @options.maxZoom
      minZoom: @options.minZoom

    # @map.on 'click', (e)->  console.log (e.latlng)

    @zoom_to_marker_size = d3.scale.quantize().domain([17,10]).range(@options.factory.types.sizes)

    toner_layer.setOpacity(0.5)

    @map.on 'zoomstart', =>
      console.log "zoom start!"

    @map.on 'zoomend', =>
      current_zoom = @map.getZoom()
      size = @zoom_to_marker_size current_zoom
      console.log current_zoom, size
      for mark in @markers
          if mark["homicide"]
            mark.setIcon @options.factory.make "glock_skull", size, true
          else
            mark.setIcon @options.factory.make "skull", size, true


  load_data: =>
    # so lazy, just do this
    map = @map
    debug = @options.debug
    markers = @markers
    marker_opacity = @options.marker_opacity
    size = @zoom_to_marker_size(@options.zoom)
    icons = @options.factory
    # Lets request some data!
    reqListener =()->
      data = JSON.parse this.responseText
      for x, i in data
        mark = L.marker([x.lat, x.long], {icon: icons.make("skull", size, true), clickable: false, opacity: marker_opacity, title: "hello"})
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
        mark = L.marker([x.latitude, x.longitude], {icon: icons.make("glock_skull",size, true), riseOnHover:true, clickable: false, opacity: marker_opacity, title: title})

        mark.addTo(map)
        mark["homicide"] = true
        markers.push mark

    url = "murders.json"

    oReq = new XMLHttpRequest()
    oReq.addEventListener('load', reqListener)
    oReq.open("get", url, true)
    if not debug 
      oReq.send()


    # and again! for the mask over everything that's not actually in nyc

    reqListener =()->
      data = JSON.parse this.responseText
      style =
          "color": "white"
          "weight": 0
          "fillOpacity": 0.9

      L.geoJson(data, 
        invert: true
        style: style
      ).addTo(map)

    url = "nyc.json"

    oReq = new XMLHttpRequest()
    oReq.addEventListener('load', reqListener)
    oReq.open("get", url, true)
    if not debug 
      oReq.send()


  get_location: =>
    if "geolocation" of navigator
      navigator.geolocation.getCurrentPosition (position)=>
        console.log position
        @got_location([position.coords.latitude, position.coords.longitude])
        # map.setView([position.coords.latitude, position.coords.longitude])
    else alert("Geolocation not supported by your browser")

  got_location: (pos) =>
    ll = L.latLng(pos[0], pos[1])
    # start_ll = new L.LatLng(start[0], start[1])
    meters = ll.distanceTo(@options.center)

    if meters < 30000
      @map.setView pos, 14
    console.log meters



app = new App
  center: new L.LatLng 40.714736512395284, -73.97661209106445
  zoom: 12
  maxZoom: 17
  minZoom: 10
  factory: better_icons
  marker_opacity: 1


app.setup_map()
app.load_data()



