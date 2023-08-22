let home = document.querySelector(".home");
let pagination = document.querySelector(".pagination");
let searchPost = document.querySelector("input");
let filterSelect = document.querySelector(".filter-select");
let darkLight = document.querySelector("nav .container p");

let search = "";
let page = 1;
let type = "";

function getCard({ name, flags, population, region, capital }) {
  return `
    <div style="border-radius: 10px;" class="home-card">
        <div class="home-card-img">
            <img style="border-top-left-radius: 10px; border-top-right-radius: 10px" src="${flags.png}" alt="">
        </div>
        <div class="home-card-info">
            <h2>${name.common}</h2>
            <p style="color: grey; margin-top:10px;">Population: ${population}</p>
            <p style="color: grey; margin-top:10px;">Region: ${region}</p>
            <p style="color: grey; margin-top:10px;">Capital: ${capital}</p>
        </div>
    </div>
    `;
}

function getCountry() {
  async function getApi() {
    try {
      let country = await customFetch(
        `https://ap-countries-api.vercel.app/all?page=${page}&limit=8`
      );
      let countrySize = await customFetch(
        "https://ap-countries-api.vercel.app/all"
      );

      home.innerHTML = "";
      country.forEach((el) => {
        home.innerHTML += getCard(el);
      });

      pagination.innerHTML = `<button onclick="getPage('-') ${
        page == 1 ? "disabled" : " "
      }"><</button>`;

      let pages = Math.ceil(countrySize.length / 8) / 2;

      for (let i = 1; i <= pages; i++) {
        pagination.innerHTML += `<button onclick="getPage(${i})" class="${
          page == i ? "active" : ""
        }">${i}</button>`;
      }

      pagination.innerHTML += `<button onclick="getPage('+')" ${
        pages == page ? "disabled" : ""
      }>></button>`;
    } catch (err) {
      console.log(err);
    } finally {
      loading = false;
    }
  }
  getApi();
}

getCountry();

function searchCountry() {
  async function getApi() {
    try {
      let searchCountry = await customFetch(
        `https://ap-countries-api.vercel.app/name/${search}?page=${page}&limit=8`
      );
      let countrySize = await customFetch(
        `https://ap-countries-api.vercel.app/name/${search}`
      );

      home.innerHTML = "";
      searchCountry.forEach((el) => {
        home.innerHTML += getCard(el);
      });

      pagination.innerHTML = "";
      let pages = Math.ceil(countrySize.length / 8) / 2;

      if (pages > 1) {
        pagination.innerHTML = `<button onclick="getSearchedPage('-') ${
          page == 1 ? "disabled" : " "
        }"><</button>`;

        for (let i = 1; i <= pages; i++) {
          pagination.innerHTML += `<button onclick="getSearchedPage(${i})" class="${
            page == i ? "active" : ""
          }">${i}</button>`;
        }

        pagination.innerHTML += `<button onclick="getSearchedPage('+')" ${
          pages == page ? "disabled" : ""
        }>></button>`;
      }
    } catch (err) {
      console.log(err);
    }
  }
  getApi();
}

function filterCountry() {
  async function getApi() {
    try {
      let country = await customFetch(
        `https://ap-countries-api.vercel.app/region/${type}?page=${page}&limit=8`
      );
      let countrySize = await customFetch(
        `https://ap-countries-api.vercel.app/region/${type}`
      );

      home.innerHTML = "";
      country.forEach((el) => {
        home.innerHTML += getCard(el);
      });

      pagination.innerHTML = `<button onclick="getPage('-') ${
        page == 1 ? "disabled" : " "
      }"><</button>`;

      let pages = Math.ceil(countrySize.length / 8) / 2;

      for (let i = 1; i <= pages; i++) {
        pagination.innerHTML += `<button onclick="getPage(${i})" class="${
          page == i ? "active" : ""
        }">${i}</button>`;
      }

      pagination.innerHTML += `<button onclick="getPage('+')" ${
        pages == page ? "disabled" : ""
      }>></button>`;
    } catch (err) {
      console.log(err);
    } finally {
      loading = false;
    }
  }
  getApi();
}

function getPage(i) {
  if (i === "+") {
    page++;
  } else if (i === "-") {
    page--;
  } else {
    page = i;
  }
  if (filterSelect.value !== "all") {
    filterCountry();
  } else {
    getCountry();
  }
}
function getSearchedPage(i) {
  if (i === "+") {
    page++;
  } else if (i === "-") {
    page--;
  } else {
    page = i;
  }
  searchCountry();
}

searchPost.addEventListener("keyup", function () {
  search = this.value;
  if (search == "") {
    getCountry();
  } else {
    filterSelect.value = "all";
    searchCountry();
  }
  page = 1;
});

filterSelect.addEventListener("change", function () {
  type = this.value;
  page = 1;
  if (type == "all") {
    getCountry();
  } else {
    filterCountry();
  }
});

darkLight.addEventListener("click", function () {
  document.body.classList.toggle("dark-light");
  this.classList.toggle("dark");
  if (this.className == "dark") {
    this.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5532 10.815C7.66857 10.815 4.51929 7.92783 4.51929 4.36821C4.51929 3.0253 4.96679 1.78158 5.73143 0.75C2.69036 1.69515 0.5 4.33122 0.5 7.43807C0.5 11.3385 3.94929 14.5 8.20357 14.5C11.5929 14.5 14.4696 12.4932 15.5 9.70452C14.375 10.4048 13.0161 10.815 11.5532 10.815Z" fill="white"/>
      </svg>
      Light Mode
        `;
  } else {
    this.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5532 11.815C8.66857 11.815 5.51929 8.92783 5.51929 5.36821C5.51929 4.0253 5.96679 2.78158 6.73143 1.75C3.69036 2.69515 1.5 5.33122 1.5 8.43807C1.5 12.3385 4.94929 15.5 9.20357 15.5C12.5929 15.5 15.4696 13.4932 16.5 10.7045C15.375 11.4048 14.0161 11.815 12.5532 11.815Z" fill="white" stroke="#111517" stroke-width="1.25"/>
      </svg>
      Dark Mode`;
    }
});
