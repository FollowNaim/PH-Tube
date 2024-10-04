const init = () => {
  loadData(
    "https://openapi.programming-hero.com/api/phero-tube/categories",
    displayCategories,
    "categories"
  );
  loadData(
    "https://openapi.programming-hero.com/api/phero-tube/videos",
    displayVideos,
    "videos"
  );
};

async function loadData(url, callback, prefix) {
  const res = await fetch(url);
  const data = await res.json();
  console.log(data[prefix]);
  callback(data[prefix]);
}

const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("categories-list");
  categories.forEach((category) => {
    const button = `
    <button id='${category.category_id}' class='btn category-btn'>${category.category}</button>
    `;
    categoryContainer.innerHTML += button;
  });
};

document.querySelector("#categories-list").addEventListener("click", (e) => {
  if (e.target.nodeName === "BUTTON") {
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");
    if (e.target.id !== "home") {
      filterByCategory(e.target.id);
    }
  }
  if (e.target.id === "home") {
    loadData(
      "https://openapi.programming-hero.com/api/phero-tube/videos",
      displayVideos,
      "videos"
    );
  }
});

const searchBox = document.getElementById("search");
searchBox.addEventListener("keyup", searchVideos);

async function searchVideos(e) {
  const searchTerm = e.target.value;
  const res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchTerm}`
  );
  const data = await res.json();
  displayVideos(data.videos);
}

const filterByCategory = async (id) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/category/${id}`
  );
  const data = await res.json();
  displayVideos(data.category);
};

const convertTime = (time) => {
  const hour = parseInt(time / 3600);
  const remaining = time % 3600;
  const min = parseInt(remaining / 60);
  return ` ${hour} hour and ${min} min ago`;
};

console.log(convertTime(1672656000));

const showCustomModal = (thumbnail, description) => {
  //   console.log(2);
  const customModal = document.getElementById("customModal");
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = `
    <div class='flex justify-center items-center'>
    <img src='${thumbnail}' />
    </div>
    <p class='mt-2'>${description}</p>
    `;
  customModal.showModal();
};

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  if (!videos || videos.length === 0) {
    console.log("no data", videos);
    alert("no data");
    videoContainer.innerHTML = "";
    return;
  }
  videoContainer.innerHTML = "";
  console.log("data", videos);
  videos.forEach((video) => {
    // console.log(video);

    const {
      thumbnail,
      title,
      authors,
      description,
      others: { views, posted_date },
    } = video;

    const [{ profile_picture, profile_name, verified }] = authors;

    // console.log(profile_name);
    // console.log(posted_date);

    const div = document.createElement("div");
    div.innerHTML = `
    <div class='h-52 relative'>
      <img class='w-full h-full object-cover rounded-md cursor-pointer ' src="${thumbnail}" />
        <span class='absolute bottom-2 right-2 bg-stone-600 p-1 rounded-md text-white'>${convertTime(
          posted_date
        )}</span>
    </div>
    <div class='flex gap-3 py-4'>
      <div class=''>
        <img class='w-10 h-10 object-cover rounded-full' src='${profile_picture}' />
      </div>
      <div class='flex flex-col gap-1'>
        <h4 class='font-semibold text-lg'>${title}</h4>
        <div class='flex gap-3 items-center'>
          <p class='text-gray-600 '>${profile_name}</p>
          ${
            verified
              ? "<img class='w-4 h-4 object-cover mt-1' src='https://img.icons8.com/?size=96&id=98A4yZTt9abw&format=png' />"
              : ""
          }
        </div>
        <span class='text-gray-600 '>${views} views</span>
      </div>
    </div>
    `;
    div.className = "";
    div.onclick = () => showCustomModal(thumbnail, description);
    videoContainer.appendChild(div);
  });
};

init();
