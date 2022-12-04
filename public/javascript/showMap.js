
mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
container: 'map', 
style: 'mapbox://styles/mapbox/streets-v11', 
center: campMap.geometry.coordinates, 
zoom: 9, 
});

new mapboxgl.Marker()
.setLngLat(campMap.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({ offset: 25})
    .setHTML(
      `<h3>${campMap.title}</h3><p>${campMap.location}</p>`
    )
)
.addTo(map);