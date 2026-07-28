import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { places } from "../data/places.js";

// Mapa de São Paulo com nossos bares e restaurantes. Pino especial (🌙) para
// os lugares em que ficamos conversando até fechar.
export default function PlacesMap() {
  const elRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current || !elRef.current) return;

    const map = L.map(elRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19,
      attribution: "© OpenStreetMap © CARTO",
    }).addTo(map);

    const pts = [];
    places.forEach((p) => {
      const emoji = p.closed ? "🌙" : "❤️";
      const icon = L.divIcon({
        className: "placepin",
        html: `<span class="placepin__emoji">${emoji}</span>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -15],
      });
      const review = p.review
        ? `<div class="mappopup__review">“${p.review}”</div>`
        : "";
      const closed = p.closed
        ? `<div class="mappopup__closed">🌙 ficamos conversando até fechar</div>`
        : "";
      L.marker([p.lat, p.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div class="mappopup"><div class="mappopup__name">${p.name}</div>${review}${closed}</div>`
        );
      pts.push([p.lat, p.lng]);
    });

    if (pts.length === 1) map.setView(pts[0], 15);
    else if (pts.length > 1) map.fitBounds(pts, { padding: [40, 40] });
    else map.setView([-23.55, -46.64], 13);

    const t = setTimeout(() => map.invalidateSize(), 200);

    return () => {
      clearTimeout(t);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <section className="placesmap">
      <h2 className="placesmap__title">Nossos lugares em São Paulo</h2>
      <div className="placesmap__map" ref={elRef} />
      <p className="placesmap__legend">🌙 ficamos conversando até fechar</p>
      <ul className="placesmap__list">
        {places.map((p, i) => (
          <li className="placesmap__item" key={i}>
            <span className="placesmap__pin" aria-hidden="true">
              {p.closed ? "🌙" : "❤️"}
            </span>
            <span className="placesmap__info">
              <span className="placesmap__name">{p.name}</span>
              {p.review && <span className="placesmap__review">“{p.review}”</span>}
              {p.closed && (
                <span className="placesmap__closed">ficamos conversando até fechar</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
