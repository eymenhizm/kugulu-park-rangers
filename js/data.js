/* =====================================================
   KUĞULU PARK RANGERS
   SUPABASE DATA SYSTEM
===================================================== */

const SUPABASE_URL =
  "https://htzttiwasmvxibpzsdrw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_LVYwwiYI4Dn9pV2fZA7spw_2U84dC59";


/* =====================================================
   VARSAYILAN VERİ
===================================================== */

window.DEFAULT_KPR_DATA = {

  club: {
    name: "Kuğulu Park Rangers",
    founded: "2020",
    sponsor: "Picasso Kurs",
    email: "ergun060691@gmail.com",
    phone: "0552 103 8970"
  },

  achievements: [
    "Rakipbul Ankara Lig Playoff Çeyrek Final",
    "Rakipbul Ankara Sezonun En Centilmen Takımı"
  ],

  players: [
    {
      name: "Metin Berk Sağlam",
      position: "Kaleci",
      image: "assets/players/metin-berk-saglam.jpg"
    },
    {
      name: "Recep Bayındır",
      position: "Kaleci",
      image: "assets/players/recep-bayindir.jpg"
    },
    {
      name: "Ergün Çeliksoy",
      position: "Defans",
      image: "assets/players/ergun-celiksoy.jpg"
    },
    {
      name: "Suat Var",
      position: "Defans",
      image: "assets/players/suat-var.jpg"
    },
    {
      name: "Aykut Acer",
      position: "Defans",
      image: "assets/players/aykut-acer.jpg"
    },
    {
      name: "Okan Paçal",
      position: "Defans",
      image: "assets/players/okan-pacal.jpg"
    },
    {
      name: "Ferhat Çelik",
      position: "Orta Saha",
      image: "assets/players/ferhat-celik.jpg"
    },
    {
      name: "Eymen Taha Gülmez",
      position: "Orta Saha",
      image: "assets/players/eymen-taha-gulmez.jpg"
    },
    {
      name: "Ahmed Gas",
      position: "Orta Saha",
      image: "assets/players/ahmed-gas.jpg"
    },
    {
      name: "Burak Kılıç",
      position: "Forvet",
      image: "assets/players/burak-kilic.jpg"
    },
    {
      name: "Emircan Asma",
      position: "Forvet",
      image: "assets/players/emircan-asma.jpg"
    },
    {
      name: "Bulut Çetin",
      position: "Forvet",
      image: "assets/players/bulut-cetin.jpg"
    },
    {
      name: "Ahmet Fidan",
      position: "Forvet",
      image: "assets/players/ahmet-fidan.jpg"
    }
  ],

  news: [
    {
      title: "Takımımız yeni sezon hazırlıklarına başladı",
      image: "assets/news/haber-1.jpg"
    },
    {
      title: "Yeni sezon formalarımız çok yakında öngösterimde",
      image: "assets/news/haber-2.jpg"
    },
    {
      title: "Maç sonu basın toplantımız",
      image: "assets/news/haber-3.jpg"
    },
    {
      title: "Yeni transferlerimiz",
      image: "assets/news/haber-4.jpg"
    }
  ],

  fixtures: [
    "Takım 1",
    "Takım 2",
    "Takım 3"
  ],

  league: {
    status: "Yakında eklenecek"
  }

};


/* =====================================================
   YARDIMCI
===================================================== */

function cloneKPR(value) {

  return JSON.parse(
    JSON.stringify(value)
  );

}


/* =====================================================
   SUPABASE İSTEK
===================================================== */

async function supabaseRequest(
  method = "GET",
  body = null
) {

  const options = {

    method: method,

    headers: {

      "apikey": SUPABASE_KEY,

      "Authorization":
        `Bearer ${SUPABASE_KEY}`,

      "Content-Type":
        "application/json",

      "Accept":
        "application/json",

      "Prefer":
        "return=representation"

    }

  };


  if (body !== null) {

    options.body =
      JSON.stringify(body);

  }


  const response =
    await fetch(
      `${SUPABASE_URL}/rest/v1/site_data?id=eq.1`,
      options
    );


  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `Supabase ${response.status}: ${errorText}`
    );

  }


  return response;

}


/* =====================================================
   KPR DATA API
===================================================== */

window.KPR = {


  /* ===================================================
     VERİ OKU
  =================================================== */

  async load() {

    try {

      const response =
        await supabaseRequest("GET");


      const rows =
        await response.json();


      if (
        Array.isArray(rows) &&
        rows.length > 0 &&
        rows[0] &&
        rows[0].data
      ) {

        console.log(
          "✓ KPR verileri Supabase'den yüklendi."
        );


        return cloneKPR(
          rows[0].data
        );

      }


      console.warn(
        "Supabase'de site_data kaydı bulunamadı. Varsayılan veriler kullanılıyor."
      );


    } catch (error) {

      console.error(
        "Supabase verisi okunamadı:",
        error
      );

    }


    return cloneKPR(
      window.DEFAULT_KPR_DATA
    );

  },


  /* ===================================================
     VERİ KAYDET
  =================================================== */

  async save(data) {

    try {

      if (!data) {

        throw new Error(
          "Kaydedilecek veri bulunamadı."
        );

      }


      const response =
        await supabaseRequest(
          "PATCH",
          {
            data: data
          }
        );


      const rows =
        await response.json();


      if (
        !Array.isArray(rows) ||
        rows.length === 0
      ) {

        throw new Error(
          "Supabase güncelleme yaptı ancak kayıt döndürmedi."
        );

      }


      console.log(
        "✓ KPR verileri Supabase'e kaydedildi."
      );


      return true;


    } catch (error) {

      console.error(
        "Supabase kayıt hatası:",
        error
      );


      return false;

    }

  }

};


/* =====================================================
   TEST
===================================================== */

window.KPR.test =
  async function() {

    try {

      const data =
        await window.KPR.load();

      console.log(
        "✓ Supabase bağlantısı çalışıyor.",
        data
      );

      return true;

    } catch (error) {

      console.error(
        "✕ Supabase bağlantı testi başarısız:",
        error
      );

      return false;

    }

  };
