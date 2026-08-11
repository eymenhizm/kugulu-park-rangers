document.addEventListener("DOMContentLoaded", async () => {

  const data = await KPR.load();

  const $ = selector => document.querySelector(selector);

  const esc = value =>
    String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));


  /* =====================================================
     HABERLER
     ===================================================== */

  const news = $("#news-grid");

  if (news) {

    news.innerHTML = "";

    data.news.forEach((n, i) => {

      news.insertAdjacentHTML("beforeend", `

        <article
          class="news-card ${i === 0 ? "featured" : ""}"
          data-news-id="${i}"
          role="link"
          tabindex="0"
          style="cursor:pointer"
        >

          <div class="news-img">

            ${
              n.image
                ? `
                  <img
                    src="${esc(n.image)}"
                    alt="${esc(n.title)}"
                    loading="lazy"
                  >
                `
                : ""
            }

          </div>

          <div class="news-overlay">

            <span>
              ${esc(n.tag || "HABER")}
            </span>

            <h3>
              ${esc(n.title)}
            </h3>

            <b>
              DEVAMI →
            </b>

          </div>

        </article>

      `);

    });


    /*
      Haber kartlarına tıklama

      Örnek:
      İlk haber  → haber.html?id=0
      İkinci     → haber.html?id=1
      Üçüncü     → haber.html?id=2
    */

    document.querySelectorAll("[data-news-id]").forEach(card => {

      const openNews = () => {

        const id = card.dataset.newsId;

        window.location.href = `haber.html?id=${id}`;

      };


      card.addEventListener("click", openNews);


      /*
        Klavyeden Enter ile de açılabilsin
      */

      card.addEventListener("keydown", event => {

        if (event.key === "Enter" || event.key === " ") {

          event.preventDefault();

          openNews();

        }

      });

    });

  }


  /* =====================================================
     FİKSTÜR
     ===================================================== */

  const fixtures = $("#fixtures");

  if (fixtures) {

    fixtures.innerHTML = "";

    data.fixtures.forEach((f, i) => {

      fixtures.insertAdjacentHTML("beforeend", `

        <article class="fixture">

          <span>
            MAÇ ${i + 1}
          </span>

          <div class="fixture-teams">

            <b>
              KUĞULU PARK<br>
              RANGERS
            </b>

            <i>
              VS
            </i>

            <b>
              ${esc(f)}
            </b>

          </div>

          <small>
            Fikstür bilgisi
          </small>

        </article>

      `);

    });

  }


  /* =====================================================
     TAKIM / OYUNCULAR
     ===================================================== */

  const squads = $("#squads");

  if (squads) {

    squads.innerHTML = "";

    const positions = [
      "Kaleci",
      "Defans",
      "Orta Saha",
      "Forvet"
    ];

    positions.forEach(pos => {

      const list =
        data.players.filter(
          player => player.position === pos
        );

      if (!list.length) return;


      squads.insertAdjacentHTML("beforeend", `

        <div class="squad-block">

          <div class="squad-head">

            <h3>
              ${esc(pos.toUpperCase())}
            </h3>

            <span>
              ${list.length} OYUNCU
            </span>

          </div>


          <div class="player-grid">

            ${
              list.map(player => `

                <article class="player">

                  <div class="player-photo">

                    ${
                      player.image
                        ? `
                          <img
                            src="${esc(player.image)}"
                            alt="${esc(player.name)}"
                            loading="lazy"
                          >
                        `
                        : ""
                    }

                  </div>


                  <div class="player-info">

                    <span>
                      ${esc(player.position)}
                    </span>

                    <h4>
                      ${esc(player.name)}
                    </h4>

                  </div>

                </article>

              `).join("")
            }

          </div>

        </div>

      `);

    });

  }


  /* =====================================================
     BAŞARILAR
     ===================================================== */

  const achievements = $("#achievements");

  if (achievements) {

    achievements.innerHTML =
      data.achievements.map((achievement, i) => `

        <article class="achievement">

          <span>
            ${String(i + 1).padStart(2, "0")}
          </span>

          <div>

            <b>
              BAŞARI
            </b>

            <h3>
              ${esc(achievement)}
            </h3>

          </div>

        </article>

      `).join("");

  }


  /* =====================================================
     MOBİL MENÜ
     ===================================================== */

  const menuButton = $(".menu-toggle");

  const menu = document.querySelector(".menu");

  if (menuButton && menu) {

    menuButton.addEventListener("click", () => {

      menu.classList.toggle("open");

    });

  }

});
