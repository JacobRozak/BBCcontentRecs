let recs;
const recsResponse = fetch("/recs")
  .then((response) => response.json())
  .then((json) => {
    let allRecs = "";
    for (rec of json["BBC Recommendations Campaign"]) {
      const htmlString = `<div
      class="gel-layout__item gel-1/3@m gel-1/4@l gel-1/5@xxl nw-o-keyline nw-o-no-keyline@m RBcontainer"
      style="margin-bottom: 10px;"
      >
      <div
        class="gs-c-promo nw-c-promo gs-o-faux-block-link gs-u-pb gs-u-pb+@m nw-p-default gs-c-promo--inline gs-c-promo--stacked@m gs-c-promo--flex"
        data-entityid="newsbeat#1"
      >
        <div
          class="gs-c-promo-body gs-u-mt@m gel-1/2@xs gel-1/1@m"
        >
          <div>
            <a
              class="gs-c-promo-heading gs-o-faux-block-link__overlay-link gel-pica-bold nw-o-link-split__anchor"
              style="text-decoration: none;"
              href="${rec.url}?type=${rec.categories[0]}&id=${
        rec.id || rec.sku || rec.group_id
      }&domain=${rec.post_type}"
              data-dy-slot-id="${rec.slotId}"
              ><div
                class="gs-c-promo-image gs-u-display-none gs-u-display-block@xs gel-1/2@xs gel-1/1@m"
              >
                <div class="gs-o-media-island">
                  <div
                    class="gs-o-responsive-image gs-o-responsive-image--16by9"
                  >
                    <img
                      src="${rec.image_url}"
                      class="lazyloaded"
                      style="width:240px"
                      alt="Mo Gilligan and Reece Parkinson"
                    />
                  </div>
                </div>
              </div>
              <h3
                class="gs-c-promo-heading__title gel-pica-bold nw-o-link-split__text RBtext"
              >
                ${rec.title}
              </h3></a
            >
          </div>
        </div>
      </div>
    </div>`;
      allRecs += htmlString;
    }
    const target = document.querySelector(
      ".nw-c-5-slice.gel-layout.gel-layout--equal"
    );
    target.innerHTML = allRecs;
    // add click listeners for all elements with a data-dy-slot-id getAttribute
    document
      .querySelectorAll("[data-dy-slot-id]")
      .forEach(function (productNode) {
        productNode.addEventListener("mousedown", function () {
          var xhr = new XMLHttpRequest();
          var url = "/reportClick";
          xhr.open("POST", url);
          xhr.setRequestHeader(
            "Content-Type",
            "application/json;charset=UTF-8"
          );
          xhr.send(
            JSON.stringify({
              type: "SLOT_CLICK",
              slotId: productNode.getAttribute("data-dy-slot-id"),
            })
          );
        });
      });
  });

if (window.location.href.match("iplayer")) {
  setTimeout(() => {
    document.querySelectorAll(".RBtext").forEach((e) => {
      e.style.fontSize = "20px";
      e.style.textDecoration = "none";
      e.style.color = "#ff4c98";
    });
    document.querySelectorAll(".RBcontainer").forEach((e) => {
      e.style.marginLeft = "30px";
    });
  }, 300);
}
