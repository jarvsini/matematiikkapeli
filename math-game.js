// Alustetaan muuttujat
let nykyinenTehtava = 0;
let nykyinenTaso = 1;
let tehtavat = [];

let palauteAjastin = null; // Ajastin 'yritä uudelleen' tekstille ja ajastin täytyy nollata, jos pelaaja klikkailee nopeasti

function aloitaPeli(taso) {
  nykyinenTaso = taso;
  nykyinenTehtava = 0;
  tehtavat = generoiTehtavat(taso);
  naytaTehtava();
  luoEdistymispallot();

  document.getElementById("aloitusnakyma").classList.add("piilossa");
  document.getElementById("pelinakyma").classList.remove("piilossa");

  avaaKokoNaytto();
}

function generoiTehtavat(taso) {
    tehtavat = []; // Tyhjennetään vanhat tehtävät
    for (let i=0; i<10; i++) {
        let luku1;
        let luku2;
        let kysymys;
        let vastaus;

        if(taso == 1) {
            luku1 = getRandomInt(1,10);
            luku2 = getRandomInt(1,10);
            kysymys = luku1 + " + " + luku2 + " = ";
            vastaus = luku1 + luku2;
        } else if (taso == 2) {
            do {
                luku1 = getRandomInt(1, 20);
                luku2 = getRandomInt(1, 20);
            } while (luku1 > 10 && luku2 > 10); // molemmat ei saa olla yli 10
        
            kysymys = luku1 + " + " + luku2 + " = ";
            vastaus = luku1 + luku2;
        } else if (taso === 3) {
            luku1 = getRandomInt(1, 10);
            luku2 = getRandomInt(0, luku1); // vähennetään pienempi isommasta
            kysymys = luku1 + " - " + luku2 + " = ";
            vastaus = luku1 - luku2;
        }

        const vaihtoehdot = luoVaihtoehdot(vastaus);
        const vihje = luoEmojiVihje(luku1, luku2, kysymys.includes("-"));

        tehtavat.push({kysymys, vastaus, vaihtoehdot, vihje});
    }
    return tehtavat;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function luoVaihtoehdot(oikea) {
    const vaihtoehdot = new Set(); // Set on kuin taulukko, mutta siihen ei voi lisätä samoja arvoja useasta
    vaihtoehdot.add(oikea);
    while (vaihtoehdot.size < 3) {
        const ehdokas = oikea + getRandomInt(-4,4); //arvotaan vaihtoehto 4 luvun sisällä oikeasta
        if (ehdokas >= 0) {
            vaihtoehdot.add(ehdokas);
        }
    }
    return Array.from(vaihtoehdot).sort(() => Math.random()-0.5); // Set muutetaan tavalliseksi taulukoksi
}

function luoEmojiVihje(luku1, luku2, onVahennys) {
    const emojit = ["🍎", "🍏", "🍌", "🍓", "🐞", "🐟", "🌼", "🦋", "🐶", "🐸"];
    const emoji = emojit[getRandomInt(0, emojit.length - 1)];
    let vihje = "";
    
    if (onVahennys) {
        const jaljelleJaavat = luku1 - luku2;
        const haaleat = luku2;

        const yhdistettySpan = `<span class="vihjekuva">
            ${emoji.repeat(jaljelleJaavat)}<span class="haalea">${emoji.repeat(haaleat)}</span>
        </span>`;

        vihje += yhdistettySpan;
      } else {
        vihje += `<span class="vihjekuva">${emoji.repeat(luku1)}</span>`;
        vihje += `<span class="vihjekuva">${emoji.repeat(luku2)}</span>`;
      }
    
      return vihje;
  }

function naytaTehtava() {
  const tehtava = tehtavat[nykyinenTehtava];
  document.getElementById("kysymys").innerText = tehtava.kysymys + " ? ";

  const vaihtoehdotDiv = document.getElementById("vastausvaihtoehdot");
  vaihtoehdotDiv.innerHTML = "";

  tehtava.vaihtoehdot.forEach((vaihtoehto) => {
    const nappi = document.createElement("button");
    nappi.innerText = vaihtoehto;
    nappi.onclick = () => tarkistaVastaus(vaihtoehto);
    vaihtoehdotDiv.appendChild(nappi); // työntää napin div-elementin sisälle
  });

  document.getElementById("vihje").classList.add("piilossa");
  document.getElementById("vihje").innerText = "";
}

function tarkistaVastaus(valittu) {
  const oikea = tehtavat[nykyinenTehtava].vastaus;
  const vaihtoehdot = document.querySelectorAll("#vastausvaihtoehdot button");  

  if (valittu === oikea) {
    paivitaPallo(nykyinenTehtava);

    // Piilotetaan vastausvaihtoehdot ja vihje ja 'yrita uudelleen'
    document.getElementById("palaute1").innerText = "";
    document.getElementById("vastausvaihtoehdot").classList.add("piilossa");
    document.getElementById("vihje-painike").classList.add("piilossa");
    document.getElementById("vihje").classList.add("piilossa");

    // Näytetään valittu vastaus kysymyksessä
    document.getElementById("kysymys").innerText = tehtavat[nykyinenTehtava].kysymys + valittu;

    // Näytä palaute ja seuraava-nappi
    document.getElementById("palaute2").classList.remove("piilossa");
    document.getElementById("seuraava-painike").classList.remove("piilossa");
    
  } else {
    vaihtoehdot.forEach(btn => {
      if (parseInt(btn.innerText) === valittu) {
        btn.disabled = true;
        btn.style.opacity = 0.3;
      }
    });
    // Nollataan aiempin ajastin, jos olemassa
    if (palauteAjastin !== null) {
      clearTimeout(palauteAjastin);
    }

    const palaute = document.getElementById("palaute1");
    palaute.innerText = "Y-ri-tä uu-del-leen!";

    palauteAjastin = setTimeout(() => {
      palaute.innerText = "";
      palauteAjastin = null; // Nollataan kun valmis
    }, 3000); // Näkyy 3 sekuntia
  }
}

function naytaVihje() {
  const vihje = tehtavat[nykyinenTehtava].vihje;
  const vihjeDiv = document.getElementById("vihje");
  vihjeDiv.innerHTML = vihje;
  vihjeDiv.classList.remove("piilossa");

  // Piilotetaan vihjenappi
  document.getElementById("vihje-painike").classList.add("piilossa");
}

function seuraavaTehtava() {
    nykyinenTehtava++;
  
    if (nykyinenTehtava < tehtavat.length) {
      naytaTehtava(); // näyttää seuraavan tehtävän
    } else {
      // jos kaikki tehtävät tehty
      voitaPeli();
    }
  
    // Piilotetaan palaute ja seuraava-nappi
    document.getElementById("palaute2").classList.add("piilossa");
    document.getElementById("seuraava-painike").classList.add("piilossa");

    // Näytetään uudelleen vastausvaihtoehdot ja vihjenappi
    document.getElementById("vastausvaihtoehdot").classList.remove("piilossa");
    document.getElementById("vihje-painike").classList.remove("piilossa");
    document.getElementById("vihje").classList.add("piilossa"); // varmuuden vuoksi piiloon
  }

function luoEdistymispallot() {
  const kontti = document.getElementById("edistyminen");
  kontti.innerHTML = "";
  for (let i = 0; i < tehtavat.length; i++) {
    const pallo = document.createElement("span");
    pallo.className = "pallo";
    pallo.id = "pallo-" + i;
    kontti.appendChild(pallo);
  }
}

function paivitaPallo(indeksi) {
  const pallo = document.getElementById("pallo-" + indeksi);
  if (pallo) {
    pallo.classList.add("aktiivinen");
  }

  if (indeksi === 4) {
    kannustaPuolivalissa();
  } else if (indeksi === 7) {
    kannustaLoppusuoralla();
  }
}

function voitaPeli() {
  document.getElementById("pelinakyma").classList.add("piilossa");
  document.getElementById("aloitusnakyma").classList.add("piilossa");
  document.getElementById("lopetusnakyma").classList.remove("piilossa");

  // konfettisade
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.4 }
      });
    }, i * 500);
  }

  // Eläinten lisääminen (ilman duplikaatteja)
  const kontti = document.getElementById("voittoelukat");
  kontti.innerHTML = ""; // tyhjennetään aiemmat

  const valitutPolut = new Set();
  while (valitutPolut.size < 3) {
    valitutPolut.add(arvoElainKuva());
  }

  valitutPolut.forEach(polku => {
    const elain = document.createElement("img");
    elain.src = polku;
    elain.className = "voittoelain";

    // Satunnainen viive ja kesto, jotta pomppivat eri tahdissa
    const delay = (Math.random() * 0.5).toFixed(2);
    const kesto = (1.0 + Math.random() * 0.6).toFixed(2);
    elain.style.animationDelay = `${delay}s`;
    elain.style.animationDuration = `${kesto}s`;

    kontti.appendChild(elain);
  });
}

