document.addEventListener("DOMContentLoaded", async () => {
  const root = document.querySelector("#admin-app");
  
  // Veriyi Supabase'den asenkron yükle
  let data = await KPR.load();

  const positions = ["Kaleci", "Defans", "Orta Saha", "Forvet"];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));

  function render() {
    root.innerHTML = `
      <section class="admin-card"><h2>KULÜP BİLGİLERİ</h2>
        <div class="form-grid">
          ${["name", "founded", "sponsor", "email", "phone"].map(k => `<label>${k.toUpperCase()}<input data-club="${k}" value="${esc(data.club[k])}"></label>`).join("")}
        </div>
      </section>
      <section class="admin-card"><h2>HABERLER</h2><div id="news-edit">${data.news.map((n, i) => `<div class="edit-row"><input data-news-title="${i}" value="${esc(n.title)}"><input data-news-image="${i}" value="${esc(n.image)}"></div>`).join("")}</div></section>
      <section class="admin-card"><h2>FİKSTÜR</h2><div id="fix-edit">${data.fixtures.map((f, i) => `<div class="edit-row"><input data-fix="${i}" value="${esc(f)}"></div>`).join("")}</div></section>
      <section class="admin-card"><h2>OYUNCULAR</h2><div id="player-edit">${data.players.map((p, i) => `<div class="edit-row player-edit"><input data-pname="${i}" value="${esc(p.name)}"><select data-ppos="${i}">${positions.map(x => `<option ${x === p.position ? "selected" : ""}>${x}</option>`).join("")}</select><input data-pimg="${i}" value="${esc(p.image)}"></div>`).join("")}</div></section>
      <section class="admin-card"><h2>BAŞARILAR</h2>${data.achievements.map((a, i) => `<input class="full" data-ach="${i}" value="${esc(a)}">`).join("")}</section>
      <div class="savebar">
        <button id="save">DEĞİŞİKLİKLERİ KAYDET</button>
        <button id="reset">VARSAYILANLARA DÖN</button>
        <span id="saved" style="margin-left: 10px; font-weight: bold;"></span>
      </div>`;

    document.querySelector("#save").onclick = save;
    document.querySelector("#reset").onclick = async () => {
      if (confirm("Tüm veriler varsayılan ayarlara sıfırlansın mı?")) {
        const statusSpan = document.querySelector("#saved");
        statusSpan.style.color = "#d97706";
        statusSpan.textContent = "Sıfırlanıyor...";

        const success = await KPR.save(window.DEFAULT_KPR_DATA);
        if (success) {
          data = await KPR.load();
          render();
          document.querySelector("#saved").style.color = "#059669";
          document.querySelector("#saved").textContent = "✓ Varsayılanlara dönüldü";
        } else {
          document.querySelector("#saved").style.color = "#dc2626";
          document.querySelector("#saved").textContent = "❌ Sıfırlama başarısız!";
        }
      }
    };
  }

  async function save() {
    const statusSpan = document.querySelector("#saved");
    statusSpan.style.color = "#d97706";
    statusSpan.textContent = "Kaydediliyor...";

    document.querySelectorAll("[data-club]").forEach(x => data.club[x.dataset.club] = x.value);
    document.querySelectorAll("[data-news-title]").forEach(x => data.news[x.dataset.newsTitle].title = x.value);
    document.querySelectorAll("[data-news-image]").forEach(x => data.news[x.dataset.newsImage].image = x.value);
    document.querySelectorAll("[data-fix]").forEach(x => data.fixtures[x.dataset.fix] = x.value);
    document.querySelectorAll("[data-pname]").forEach(x => data.players[x.dataset.pname].name = x.value);
    document.querySelectorAll("[data-ppos]").forEach(x => data.players[x.dataset.ppos].position = x.value);
    document.querySelectorAll("[data-pimg]").forEach(x => data.players[x.dataset.pimg].image = x.value);
    document.querySelectorAll("[data-ach]").forEach(x => data.achievements[x.dataset.ach] = x.value);

    const success = await KPR.save(data);
    if (success) {
      statusSpan.style.color = "#059669";
      statusSpan.textContent = "✓ Kaydedildi";
    } else {
      statusSpan.style.color = "#dc2626";
      statusSpan.textContent = "❌ Kayıt Başarısız!";
    }
  }

  render();
});
