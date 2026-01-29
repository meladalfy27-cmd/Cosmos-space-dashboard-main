import api from "./api.js";
import { RegisterMultiEvents } from "./utils.js";

const planetsGrid = document.getElementById("planets-grid");
const planetDetailImage = document.getElementById("planet-detail-image");
const planetDetailName = document.getElementById("planet-detail-name");
const planetDetailDesc = document.getElementById("planet-detail-description");
const planetDistance = document.getElementById("planet-distance");
const planetRadius = document.getElementById("planet-radius");
const planetMass = document.getElementById("planet-mass");
const planetDensity = document.getElementById("planet-density");
const planetOrbitalPeriod = document.getElementById("planet-orbital-period");
const planetRotation = document.getElementById("planet-rotation");
const planetMoons = document.getElementById("planet-moons");
const planetGravity = document.getElementById("planet-gravity");
const planetDiscoverer = document.getElementById("planet-discoverer");
const planetDiscoveryDate = document.getElementById("planet-discovery-date");
const planetBodytype = document.getElementById("planet-body-type");
const planetVolume = document.getElementById("planet-volume");
const planetFacts = document
  .getElementById("planet-facts")
  .querySelectorAll("li span");
const planetPerihelion = document.getElementById("planet-perihelion");
const planetAphelion = document.getElementById("planet-aphelion");
const planetEccentricity = document.getElementById("planet-eccentricity");
const planetInclination = document.getElementById("planet-inclination");
const planetAxialTilt = document.getElementById("planet-axial-tilt");
const planetTemp = document.getElementById("planet-temp");
const planetEscape = document.getElementById("planet-escape");
const planetTbody = document.getElementById("planet-comparison-tbody");
const launchesCount = document.getElementById("launches-count");

let planetsData;

async function DisplayPlanets() {
  planetsData = await api.GetPlanets();
  if (planetsData.error) {
    planetTbody.innerHTML = "";
    planetsGrid.innerHTML = `<div class="col-span-full text-center py-8">
                    <i class="text-red-400 text-4xl mb-4" data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
                    <p class="text-slate-400">Failed to load planets data. Please try again later.</p>
                </div>`;
    return;
  }
  DisplayPlanetsGrid(planetsData);
  DisplayPlanetsTable();
  DisplayPlanetInfo(6);
}

function DisplayPlanetsGrid(planets) {
  let planetsHTML = "";

  planets.bodies.forEach((planet) => {
    const AU = CalculateAU(planet);

    planetsHTML += `
                    <div
              class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
              data-planet-id="${planet.id}"
              style="--planet-color: #eab308"
              onmouseover="this.style.borderColor='#eab30880'"
              onmouseout="this.style.borderColor='#334155'"
            >
              <div class="relative mb-3 h-24 flex items-center justify-center">
                <img
                  class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                  src="${planet.image}"
                  alt="${planet.englishName}"
                />
              </div>
              <h4 class="font-semibold text-center text-sm">${planet.englishName}</h4>
              <p class="text-xs text-slate-400 text-center">${AU} AU</p>
            </div>`;
  });
  planetsGrid.innerHTML = planetsHTML;
}

