import api from "./api.js";

const apodDate = document.getElementById("apod-date-input");
const loadDateBtn = document.getElementById("load-date-btn");
const todayApodBtn = document.getElementById("today-apod-btn");
const apodLoading = document.getElementById("apod-loading");
const apodImage = document.getElementById("apod-image");
const titleDate = document.getElementById("apod-date");
const apodTitle = document.getElementById("apod-title");
const apodDateDetail = document.getElementById("apod-date-detail");
const apodExplanation = document.getElementById("apod-explanation");
const apodCopyright = document.getElementById("apod-copyright");
const apodDateInfo = document.getElementById("apod-date-info");
const apodMediaType = document.getElementById("apod-media-type");
const fullResolutionBtn = apodImage.nextElementSibling.querySelector("button");

const currentDate = new Date().toISOString().split("T")[0];

Init();

function Init() {
  apodDate.max = currentDate;
}

function DisplayTodayInfo() {
  apodDate.value = currentDate;
  SetDateTextView(apodDate.value);

  DisplayInfoByDate();
}

async function DisplayInfoByDate() {
  ShowLoading();
  let blog = await api.GetBlogByDate(apodDate.value);
  OnLoadingComplete(blog);
  updateSpaceBlog(blog);
}

function updateSpaceBlog(blog) {
  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
  titleDate.textContent = `Astronomy Picture of the Day - ${formattedDate}`;
  apodImage.setAttribute("src", `${blog.url}`);
  apodTitle.textContent = blog.title;

  apodDateDetail.lastChild.textContent = formattedDate;
  apodExplanation.textContent = blog.explanation;

  apodCopyright.innerHTML = ` <i class="fa-solid fa-copyright"></i>
  Copyright: ${blog.copyright}`;
  apodDateInfo.textContent = formattedDate;
  apodMediaType.textContent = blog.media_type;
}

function SetDateTextView(formattedDate) {
  const date = new Date(formattedDate);
  apodDate.nextElementSibling.innerHTML = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ShowLoading() {
  apodLoading.classList.remove("hidden");
  apodImage.classList.add("hidden");
}

function OnLoadingComplete(blog) {
  if (!blog) {
    apodLoading.innerHTML = `

            <i class="text-4xl text-red-400 mb-4" data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
            <p class="text-slate-400">Failed to load today's image</p>
            <p class="text-slate-500 text-sm mt-2">Please try again later</p>
       
   `;

    return;
  }
  apodLoading.classList.add("hidden");
  apodImage.classList.remove("hidden");
}

function OpenImageInNewTab() {
  window.open(apodImage.src, "_blank");
}

function RegisterEvents() {
  loadDateBtn.addEventListener("click", DisplayInfoByDate);
  todayApodBtn.addEventListener("click", DisplayTodayInfo);
  apodDate.addEventListener("change", (e) => SetDateTextView(e.target.value));
  fullResolutionBtn.addEventListener("click", OpenImageInNewTab);
}

const todaySpace = {
  RegisterEvents,
  DisplayTodayInfo,
};

export default todaySpace;