// Kannustukset
const puolivaliTekstit = [
  "Puo-li-vä-li saa-vu-tet-tu!",
  "Puo-li-vä-lis-sä jo!",
  "Hie-nos-ti me-nee!",
  "Jat-ka vain!",
  "Si-nä o-saat!",
  "Jo vii-si teh-ty!",
  "Hy-vin su-juu!"
];

const loppusuoraTekstit = [
  "Mel-kein val-mis-ta!",
  "Lop-pu-suo-ra hää-möt-tää!",
  "Vain muu-ta-ma jäl-jel-lä!",
  "Tääl-lä as-ti jo!",
  "Vain kak-si jäl-jel-lä!"
];

function kannustaPuolivalissa() {
  const kuva = arvoElainKuva();
  const teksti = puolivaliTekstit[Math.floor(Math.random() * puolivaliTekstit.length)];
  naytaKannustus(kuva, teksti);
}

function kannustaLoppusuoralla() {
  const kuva = arvoElainKuva();
  const teksti = loppusuoraTekstit[Math.floor(Math.random() * loppusuoraTekstit.length)];
  naytaKannustus(kuva, teksti);
}

function arvoElainKuva() {
  const numero = String(getRandomInt(1, 18));
  return `images/${numero}.png`;
}

function naytaKannustus(kuvapolku, viestiteksti) {
  const container = document.getElementById("kannustusviesti");
  const teksti = document.getElementById("kannustus-teksti");
  const elain = document.getElementById("kannustus-elain");

  elain.src = kuvapolku;
  teksti.innerText = viestiteksti;
  
  container.classList.remove("piilossa", "kannustus-poistuu");
  container.classList.add("kannustus-saapuu");

  // Pakotetaan reflow (välttämätön joidenkin selainten kanssa)
  void container.offsetWidth;

  container.classList.remove("kannustus-saapuu");
  container.classList.add("kannustus-nakyvissa");
  
  function piilotaKannustus() {
    container.classList.remove("kannustus-nakyvissa");
    container.classList.add("kannustus-poistuu");

    // Poistetaan näkyvistä, kun animaatio loppuu
    setTimeout(() => {
      container.classList.add("piilossa");
      container.classList.remove("kannustus-poistuu");
    }, 1600);

    document.removeEventListener("click", piilotaKannustus);
  }

  // piilotus käynnistyy, kun klikataan mitä tahansa
  setTimeout(() => {
    document.addEventListener("click", piilotaKannustus);
  }, 100); // pieni viive, jotta alkuperäinen klik ei heti piilota  

}

// Koko näytöllä pelaaminen
const elem = document.documentElement;

function avaaKokoNaytto() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }

  // Vaihdetaan napit
  document.getElementById("avaa-koko-naytto").classList.add("piilossa");
  document.getElementById("sulje-koko-naytto").classList.remove("piilossa");
}

function suljeKokoNaytto() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}
  
document.addEventListener("fullscreenchange", paivitaKokoNayttoNapit); //Chrome, Edge
document.addEventListener("webkitfullscreenchange", paivitaKokoNayttoNapit); // Safari
document.addEventListener("mozfullscreenchange", paivitaKokoNayttoNapit); // Firefox
document.addEventListener("MSFullscreenChange", paivitaKokoNayttoNapit); // IE/Edge

function paivitaKokoNayttoNapit() {
  const onKokoNaytto = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

  const avaa = document.getElementById("avaa-koko-naytto");
  const sulje = document.getElementById("sulje-koko-naytto");

  if (onKokoNaytto) {
    avaa.classList.add("piilossa");
    sulje.classList.remove("piilossa");
  } else {
    avaa.classList.remove("piilossa");
    sulje.classList.add("piilossa");
  }
}