import api from "./api.js";

const launchesCount = document.getElementById("launches-count");
const launchesCountMobile = document.getElementById("launches-count-mobile");
const featuredLaunch = document.getElementById("featured-launch");
const launchTitle = document.getElementById("launch-title");
const launchLogo = document.getElementById("launch-logo");
const firstInnerLogo = document.getElementById("first-inner-logo");
const secondInnerLogo = document.getElementById("second-inner-logo");
const daysToLaunch = document.getElementById("days-to-launch");
const launchDate = document.getElementById("launch-date");
const launchTime = document.getElementById("launch-time");
const launchLocation = document.getElementById("launch-location");
const launchCountry = document.getElementById("launch-country");
const launchDesc = document.getElementById("launch-desc");
const launchImageConatiner = document.getElementById("launch-img-container");
const launchesGrid = document.getElementById("launches-grid");

let launchesData;
let currentIndex;

async function DisplayLaunches() {
  launchesData = (await api.GetLaunches()).results;

  launchesCount.textContent = `${launchesData.length} Launches`;
  launchesCountMobile.textContent = `${launchesData.length}`;
  DisplaySelectedLaunch(0);
  DisplayLaunchesGrid();
}
function DisplaySelectedLaunch(index) {
  currentIndex = index;
  const launchStatus = launchesData[index].status.abbrev;
  const currentDate = new Date();
  const formattedLaunchDate = new Date(launchesData[index].net);
  const aDay = 1000 * 60 * 60 * 24;

  launchTitle.textContent = launchesData[index].name;
  launchLogo.textContent = launchStatus;
  setStatusColor(launchStatus);
  firstInnerLogo.textContent = launchesData[index].launch_service_provider.name;
  secondInnerLogo.textContent = launchesData[index].rocket.configuration.name;
  daysToLaunch.textContent = Math.ceil(
    (formattedLaunchDate - currentDate) / aDay
  );

  launchDate.textContent = formattedLaunchDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  launchTime.textContent = `${formattedLaunchDate
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    })
    .toUpperCase()} UTC`;

  launchLocation.textContent = launchesData[index].pad.location.name;
  launchCountry.textContent = launchesData[index].pad.country.name;
  launchDesc.textContent = launchesData[index].mission.description;

  const imageURL = launchesData[index].image.image_url;
  launchImageConatiner.innerHTML = `<img src="${imageURL}" alt="${launchesData[index].name}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='/assets/images/launch-placeholder.png';">`;
}

function setStatusColor(status) {
  let colorClass;
  switch (status.toUpperCase()) {
    case "GO":
      colorClass = "text-green-400";
      break;
    case "TBD":
      colorClass = "text-yellow-400";
      break;
    case "SUCCESS":
      colorClass = "text-green-400";
      break;
    case "HOLD":
      colorClass = "text-red-400";
      break;
    case "TBC":
      colorClass = "text-yellow-400";
      break;
  }
  launchLogo.classList.add(colorClass);
}

function DisplayLaunchesGrid() {
  let cards = "";
  launchesData.forEach((launch, index) => {
    if (index == currentIndex) return;
    const formattedLaunchDate = new Date(launch.net);

    const date = formattedLaunchDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    const time = `${formattedLaunchDate
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      })
      .toUpperCase()} UTC`;
    cards += `<div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center"
              >
                          <img
        src="${launch.image.image_url}"
        alt="${launch.name}"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onerror="this.onerror=null; this.src='assets/images/launch-placeholder.png';"
            />
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                    ${launch.status.abbrev}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    ${launch.name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${launch.launch_service_provider.name}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${date}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${time}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${launch.rocket.configuration.name}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${launch.pad.location.name}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>`;
  });
  launchesGrid.innerHTML = cards;
}

const launches = {
  DisplayLaunches,
};

export default launches;
