/**
 * @return {HTMLElement | undefined}
 */
function $(selector) {
  if (selector[0] === "#")
    return document.getElementById(selector.replace("#", ""));
  return document.querySelector(selector);
}

/**
 * @return {NodeListOf<HTMLElement>| undefined}
 */
function $$(selectors) {
  return document.querySelectorAll(selectors);
}

window.addEventListener("DOMContentLoaded ", init());

function init() {
  const gallery$ = $("#gallery");

  gallery$.classList.add("gallery--active");

  // Variables

  const galleryItems$ = $$(".gallery_item"),
    galleryCaptionDownload$ = $$(".gallery_caption_download");

  const lightbox$ = $("#lightbox"),
    lightboxClose$ = $("#lightbox_close"),
    lightboxSlider$ = $("#lightbox_slider"),
    lightboxSlideNav$ = $("#lightbox_slider_nav"),
    lightboxFullscreen$ = $("#lightbox_fullscreen"),
    lightboxDownload$ = $("#lightbox_download"),
    lightboxBotton$ = $("#lightbox_botton"),
    lightboxToolbarCounter$ = $("#lightbox_toolbar_current"),
    lightboxToolbarAll$ = $("#lightbox_toolbar_all");

  /**
   * guarda las descripciones (data-descripcion) de todo las imagenes
   * @type {Array<string>}
   */
  const lightboxTextDescripcions = [];
  /**
   * guarada la ruta (data-image) de  todas las imagenes
   * @type {Array<string>}
   */
  const lightboxUrlImages = [];
  let positionItem = 0;
  let lightboxActive = false;

  galleryItems$.forEach((element, index) => {
    const urlImage = element.querySelector(".gallery_caption img").src;
    const description = element.querySelector(".gallery_descripcion").innerText;

    element.setAttribute("data-image", urlImage);
    element.setAttribute("data-descripcion", description);

    lightboxUrlImages.push(urlImage);
    lightboxTextDescripcions.push(description);

    galleryCaptionDownload$[index].href = urlImage; // guarda la ruta de imagen
    lightboxDownload$.setAttribute("download", "image name");

    // Event click
    element.addEventListener("click", () => {
      positionItem = index;
      lightboxActive = true; //
      lightboxDownload$.href = lightboxUrlImages[positionItem]; // guarda la ruta actual de la imagen en (href)
      lightboxDownload$.setAttribute("download", "image name");

      for (let f = positionItem; f < lightboxUrlImages.length; f++) {
        if (f === positionItem) {
          lightboxSlideNav$.append(templateString(f));
          document
            .querySelector(".lightbox_slider_item")
            .classList.add("lightbox_slider_item--active");
        } else lightboxSlideNav$.append(templateString(f));

        if (f === lightboxUrlImages.length - 1) {
          for (let x = 0; x < positionItem; x++)
            lightboxSlideNav$.append(templateString(x));
        }
      }

      const lightbox_slider_item = $$(".lightbox_slider_item"),
        itemLength = lightbox_slider_item.length;

      lightboxSlideNav$.style.width = `${100 * lightbox_slider_item.length}%`;

      // inserta la ultima imagen antes de la primera imagen
      // contenedor se mueve a la izquierda -100%
      if (itemLength > 1) {
        lightboxSlideNav$.insertBefore(
          lightbox_slider_item[itemLength - 1],
          lightbox_slider_item[0]
        );
        lightboxSlideNav$.style.marginLeft = "-100%";
      }

      lightboxToolbarCounter$.textContent = positionItem + 1;
      lightboxToolbarAll$.textContent = itemLength;

      lightbox$.classList.add("lightbox--active"); // muesta el lightbox

      setTimeout(() => {
        lightboxSlider$.classList.add("lightbox_slider--active");
        itemLength > 1
          ? lightboxBotton$.classList.add("lightbox_botton--active")
          : "";
      }, 1000);

      document
        .querySelectorAll(".lightbox-image_item")
        [positionItem].classList.add("lightbox-image_item--active");
    });
  });

  // función para crear elemento (li.lightbox_slider_item)
  const templateString = (index) => {
    const elm = document.createElement("li"),
      template = `<figure class="lightbox_slider_figure">
                        <img src="${lightboxUrlImages[index]}" alt="">
                        <figcaption>
                            <p class="lightbox_slider_descripcion">${lightboxTextDescripcions[index]}</p>
                        </figcaption>
                      </figure>`;

    elm.classList.add("lightbox_slider_item");
    elm.innerHTML = template;

    return elm;
  };

  // función para cerrar lightbox

  const lightboxClose = () => {
    const lightbox_slider_item = $$(".lightbox_slider_item"),
      lightbox_image_item = $$(".lightbox-image_item");

    lightbox$.classList.remove("lightbox--active"); // oculta el lightbox
    lightboxSlider$.classList.remove("lightbox_slider--active");
    lightboxBotton$.classList.remove("lightbox_botton--active");

    lightbox_image_item[positionItem].classList.remove(
      "lightbox-image_item--active"
    );
    lightboxImage$.classList.remove("lightbox-image--active");
    lightboxImage$.style.bottom = `-${lightboxImage$.clientHeight}px`;

    // lightboxActive = false;
    toggleImage = true;

    setTimeout(() => {
      for (const item of lightbox_slider_item) {
        item.remove();
      }
    }, 500);
  };

  lightboxClose$.addEventListener("click", () => lightboxClose());

  lightbox$.addEventListener("click", (e) =>
    e.target.id === "lightbox" ? lightboxClose() : ""
  );

  // evento click lightbox_fullscreen

  let toggleFullscreen = true;

  document.addEventListener("fullscreenchange", (e) => {
    let pahtImg = "";

    if (document.fullscreenElement) {
      pahtImg = "./image/icons/icon_normal_screen.png";
      toggleFullscreen = false;
    } else {
      toggleFullscreen = true;
      pahtImg = "./image/icons/icon_full_screen.png";
    }

    lightboxFullscreen$.children[0].attributes.src.textContent = pahtImg;
  });

  lightboxFullscreen$.addEventListener("click", () => {
    const element = document.documentElement;

    if (toggleFullscreen) {
      if (element.requestFullScreen) {
        element.requestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }

    toggleFullscreen = !toggleFullscreen;
  });

  // lightbox_botton_prev | lightbox_botton_next

  const lightbox_botton_prev = $("#lightbox_botton-left"),
    lightbox_botton_next = $("#lightbox_botton-right");

  // función lightboxNext
  let flatNext = true;
  const lightboxNext = () => {
    if (!flatNext) return false;

    flatNext = false;
    const lightbox_slider_item = $$(".lightbox_slider_item"),
      itemLength = lightbox_slider_item.length - 1,
      lightbox_image_item = $$(".lightbox-image_item");

    lightboxSlideNav$.classList.add("lightbox_slider_nav--ani");
    lightboxSlideNav$.style.marginLeft = "-200%";

    if (positionItem === itemLength) {
      lightbox_image_item[itemLength].classList.remove(
        "lightbox-image_item--active"
      );
      lightbox_image_item[0].classList.add("lightbox-image_item--active");
      positionItem = 0;
    } else {
      lightbox_image_item[positionItem].classList.remove(
        "lightbox-image_item--active"
      );
      lightbox_image_item[positionItem + 1].classList.add(
        "lightbox-image_item--active"
      );
      positionItem++;
    }

    lightbox_slider_item[1].classList.remove("lightbox_slider_item--active");
    lightbox_slider_item[2].classList.add("lightbox_slider_item--active");

    lightboxToolbarCounter$.textContent = positionItem + 1;
    lightboxDownload$.href = lightboxUrlImages[positionItem];
    lightboxDownload$.setAttribute(
      "download",
      lightboxTextDescripcions[positionItem]
    );

    setTimeout(() => {
      lightboxSlideNav$.classList.remove("lightbox_slider_nav--ani");

      lightboxSlideNav$.append(lightbox_slider_item[0]);

      lightboxSlideNav$.style.marginLeft = "-100%";
      flatNext = true;
    }, 1000);
  };

  // función lightboxPrev
  let flatPrev = true;
  let lightboxPrev = () => {
    if (!flatPrev) return false;

    flatPrev = false;

    const lightbox_slider_item = $$(".lightbox_slider_item"),
      itemLength = lightbox_slider_item.length - 1,
      lightbox_image_item = $$(".lightbox-image_item");

    lightboxSlideNav$.classList.add("lightbox_slider_nav--ani");
    lightboxSlideNav$.style.marginLeft = "0%";

    if (positionItem === 0) {
      lightbox_image_item[positionItem].classList.remove(
        "lightbox-image_item--active"
      );
      lightbox_image_item[itemLength].classList.add(
        "lightbox-image_item--active"
      );
      positionItem = itemLength;
    } else {
      lightbox_image_item[positionItem].classList.remove(
        "lightbox-image_item--active"
      );
      lightbox_image_item[positionItem - 1].classList.add(
        "lightbox-image_item--active"
      );
      positionItem--;
    }

    lightbox_slider_item[1].classList.remove("lightbox_slider_item--active");
    lightbox_slider_item[0].classList.add("lightbox_slider_item--active");

    lightboxToolbarCounter$.textContent = positionItem + 1;
    lightboxDownload$.href.textContent = lightboxUrlImages[positionItem];

    setTimeout(() => {
      lightboxSlideNav$.classList.remove("lightbox_slider_nav--ani");

      lightboxSlideNav$.insertBefore(
        lightbox_slider_item[itemLength],
        lightbox_slider_item[0]
      );

      lightboxSlideNav$.style.marginLeft = "-100%";

      flatPrev = true;
    }, 1000);
  };

  lightbox_botton_prev.addEventListener("click", () => lightboxPrev());
  lightbox_botton_next.addEventListener("click", () => lightboxNext());

  const lightboxImage$ = $("#lightbox-image"),
    lightboxImageNav$ = $("#lightbox-image_nav"),
    lightboxImageToggle$ = $("#lightbox-image_toggle");

  // crea elemtos (figure) de forma dinamica, para mostrar (lightbox_image_nav)

  for (const img of lightboxUrlImages) {
    const elem = document.createElement("figure");
    elem.classList.add("lightbox-image_item");
    elem.innerHTML = `<img src="${img}" alt="" srcset="">`;
    lightboxImageNav$.append(elem);
  }

  let toggleImage = true; // variable para mostrar/ocultar lightbox_image
  lightboxImage$.style.bottom = `-${lightboxImage$.clientHeight}px`; // oculta lightbox_image

  window.addEventListener("resize", () => {
    lightboxImage$.style.bottom = `-${lightboxImage$.clientHeight}px`;
    lightboxImage$.classList.toggle("lightbox-image--active");
    toggleImage = !toggleImage;
  });

  // lightbox_image_toggle

  lightboxImageToggle$.addEventListener("click", () => {
    toggleImage
      ? (lightboxImage$.style.bottom = "0")
      : (lightboxImage$.style.bottom = `-${lightboxImage$.clientHeight}px`);
    toggleImage = !toggleImage;

    lightboxImage$.classList.toggle("lightbox-image--active");
  });

  // lightbox - eventos de teclados

  document.addEventListener("keyup", (e) => {
    if (lightboxActive) {
      // esc
      if (e.key === "Escape") lightboxClose();
      // prev
      if (e.key === "ArrowLeft") lightboxPrev();
      // next
      if (e.key === "ArrowRight") lightboxNext();
      // dow
      if (e.key === "ArrowUp") {
        lightboxImage$.classList.add("lightbox-image--active");
        lightboxImage$.style.bottom = "0"; // muestra lightbox_image
        toggleImage = false;
      }
      // up
      if (e.key === "ArrowDown") {
        lightboxImage$.classList.remove("lightbox-image--active");
        lightboxImage$.style.bottom = `-${lightboxImage$.clientHeight}px`; // oculta lightbox_image
        toggleImage = true;
      }
    }
  });
}
