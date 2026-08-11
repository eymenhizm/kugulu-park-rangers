document.addEventListener("DOMContentLoaded", () => {
  const data = KPR.load();

  const $ = s => document.querySelector(s);

  const esc = s =>
    String(s ?? "").replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[c]));

  /* =========================
     HABERLER
  ========================= */

  const news = $("#news-grid");

  if (news) {
    data.news.forEach((n, i) => {

      news.insertAdjacentHTML(
        "beforeend",

        `<article class="news-card ${i === 0 ? "featured" : ""}" data-news-id="${i}">
          <div class="news-img">
            ${n.image ? `<img src="${esc(n.image)}" alt="${esc(n.title)}">` : ""}
          </div>

          <div class="news-overlay">
            <span>${esc(n.tag || "HABER")}</span>
            <h3>${esc(n.title)}</h3>
            <b>DEVAMI →</b>
          </div>
        </article>`
      );
    });

    /* Habere tıklayınca detay sayfasına git */
    document.querySelectorAll(".news-card").forEach(card => {

      card.addEventListener("click", () => {

        const id = card.dataset.newsId;

        window.location.href = `haber.html?id=${id}`;

      });

    });
  }


  /* =========================
     FİKSTÜR
  ========================= */

  const fixtures = $("#fixtures");

  if (fixtures) {

    data.fixtures.forEach((f, i) => {

      fixtures.insertAdjacentHTML(
        "beforeend",

        `<article class="fixture">
          <span>MAÇ ${i + 1}</span>

          <div class="fixture-teams">
            <b>KUĞULU PARK<br>RANGERS</b>
            <i>VS</i>
            <b>${esc(f)}</b>
          </div>

          <small>Fikstür bilgisi</small>
        </article>`
      );

    });

  }


  /* =========================
     TAKIM
  ========================= */

  const squads = $("#squads");

  if (squads) {

    ["Kaleci", "Defans", "Orta Saha", "Forvet"].forEach(pos => {

      const list = data.players.filter(
        p => p.position === pos
      );

      if (!list.length) return;

      squads.insertAdjacentHTML(
        "beforeend",

        `<div class="squad-block">

          <div class="squad-head">
            <h3>${pos.toUpperCase()}</h3>
            <span>${list.length} OYUNCU</span>
          </div>

          <div class="player-grid">

            ${list.map(p => `

              <article class="player">

                <div class="player-photo">
                  ${
                    p.image
                      ? `<img src="${esc(p.image)}" alt="${esc(p.name)}">`
                      : ""
                  }
                </div>

                <div class="player-info">
                  <span>${esc(p.position)}</span>
                  <h4>${esc(p.name)}</h4>
                </div>

              </article>

            `).join("")}

          </div>

        </div>`
      );

    });

  }


  /* =========================
     BAŞARILAR
  ========================= */

  const achievements = $("#achievements");

  if (achievements) {

    achievements.innerHTML = data.achievements
      .map(
        (a, i) => `

        <article class="achievement">

          <span>0${i + 1}</span>

          <div>
            <b>BAŞARI</b>
            <h3>${esc(a)}</h3>
          </div>

        </article>

      `
      )
      .join("");

  }


  /* =========================
     MOBİL MENÜ
  ========================= */

  $(".menu-toggle")?.addEventListener(
    "click",
    () => {

      document
        .querySelector(".menu")
        .classList.toggle("open");

    }
  );

});