function DisplayPlanetInfo(clickedPlanetIndex) {
  const planet = planetsData.bodies[clickedPlanetIndex];
  planetDetailImage.setAttribute("src", `${planet.image}`);
  planetDetailName.textContent = planet.englishName;
  planetDetailDesc.textContent = planet.description;
  planetDistance.textContent = `${(planet.semimajorAxis / 1000000).toFixed(
    1
  )}M km`;
  planetRadius.textContent = `${planet.meanRadius.toFixed(0)} km`;
  planetMass.textContent = `${planet.mass.massValue} x 10^${planet.mass.massExponent} kg`;
  planetDensity.textContent = `${planet.density.toFixed(2)} g/cm³`;
  planetOrbitalPeriod.textContent = `${planet.sideralOrbit.toFixed(2)} days`;
  planetRotation.textContent = `${planet.sideralRotation.toFixed(2)} hours`;
  planetMoons.textContent = planet.moons ? planet.moons.length : "0";
  planetGravity.textContent = `${planet.gravity.toFixed(2)} m/s²`;
  planetDiscoverer.textContent =
    planet.discoveredBy === "" ? "Known since antiquity" : planet.discoveredBy;
  planetDiscoveryDate.textContent =
    planet.discoveryDate === "" ? "Ancient times" : planet.discoveryDate;
  planetBodytype.textContent = planet.bodyType;
  planetVolume.textContent = `${planet.vol.volValue} x 10^${planet.vol.volExponent} km³`;
  planetFacts[0].textContent = `Mass: ${planetMass.textContent}`;
  planetFacts[1].textContent = `Surface gravity: ${planetGravity.textContent}`;
  planetFacts[2].textContent = `Density: ${planet.density} g/cm³`;
  planetFacts[3].textContent = `Axial tilt: ${planet.axialTilt}°`;
  planetPerihelion.textContent = `${(planet.perihelion / 1000000).toFixed(
    1
  )}M km`;
  planetAphelion.textContent = `${(planet.aphelion / 1000000).toFixed(1)}M km`;
  planetEccentricity.textContent = `${planet.eccentricity.toFixed(5)}`;
  planetInclination.textContent = `${
    planet.inclination == 0 ? "NA" : `${planet.inclination}°`
  } `;
  planetAxialTilt.textContent = `${planet.axialTilt.toFixed(2)}°`;
  planetTemp.textContent = `${planet.avgTemp}°C`;
  planetEscape.textContent = `${planet.escape / 1000} km/s`;
}

function DisplayPlanetsTable() {
  const planetsColorsMap = new Map([
    ["Uranus", "#06b6d4"],
    ["Neptune", "#2563eb"],
    ["Jupiter", "#fb923c"],
    ["Mars", "#ef4444"],
    ["Mercury", "#6b7280"],
    ["Saturn", "#facc15"],
    ["Earth", "#3b82f6"],
    ["Venus", "#f97316"],
  ]);
  let planetRows = "";

  planetsData.bodies.forEach((planet) => {
    planetRows += ` <tr class="hover:bg-slate-800/30 transition-colors">
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10"
                      >
                        <div class="flex items-center space-x-2 md:space-x-3">
                          <div
                            class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                            style="background-color:  ${planetsColorsMap.get(
                              planet.englishName
                            )}"
                          ></div>
                          <span
                            class="font-semibold text-sm md:text-base whitespace-nowrap"
                            >${planet.englishName}</span
                          >
                        </div>
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${CalculateAU(planet)}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${CalculateDiameter(planet)}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                       ${CalculateMass(planet)}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${GetFormattedOrbitalPeriod(planet)} 
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${planet.moons ? planet.moons.length : "0"}
                      </td>
                      <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span
                          class="px-2 py-1 rounded text-xs" style="${GetBadgeTitle(
                            planet.type
                          )}"
                          >${planet.type}</span
                        >
                      </td>
                    </tr>`;
  });
  planetTbody.innerHTML = planetRows;
}
function CalculateAU(planet) {
  const AU_IN_KM = 149_597_870.7;
  const AU = (planet.semimajorAxis / AU_IN_KM).toFixed(2);
  return AU;
}

function CalculateDiameter(planet) {
  const diameter = planet.meanRadius * 2;
  return diameter.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function CalculateMass(planet) {
  const earthMass = 5.972e24;
  const planetMass =
    planet.mass.massValue * Math.pow(10, planet.mass.massExponent);

  return (planetMass / earthMass).toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

function GetFormattedOrbitalPeriod(planet) {
  const orbitalDays = planet.sideralOrbit;
  const orbitalYears = orbitalDays / 365.25;
  return orbitalYears < 1
    ? `${orbitalDays.toFixed(0)} days`
    : `${orbitalYears.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })} years`;
}

function GetBadgeTitle(type) {
  switch (type) {
    case "Ice Giant":
      return "background-color: #3b82f680; color: #60a5fa";
    case "Terrestrial":
      return "background-color: #f9731680; color: #fb923c";
    case "Gas Giant":
      return "background-color: #a855f780; color: #c084fc";
  }
}

function RegisterEvents() {
  RegisterMultiEvents(planetsGrid.children, "click", (e) => {
    const index = Array.from(planetsGrid.children).indexOf(e.currentTarget);
    DisplayPlanetInfo(index);
  });
}

const planets = {
  RegisterEvents,
  DisplayPlanets,
};

export default planets;
