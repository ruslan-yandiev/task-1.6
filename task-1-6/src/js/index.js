import "../styles/style.scss";

// SWIPER ==========================================================
let swiperBrands;
let swiperRepair;
let swiperPricing;
let init = false;

const swiperParams = {
  slidesPerView: "auto",
  loop: true,
  spaceBetween: 16,
  direction: "horizontal",
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
};

function swiperMode() {
  if (window.matchMedia("(max-width: 767px)").matches && !init) {
    init = true;
    swiperBrands = new Swiper(".brands", swiperParams);
    swiperRepair = new Swiper(".repair", swiperParams);
    swiperPricing = new Swiper(".pricing", swiperParams);
  } else if (!window.matchMedia("(max-width: 767px)").matches && init) {
    swiperBrands.destroy();
    swiperRepair.destroy();
    swiperPricing.destroy();
    init = false;
  }
}

swiperMode();
window.matchMedia("(max-width: 767px)").addEventListener("change", swiperMode);
// ====================================================================================================
let readMoreButtons = document.querySelectorAll(".read-more");
let expandableElements = document.querySelectorAll(".expandable");

(() => {
  for (let i = 0; i < readMoreButtons.length; i++) {
    let readMoreButton = readMoreButtons[i];
    let expandableElement = expandableElements[i];
    let readMoreButtonText = readMoreButton.textContent;
    let clientHeight = expandableElement.style.maxHeight;

    let ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        let needWidth = entry.target.scrollHeight;
        entry.target.style.maxHeight = needWidth + "px";
      }
    });

    readMoreButton.addEventListener("click", function () {
      readMoreButton.classList.toggle("read-more--open");
      if (readMoreButton.classList.contains("read-more--open")) {
        ro.observe(expandableElement);
      } else {
        ro.unobserve(expandableElement);
        expandableElement.style.maxHeight = clientHeight;
      }

      readMoreButton.textContent = readMoreButton.textContent === readMoreButtonText ? "Скрыть" : readMoreButtonText;
    });
  }
})();

// ===================================================================================================
let counter = 0;
let scroll;

(() => {
  for (let modal of document.querySelectorAll(".modal")) {
    let buttons = document.querySelectorAll(modal.dataset.button);
    let modalContent = modal.firstElementChild;
    let closeButtons = modalContent.querySelectorAll(".button--type--close");

    function closeModal() {
      modal.classList.remove("modal--open");
      if (counter < 2) {
        document.documentElement.classList.remove("page--freeze");
        window.scrollTo(0, scroll);
        document.documentElement.style.top = "";
        document.documentElement.style.marginRight = "";
      }
      counter--;
    }

    if (modal.dataset.button === ".button--type--burger") {
      let dekstopMedia = window.matchMedia("(min-width: 1200px)");
      dekstopMedia.addEventListener("change", function (media) {
        if (media.matches && modal.classList.contains("modal--open")) {
          closeModal();
        }
      });
    }

    for (let button of buttons) {
      button.addEventListener("click", function () {
        let marginSize = window.innerWidth - document.documentElement.clientWidth;
        if (marginSize) {
          document.documentElement.style.marginRight = marginSize + "px";
        }
        scroll = window.pageYOffset;
        document.documentElement.style.top = -scroll + "px";
        modal.classList.add("modal--open");
        document.documentElement.classList.add("page--freeze");
        counter++;
        let input = modalContent.querySelector("input:nth-of-type(1)");
        if (input) {
          setTimeout(() => input.focus(), 400);
        }
      });
    }

    for (let button of closeButtons) {
      button.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", closeModal);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("modal--open")) {
        if (modal.dataset.button === ".button--type--burger" && counter >= 2) {
          return;
        }
        closeModal();
      }
    });

    modalContent.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
})();
