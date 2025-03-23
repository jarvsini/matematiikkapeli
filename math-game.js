// Alustetaan muuttujat
let nykyinenTehtava = 0;
let nykyinenTaso = 1;
let tehtavat = [];

function aloitaPeli(taso) {
  nykyinenTaso = taso;
  nykyinenTehtava = 0;
  tehtavat = generoiTehtavat(taso);
  naytaTehtava();
  luoEdistymispallot();

  document.getElementById("aloitusnakyma").classList.add("piilossa");
  document.getElementById("pelinakyma").classList.remove("piilossa");
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

    // Piilotetaan vastausvaihtoehdot ja vihje
    document.getElementById("vastausvaihtoehdot").classList.add("piilossa");
    document.getElementById("vihje-painike").classList.add("piilossa");
    document.getElementById("vihje").classList.add("piilossa");

    // Näytetään valittu vastaus kysymyksessä
    document.getElementById("kysymys").innerText = tehtavat[nykyinenTehtava].kysymys + valittu;

    // Näytä palaute ja seuraava-nappi
    document.getElementById("palaute").innerText = "HY-VÄ!";
    document.getElementById("seuraava-painike").classList.remove("piilossa");
    
  } else {
    vaihtoehdot.forEach(btn => {
      if (parseInt(btn.innerText) === valittu) {
        btn.disabled = true;
        btn.style.opacity = 0.5;
      }
    });
    const palaute = document.getElementById("palaute");
    palaute.innerText = "Y-ri-tä uu-del-leen!";
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
      document.getElementById("pelinakyma").classList.add("piilossa");
      document.getElementById("lopetusnakyma").classList.remove("piilossa");
    }
  
    // Piilotetaan palaute ja seuraava-nappi
    document.getElementById("palaute").innerText = "";
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
}

function toggleKokoNaytto() {
    const elem = document.documentElement;
    const ikoni = document.getElementById("fullscreen-ikoni");
  
    if (!document.fullscreenElement) {
      // Mennään koko näyttöön
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
      ikoni.innerText = "fullscreen_exit"; // Vaihda kuvake
    } else {
      // Poistutaan koko näytöstä
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      ikoni.innerText = "fullscreen"; // Vaihda kuvake takaisin
    }
  }

  function toggleFullScreen() {
    const elem = document.documentElement;
    const ikoni = document.getElementById("fullscreen-ikoni");
  
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
      
      // Mennään koko näyttöön
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(); // Safari
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen(); // IE11
      }
  
      ikoni.innerText = "close_fullscreen";
    } else {
      // Poistutaan koko näytöstä
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); // Safari
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); // IE11
      }
  
      ikoni.innerText = "open_in_full";
    }
  }
  
// kuunnellaan jos koko naytto suljetaan escillä:
document.addEventListener("fullscreenchange", paivitaIkoni);
document.addEventListener("webkitfullscreenchange", paivitaIkoni); // Safari
document.addEventListener("msfullscreenchange", paivitaIkoni); // IE

function paivitaIkoni() {
  const ikoni = document.getElementById("fullscreen-ikoni");
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  ) {
    ikoni.innerText = "close_fullscreen";
  } else {
    ikoni.innerText = "open_in_full";
  }
}

// näytetään ikonot vasta kun fontti on ladattu
document.fonts.ready.then(function () {
  document.body.classList.add('font-ready');
});