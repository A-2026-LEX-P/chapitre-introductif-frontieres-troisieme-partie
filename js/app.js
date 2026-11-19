"use strict";

/* ==========================================
   GÉO LAB
   Première – Géographie
   Application pédagogique autonome
   ========================================== */

const STORAGE_KEY = "geo-lab-v3-progress";

const $ = id => document.getElementById(id);

const state = {
  day: 0,
  completed: [],
  tasks: {},
  sortAnswers: {},
  truthAnswers: {},
  selfChecks: {},
  mapVisited: [],
  figuresSeen: [],
  writing: "",
  map: null
};

/* ==========================================
   DONNÉES DES ÉTUDES DE CAS
   ========================================== */

const places = [
  {
    id: "coree",
    name: "Corée du Nord – Corée du Sud",
    coords: [37.95, 126.67],
    category: "militaire",
    image: "images/coree.jpg",
    description: "La frontière coréenne sépare deux États issus de la division de la péninsule après 1945. Après la guerre de Corée (1950-1953), l'armistice établit une ligne de démarcation militaire et une zone démilitarisée (DMZ). Cette zone est paradoxalement très surveillée et entourée de dispositifs militaires.",
    objective: "Séparation entre deux systèmes politiques opposés et fonction militaire et défensive.",
    earth: "Korean Demilitarized Zone Panmunjom"
  },
  {
    id: "cachemire",
    name: "Inde – Pakistan (Cachemire)",
    coords: [34.15, 74.90],
    category: "militaire",
    image: "images/cachemire.jpg",
    description: "Dans la région du Cachemire, la Ligne de contrôle sépare les zones contrôlées par l'Inde et le Pakistan. La présence militaire, les clôtures et les dispositifs de surveillance traduisent les tensions durables entre les deux États.",
    objective: "Contrôle d'un territoire contesté et affirmation de la souveraineté.",
    earth: "Line of Control Kashmir India Pakistan"
  },
  {
    id: "chypre",
    name: "Chypre – Zone tampon",
    coords: [35.17, 33.36],
    category: "militaire",
    image: "images/chypre.jpg",
    description: "Depuis 1974, une zone tampon contrôlée par la Force des Nations unies chargée du maintien de la paix à Chypre sépare le nord et le sud de l'île, notamment dans la capitale Nicosie.",
    objective: "Séparation territoriale et politique durable sous surveillance internationale.",
    earth: "Green Line Nicosia Cyprus"
  },
  {
    id: "ukraine",
    name: "Russie – Ukraine",
    coords: [48.25, 38.05],
    category: "militaire",
    image: "images/ukraine.jpg",
    description: "La frontière s'est durcie après 2014, puis de façon majeure depuis l'invasion russe à grande échelle de février 2022. Une frontière auparavant marquée par les échanges est devenue une ligne de séparation et d'affrontement.",
    objective: "Conflit armé, affrontement géopolitique et fonction militaire.",
    earth: "Ukraine Russia border Donetsk"
  },
  {
    id: "israel",
    name: "Israël – Cisjordanie",
    coords: [31.85, 35.15],
    category: "militaire",
    image: "images/israel.jpg",
    description: "La barrière construite à partir de 2002 est présentée par Israël comme un dispositif de sécurité. Son tracé et ses effets sur les populations palestiniennes, les déplacements et les territoires sont fortement contestés. Elle s'inscrit dans un contexte d'occupation et de colonisation de la Cisjordanie.",
    objective: "Séparation, contrôle des populations et enjeu territorial.",
    earth: "West Bank separation barrier"
  },
  {
    id: "mexique",
    name: "États-Unis – Mexique",
    coords: [31.75, -106.45],
    category: "filtrage",
    image: "images/mexique.jpg",
    description: "La construction de barrières débute en 1994, année de l'entrée en vigueur de l'ALENA. Elles visent notamment à contrôler les migrations et certains franchissements. Cette frontière illustre la coexistence entre intensification des échanges et contrôle des déplacements.",
    objective: "Contrôle et filtrage des flux migratoires.",
    earth: "United States Mexico border El Paso"
  },
  {
    id: "bangladesh",
    name: "Inde – Bangladesh",
    coords: [25.00, 88.00],
    category: "filtrage",
    image: "images/bangladesh.jpg",
    description: "Une longue barrière frontalière, d'environ 3 200 km selon le cours, vise à contrôler les passages entre les deux pays.",
    objective: "Contrôle des déplacements et des franchissements transfrontaliers.",
    earth: "India Bangladesh border fence"
  },
  {
    id: "botswana",
    name: "Botswana – Zimbabwe",
    coords: [-21.00, 27.00],
    category: "filtrage",
    image: "images/botswana.jpg",
    description: "Le Botswana construit en 2003 une clôture d'environ 500 km pour limiter l'immigration depuis le Zimbabwe.",
    objective: "Limitation de certains flux migratoires.",
    earth: "Botswana Zimbabwe border fence"
  }
];

/* ==========================================
   SAUVEGARDE DE LA PROGRESSION
   ========================================== */

function loadProgress() {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );

    state.completed = data.completed || [];
    state.tasks = data.tasks || {};
    state.sortAnswers = data.sortAnswers || {};
    state.truthAnswers = data.truthAnswers || {};
    state.selfChecks = data.selfChecks || {};
    state.mapVisited = data.mapVisited || [];
    state.figuresSeen = data.figuresSeen || [];
    state.writing = data.writing || "";

  } catch (error) {
    console.warn("Sauvegarde illisible :", error);
  }
}

function saveProgress() {
  const data = {
    completed: state.completed,
    tasks: state.tasks,
    sortAnswers: state.sortAnswers,
    truthAnswers: state.truthAnswers,
    selfChecks: state.selfChecks,
    mapVisited: state.mapVisited,
    figuresSeen: state.figuresSeen,
    writing: state.writing
  };

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.warn("Sauvegarde impossible :", error);
  }

  updateProgress();
}

function markTask(task) {
  state.tasks[task] = true;
  saveProgress();
}

/* ==========================================
   PROGRESSION GÉNÉRALE
   ========================================== */

function updateProgress() {
  const count = state.completed.length;

  $("progressCount").textContent = count + " / 3";

  $("progressFill").style.width =
    (count / 3 * 100) + "%";

  $("progressMessage").textContent =
    count === 3
      ? "Félicitations ! Tu as terminé les trois missions."
      : "Encore " + (3 - count) +
        " mission(s) pour terminer ton parcours.";

  document.querySelectorAll(".day-button").forEach(
    (button, index) => {

      button.classList.toggle(
        "active",
        index === state.day
      );

      button.classList.toggle(
        "done",
        state.completed.includes(index)
      );

      const status = $("status" + index);

      if (status) {
        status.textContent =
          state.completed.includes(index)
            ? "✓ Mission terminée"
            : "À découvrir";
      }
    }
  );

  if (count === 3) {
    renderReport();
  } else {
    $("finalReport").classList.add("hidden");
  }
}

/* ==========================================
   NAVIGATION
   ========================================== */

function goToDay(day) {
  if (day < 0 || day > 2) return;

  state.day = day;

  renderMission();

  window.scrollTo({
    top: $("missionContent").offsetTop - 20,
    behavior: "smooth"
  });
}

document.querySelectorAll(".day-button").forEach(
  button => {
    button.addEventListener("click", () => {
      goToDay(Number(button.dataset.day));
    });
  }
);

$("startButton").addEventListener("click", () => {
  goToDay(0);
});

/* ==========================================
   COMPOSANTS HTML
   ========================================== */

function card(title, content) {
  return `
    <section class="card">
      <h3>${title}</h3>
      ${content}
    </section>
  `;
}

function missionHeader(number, title, description) {
  return `
    <section class="card">
      <div class="eyebrow">
        MISSION 0${number} · 10 MINUTES
      </div>

      <h2>${title}</h2>

      <p class="muted">${description}</p>
    </section>
  `;
}

function button(label, action, style = "btn-secondary") {
  return `
    <button class="btn ${style}"
      data-action="${action}">
      ${label}
    </button>
  `;
}

function imageBlock(src, alt, caption = "") {
  return `
    <figure class="visual">
      <img
        src="${src}"
        alt="${alt}"
        loading="lazy"
        style="width:100%;max-height:290px;object-fit:cover;border-radius:10px"
        onerror="this.style.display='none'"
      >

      ${caption
        ? `<figcaption class="small muted">${caption}</figcaption>`
        : ""}
    </figure>
  `;
}

/* ==========================================
   DONNÉES DES QUIZ
   ========================================== */

function getQuizData(id) {
  const data = {
    d1q1: {
      correct: 1,
      explanation:
        "La barriérisation vise à contrôler, sélectionner ou empêcher certains franchissements."
    },

    d1q2: {
      correct: 0,
      explanation:
        "Les caméras, capteurs, radars et drones sont des dispositifs technologiques."
    },

    d1q3: {
      correct: 1,
      explanation:
        "Michel Foucher publie Le retour des frontières en 2016."
    },

    d1q4: {
      correct: 1,
      explanation:
        "Les frontières conservent un rôle essentiel malgré l'intensification des échanges mondiaux."
    },

    d2q1: {
      correct: 1,
      explanation:
        "Une frontière chaude est une frontière marquée par des tensions ou des conflits."
    }
  };

  return data[id] || null;
}

/* ==========================================
   AFFICHAGE DES QUIZ
   ========================================== */

function quiz(id, title, options, correct, explanation) {
  const previous = state.tasks[id];

  return `
    <div class="quiz-block" data-quiz="${id}">

      <div class="question">${title}</div>

      <div class="options">

        ${options.map((option, index) => `
          <button
            class="option ${previous && index === correct ? "correct" : ""}"
            data-action="answer"
            data-id="${id}"
            data-choice="${index}"
            ${previous ? "disabled" : ""}
          >
            ${option}
          </button>
        `).join("")}

      </div>

      <div class="feedback ${previous ? "good" : "hidden"}"
        id="feedback-${id}">
        ${previous ? explanation : ""}
      </div>

    </div>
  `;
}

/* ==========================================
   CORRECTION DES QUIZ
   ========================================== */

function answerQuiz(id, choice, correct, explanation, parent) {
  if (state.tasks[id]) return;

  const isCorrect = choice === correct;

  const options = parent.querySelectorAll(".option");

  options.forEach((button, index) => {
    button.disabled = isCorrect;

    if (isCorrect && index === correct) {
      button.classList.add("correct");
    }
  });

  if (!isCorrect) {
    options[choice].classList.add("wrong");

    setTimeout(() => {
      options.forEach(button => {
        button.disabled = false;
        button.classList.remove("wrong");
      });
    }, 1200);
  }

  const feedback = parent.querySelector(".feedback");

  feedback.classList.remove("hidden");
  feedback.classList.toggle("good", isCorrect);
  feedback.classList.toggle("bad", !isCorrect);

  feedback.innerHTML = `
    <strong>
      ${isCorrect ? "✓ Bonne réponse !" : "À revoir :"}
    </strong>
    ${explanation}
  `;

  if (isCorrect) {
    markTask(id);
  }
}

/* ==========================================
   MISSION 1 – COMPRENDRE
   ========================================== */

function dayOne() {
  return `
    ${missionHeader(
      1,
      "Comprendre la barriérisation",
      "Pourquoi les frontières se ferment-elles ? Découvre les notions et les mécanismes essentiels."
    )}

    ${card("01 · Observer les dispositifs frontaliers", `

      ${imageBlock(
        "images/hero-frontiere.jpg",
        "Une photographie de frontière fortifiée",
        "Un dispositif de fermeture et de surveillance."
      )}

      <p>
        Les États peuvent renforcer leurs frontières grâce
        à des dispositifs matériels, technologiques,
        humains et administratifs.
      </p>

      ${quiz(
        "d1q1",
        "Quel est l'objectif principal de ces dispositifs ?",
        [
          "Faire disparaître la frontière.",
          "Contrôler et filtrer les flux transfrontaliers.",
          "Faciliter systématiquement tous les échanges."
        ],
        1,
        "La barriérisation vise à contrôler, sélectionner ou empêcher certains franchissements. Elle ne signifie pas nécessairement une fermeture totale."
      )}

      ${quiz(
        "d1q2",
        "Lequel de ces éléments est un dispositif technologique ?",
        [
          "Une caméra de surveillance.",
          "Un fossé.",
          "Un poste de douane."
        ],
        0,
        "Les caméras, capteurs, radars et drones sont des moyens technologiques de surveillance."
      )}

    `)}

    ${card("02 · Les notions fondamentales", `

      <p class="muted">
        Clique sur les cartes pour découvrir les définitions.
      </p>

      ${[
        [
          "Barriérisation",
          "Processus de fermeture et de durcissement d'une partie des frontières dans le monde."
        ],
        [
          "Barrière frontalière",
          "Construction le long d'une frontière destinée à contrôler ou empêcher les flux qui la traversent."
        ],
        [
          "Frontière chaude",
          "Frontière qui fait l'objet de tensions, voire de conflits, entre les États riverains."
        ]
      ].map(item => `
        <div class="definition" data-action="flip">

          <div class="term">
            <strong>${item[0]}</strong>
            <p>Quelle est sa définition ?</p>
            <span class="small muted">
              Cliquer pour retourner ↻
            </span>
          </div>

          <div class="answer">
            <strong>${item[0]}</strong>
            <p>${item[1]}</p>
          </div>

        </div>
      `).join("")}

      ${button(
        state.tasks.d1definitions
          ? "Notions révisées ✓"
          : "J'ai révisé les trois notions",
        "definitions",
        "btn-gold"
      )}

    `)}

    ${card("03 · Deux approches géographiques", `

      <div class="case-grid">

        <div class="case">
          <strong>Ballif et Rosière</strong>
          <p>
            Ils étudient le cloisonnement des territoires
            et les politiques concrètes de fermeture des frontières. Selon eux, les États ne se contentent pas de tracer des frontières sur une carte. Les États peuvent chercher à les rendre plus difficiles à franchir afin de contrôler les déplacements et de protéger leur territoire. Cette politique peut prendre plusieurs formes : Matérielles : construction de murs, de grillages, de clôtures et de barrières. Technologiques : caméras, capteurs, drones et systèmes de surveillance. Humaines et administratives : multiplication des contrôles policiers, militaires et douaniers, restrictions de visas et contrôles migratoires. L’objectif est de limiter ou de sélectionner les franchissements, en particulier ceux considérés par les autorités comme indésirables ou dangereux. 
o	Plusieurs causes possibles : Sécuriser le territoire, face à des menaces réelles ou perçues. Contrôler les migrations, en limitant certaines entrées ou sorties. Lutter contre les trafics, notamment les trafics de marchandises illicites et de stupéfiants. Affirmer la souveraineté de l’État, en montrant sa capacité à contrôler son territoire. Matérialiser un rapport de force, notamment dans les situations de conflit ou de contestation territoriale (cf. politique de D. Trump).

          </p>
        </div>

        <div class="case">
          <strong>Michel Foucher</strong>
          <p>
            Il analyse le retour des frontières :
            la mondialisation ne les a pas fait disparaître. Pour le géographe et géopolitologue Michel Foucher, le « retour des frontières » désigne la réaffirmation du rôle des frontières dans l’organisation du monde, dans les politiques des États et dans les représentations des populations. Dans son ouvrage Le retour des frontières, publié en 2016 chez CNRS Éditions, il souligne que les frontières n’ont jamais réellement disparu : elles sont simplement devenues moins visibles dans certains espaces, notamment en Europe, où la circulation a été facilitée par les accords de coopération. L'idée essentielle : la mondialisation n'entraîne pas la disparition des frontières. Au contraire, celles-ci restent indispensables pour délimiter les territoires, exercer la souveraineté et organiser les relations entre les États. Après la fin de la guerre froide, l’intensification des échanges et le développement de la mondialisation ont fait espérer un monde dans lequel les frontières auraient moins d’importance.
          </p>
        </div>

      </div>

      ${quiz(
        "d1q3",
        "À quel auteur associes-tu le « retour des frontières » ?",
        [
          "Ballif et Rosière",
          "Michel Foucher",
          "Les deux exclusivement"
        ],
        1,
        "Michel Foucher publie Le retour des frontières en 2016."
      )}

      ${quiz(
        "d1q4",
        "La mondialisation entraîne-t-elle automatiquement la disparition des frontières ?",
        [
          "Oui",
          "Non",
          "Seulement en Europe"
        ],
        1,
        "La mondialisation intensifie les échanges, mais les frontières restent essentielles pour délimiter les territoires, exercer la souveraineté et organiser les relations entre États."
      )}

      <div class="visual">
        <strong style="color:var(--gold)">
          L'idée essentielle
        </strong>

        <p>
          Les frontières ne disparaissent pas :
          elles se transforment. Leur fonction de fermeture,
          de contrôle et de filtrage peut se renforcer
          au détriment de leur fonction d'ouverture.
        </p>
      </div>

    `)}

    ${missionCompletion(0)}
  `;
}

/* ==========================================
   MISSION 2 – EXPLORER
   ========================================== */

function dayTwo() {
  return `
    ${missionHeader(
      2,
      "Explorer les frontières du monde",
      "Observe huit frontières et découvre les deux grandes logiques de leur fermeture."
    )}

    ${card("01 · La carte mondiale des frontières", `

      <p class="muted">
        Clique sur les marqueurs pour découvrir les frontières.
        Chaque fiche comporte un lien vers Google Earth.
      </p>

      <div class="map-container"
        id="worldMap"
        aria-label="Carte interactive des frontières étudiées">
      </div>

      <div class="mapline">
        <span>🟠 Frontières conflictuelles</span>
        <span>🔵 Frontières de filtrage</span>
      </div>

      <p class="small muted">
        La carte utilise les fonds cartographiques OpenStreetMap.
        Les liens Google Earth permettent d'explorer les lieux
        dans un autre outil.
      </p>

      ${button(
        "J'ai exploré les huit frontières",
        "mapDone",
        "btn-gold"
      )}

    `)}

    ${card("02 · Les deux grandes logiques de fermeture", `

      <div class="case-grid">

        <div class="case">
          <strong>LOGIQUE CONFLICTUELLE</strong>

          <p>
            Appropriation d'un territoire contesté,
            lutte contre des menaces militaires,
            matérialisation d'un rapport de force.
          </p>

          <span class="pill">MILITAIRE ET DÉFENSIVE</span>
        </div>

        <div class="case">
          <strong>LOGIQUE DE FILTRAGE</strong>

          <p>
            Contrôle des migrations, lutte contre les trafics
            et sélection des flux transfrontaliers.
          </p>

          <span class="pill">MIGRATIONS ET CONTRÔLE</span>
        </div>

      </div>

      <p class="muted">
        Pour chaque frontière, sélectionne la logique principale.
      </p>

      <div id="sortingArea"></div>

    `)}

    ${card("03 · Une frontière peut changer de fonction", `

      ${imageBlock(
        "images/ukraine.jpg",
        "Frontière entre la Russie et l'Ukraine"
      )}

      <div class="mapline">
        <span>Avant 2014</span>
        <span>Échanges</span>
        <span>Contact</span>
      </div>

      <div class="mapline">
        <span>Depuis 2022</span>
        <span>Guerre</span>
        <span>Séparation</span>
      </div>

      <p>
        L'exemple russo-ukrainien illustre le « retour des frontières » :
        une frontière de contact et d'échanges devient une ligne
        de séparation et d'affrontement.
      </p>

      ${quiz(
        "d2q1",
        "Comment qualifie-t-on une frontière marquée par des tensions entre États ?",
        [
          "Une frontière froide",
          "Une frontière chaude",
          "Une frontière ouverte"
        ],
        1,
        "Une frontière chaude est une frontière qui fait l'objet de tensions, voire de conflits, entre les États riverains."
      )}

    `)}

    ${missionCompletion(1)}
  `;
}

/* ==========================================
   CARTE INTERACTIVE LEAFLET
   ========================================== */

function initMap() {
  const element = $("worldMap");

  if (!element) return;

  if (!window.L) {
    element.innerHTML = `
      <p style="padding:20px">
        La carte nécessite une connexion Internet
        et le chargement de la bibliothèque cartographique.
      </p>
    `;
    return;
  }

  if (state.map) {
    state.map.remove();
    state.map = null;
  }

  state.map = L.map(element).setView([23, 15], 2);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }
  ).addTo(state.map);

  places.forEach(place => {

    const color =
      place.category === "militaire"
        ? "#ffbd65"
        : "#62d5dc";

    const marker = L.circleMarker(place.coords, {
      radius: 9,
      color: color,
      fillColor: color,
      fillOpacity: 0.9,
      weight: 2
    }).addTo(state.map);

    const earthUrl =
      "https://earth.google.com/web/search/" +
      encodeURIComponent(place.earth);

    marker.bindPopup(`
      <div class="map-popup">

        <strong>${place.name}</strong>

        <img
          src="${place.image}"
          alt="${place.name}"
          style="width:100%;max-height:130px;object-fit:cover"
          onerror="this.style.display='none'"
        >

        <p>${place.description}</p>

        <p>
          <strong>Logique :</strong>
          ${
            place.category === "militaire"
              ? "conflictuelle et militaire"
              : "filtrage des flux"
          }
        </p>

        <p>
          <strong>Objectif :</strong>
          ${place.objective}
        </p>

        <p>
          <a href="${earthUrl}"
             target="_blank"
             rel="noopener noreferrer">
            Explorer dans Google Earth ↗
          </a>
        </p>

      </div>
    `);

    marker.on("click", () => {

      if (!state.mapVisited.includes(place.id)) {
        state.mapVisited.push(place.id);
        saveProgress();
      }

    });

  });

  setTimeout(() => {
    state.map.invalidateSize();
  }, 150);
}

/* ==========================================
   CLASSEMENT DES FRONTIÈRES
   ========================================== */

function renderSorting() {
  const area = $("sortingArea");

  if (!area) return;

  area.innerHTML = places.map(place => {

    const answer = state.sortAnswers[place.id];

    return `
      <div class="case">

        <strong>${place.name}</strong>

        <div class="actions">

          <button
            class="btn btn-secondary"
            data-action="sort"
            data-id="${place.id}"
            data-choice="militaire">
            Conflit / militaire
          </button>

          <button
            class="btn btn-secondary"
            data-action="sort"
            data-id="${place.id}"
            data-choice="filtrage">
            Filtrage des flux
          </button>

        </div>

        <div class="small muted"
          id="sort-feedback-${place.id}">
          ${
            answer === place.category
              ? "✓ Bonne réponse !"
              : answer
                ? "Réessaie : ce classement est incorrect."
                : ""
          }
        </div>

      </div>
    `;

  }).join("");
}

function sortPlace(id, choice) {
  const place = places.find(p => p.id === id);

  if (!place) return;

  const isCorrect = choice === place.category;

  state.sortAnswers[id] =
    isCorrect ? choice : "incorrect";

  const feedback = $("sort-feedback-" + id);

  feedback.textContent = isCorrect
    ? "✓ Exact. " + place.objective
    : "À revoir : observe les objectifs de cette frontière sur la carte.";

  feedback.style.color = isCorrect
    ? "var(--green)"
    : "var(--gold)";

  if (
    places.every(
      p => state.sortAnswers[p.id] === p.category
    )
  ) {
    state.tasks.d2sorting = true;

    feedback.textContent +=
      " Tous les exemples sont correctement classés !";
  }

  saveProgress();
}


/* ==========================================
   MISSION 3 – EXPLIQUER
   ========================================== */

const truths = [
  [
    "La mondialisation a fait disparaître toutes les frontières.",
    "Faux",
    "Les frontières restent essentielles pour délimiter les territoires et exercer la souveraineté."
  ],
  [
    "Les barrières peuvent filtrer les flux sans empêcher tous les passages.",
    "Vrai",
    "La fermeture ne signifie pas nécessairement un blocage total : les États peuvent sélectionner les franchissements."
  ],
  [
    "Les murs sont la seule forme de barriérisation.",
    "Faux",
    "Il existe aussi des clôtures, des barbelés, des check-points, des patrouilles, des radars et des caméras."
  ],
  [
    "La frontière entre les deux Corées est fortement militarisée.",
    "Vrai",
    "La zone démilitarisée est paradoxalement très surveillée et entourée de dispositifs militaires."
  ],
  [
    "Les barrières peuvent servir à contrôler les migrations.",
    "Vrai",
    "C'est notamment le cas des frontières entre les États-Unis et le Mexique ou entre l'Inde et le Bangladesh."
  ]
];

/* ==========================================
   CHIFFRES DU COURS
   ========================================== */

const figures = [
  [
    "65",
    "Nombre de murs internationaux mentionnés dans le cours."
  ],
  [
    "16",
    "Nombre de murs internationaux lors de la chute du mur de Berlin en 1989."
  ],
  [
    "3 200 km",
    "Longueur approximative de la barrière entre l'Inde et le Bangladesh."
  ],
  [
    "2 500",
    "Estimation des morts en Méditerranée en 2023 citée dans le cours."
  ],
  [
    "500 km",
    "Longueur approximative de la clôture Botswana-Zimbabwe."
  ],
  [
    "1994",
    "Année de l'entrée en vigueur de l'ALENA et du début de la construction de barrières à la frontière américano-mexicaine."
  ]
];

const skills = [
  "Définir la barriérisation et une barrière frontalière.",
  "Expliquer les idées de Ballif et Rosière et de Michel Foucher.",
  "Distinguer les deux grandes logiques de fermeture.",
  "Donner au moins deux exemples géographiques précis.",
  "Rédiger une réponse organisée sur les frontières."
];

/* ==========================================
   CONSTRUCTION DE LA MISSION 3
   ========================================== */

function dayThree() {
  return `
    ${missionHeader(
      3,
      "Expliquer les transformations des frontières",
      "Dernière mission : vérifie tes connaissances et construis une réponse géographique personnelle."
    )}

    ${card("01 · Le vrai ou faux du géographe", `

      <p class="muted">
        Lis chaque affirmation, puis choisis ta réponse.
        Une explication apparaît immédiatement.
      </p>

      <div id="truthArea"></div>

    `)}

    ${card("02 · Les chiffres du cours", `

      <p class="muted">
        Retrouve la signification des principaux chiffres.
        Ce sont les données historiques et estimations figurant
        dans ton cours, et non des données nécessairement actualisées.
      </p>

      <div class="visual" style="text-align:center">

        <div class="score" id="figureNumber">65</div>

        <p id="figureMeaning">
          Nombre de murs internationaux mentionnés dans le cours.
        </p>

        <button class="btn btn-secondary"
          data-action="nextFigure">
          Découvrir un autre chiffre ↻
        </button>

      </div>

      ${button(
        state.tasks.d3figures
          ? "Chiffres révisés ✓"
          : "J'ai révisé les chiffres",
        "figuresDone",
        "btn-gold"
      )}

    `)}

    ${card("03 · Le défi final : rédiger une réponse", `

      <div class="visual">

        <span class="pill">QUESTION DE GÉOGRAPHIE</span>

        <h3>
          Montrez que les frontières sont de plus en plus
          des espaces de fermeture et de contrôle.
        </h3>

      </div>

      <p>Organise ta réponse en trois étapes :</p>

      <div class="case">
        <strong>1. Une idée générale</strong>
        <p>Explique le processus de barriérisation.</p>
      </div>

      <div class="case">
        <strong>2. Des explications</strong>
        <p>Distingue les logiques conflictuelles et les logiques de filtrage.</p>
      </div>

      <div class="case">
        <strong>3. Des exemples précis</strong>
        <p>Mobilise au moins deux frontières étudiées.</p>
      </div>

      <textarea
        id="writing"
        placeholder="Rédige ici ta réponse en quelques phrases..."
      ></textarea>

      <div class="actions">

        <button class="btn btn-secondary"
          data-action="showModel">
          Voir une proposition de réponse
        </button>

        <button class="btn btn-primary"
          data-action="saveWriting">
          Enregistrer ma réponse
        </button>

      </div>

      <div class="feedback hidden" id="writingFeedback">

        <strong>Une proposition de réponse :</strong>

        <p>
          Les frontières ne disparaissent pas avec la mondialisation.
          Elles connaissent au contraire un processus de barriérisation,
          c'est-à-dire de fermeture et de durcissement. Les États
          renforcent leur contrôle grâce à des murs, des clôtures,
          des dispositifs de surveillance et des contrôles humains.
        </p>

        <p>
          Cette fermeture répond à deux grandes logiques.
          D'une part, une logique conflictuelle et militaire,
          comme entre la Corée du Nord et la Corée du Sud
          ou entre l'Inde et le Pakistan. D'autre part,
          une logique de filtrage des flux migratoires,
          comme entre les États-Unis et le Mexique
          ou entre l'Inde et le Bangladesh.
        </p>

        <p>
          Les frontières conservent donc une fonction de contrôle
          et de sélection des flux, qui peut se renforcer
          au détriment de leur fonction d'ouverture et de mise en contact.
        </p>

      </div>

    `)}

    ${card("04 · Mon autoévaluation", `

      <p class="muted">
        Coche les compétences que tu maîtrises maintenant.
      </p>

      <div id="selfCheckArea"></div>

    `)}

    ${missionCompletion(2)}
  `;
}

/* ==========================================
   AFFICHAGE DU VRAI / FAUX
   ========================================== */

function renderTruth() {
  const area = $("truthArea");

  if (!area) return;

  area.innerHTML = truths.map((item, index) => {

    const answer = state.truthAnswers[index];

    return `
      <div class="case">

        <strong>${index + 1}.</strong>

        <p>${item[0]}</p>

        <div class="actions">

          <button class="btn btn-secondary"
            data-action="truth"
            data-id="${index}"
            data-choice="Vrai">
            Vrai
          </button>

          <button class="btn btn-secondary"
            data-action="truth"
            data-id="${index}"
            data-choice="Faux">
            Faux
          </button>

        </div>

        <div class="small"
          id="truth-feedback-${index}"
          style="color:var(--green)">
          ${
            answer
              ? (answer === item[1] ? "✓ " : "✗ ") + item[2]
              : ""
          }
        </div>

      </div>
    `;

  }).join("");
}

function answerTruth(index, choice) {
  const item = truths[index];

  if (!item) return;

  const correct = choice === item[1];

  state.truthAnswers[index] = choice;

  const feedback = $("truth-feedback-" + index);

  feedback.textContent =
    (correct ? "✓ Exact. " : "✗ À corriger. ") + item[2];

  feedback.style.color = correct
    ? "var(--green)"
    : "var(--gold)";

  if (
    truths.every(
      (t, i) => state.truthAnswers[i] === t[1]
    )
  ) {
    state.tasks.d3truth = true;
  } else {
    delete state.tasks.d3truth;
  }

  saveProgress();
}

/* ==========================================
   CHIFFRES À MÉMORISER
   ========================================== */

let figureIndex = 0;

function nextFigure() {
  figureIndex = (figureIndex + 1) % figures.length;

  $("figureNumber").textContent =
    figures[figureIndex][0];

  $("figureMeaning").textContent =
    figures[figureIndex][1];

  if (!state.figuresSeen.includes(figureIndex)) {
    state.figuresSeen.push(figureIndex);
    saveProgress();
  }
}

/* ==========================================
   AUTOÉVALUATION
   ========================================== */

function renderSelfChecks() {
  const area = $("selfCheckArea");

  if (!area) return;

  area.innerHTML = skills.map((skill, index) => `
    <div class="case">

      <label>

        <input
          type="checkbox"
          data-action="selfCheck"
          data-id="${index}"
          ${state.selfChecks[index] ? "checked" : ""}
        >

        ${skill}

      </label>

    </div>
  `).join("");
}

/* ==========================================
   VALIDATION DES MISSIONS
   ========================================== */

function missionRequirements(day) {

  if (day === 0) {
    return [
      "d1q1",
      "d1q2",
      "d1q3",
      "d1q4",
      "d1definitions"
    ];
  }

  if (day === 1) {
    return [
      "d2map",
      "d2sorting",
      "d2q1"
    ];
  }

  return [
    "d3truth",
    "d3figures",
    "d3writing",
    "d3self"
  ];
}

function missionCompletion(day) {
  const done = state.completed.includes(day);

  return `
    <section class="card">

      <div class="eyebrow">FIN DE MISSION</div>

      <h3>
        ${done ? "Mission validée ✓" : "As-tu terminé cette mission ?"}
      </h3>

      <p class="muted">
        ${
          done
            ? "Tu peux continuer à réviser ou consulter les autres missions."
            : "Termine les activités demandées pour valider cette journée."
        }
      </p>

      <button
        class="btn btn-primary"
        data-action="finishDay"
        data-id="${day}"
        ${done ? "disabled" : ""}
      >
        ${done ? "Mission terminée ✓" : "Valider ma mission →"}
      </button>

      <p class="small muted" id="completionMessage"></p>

    </section>
  `;
}

function finishDay(day) {
  const required = missionRequirements(day);

  const missing = required.filter(
    task => !state.tasks[task]
  );

  if (missing.length > 0) {
    $("completionMessage").textContent =
      "Il te reste encore certaines activités à réaliser.";
    return;
  }

  if (!state.completed.includes(day)) {
    state.completed.push(day);
  }

  saveProgress();
  renderMission();
}


/* ==========================================
   GESTION DES ÉVÉNEMENTS
   ========================================== */

document.addEventListener("click", event => {

  const target = event.target.closest("[data-action]");

  if (!target) return;

  const action = target.dataset.action;

  /* Cartes de définitions */

  if (action === "flip") {
    target.classList.toggle("revealed");
  }

  /* Validation des définitions */

  if (action === "definitions") {
    markTask("d1definitions");
    target.textContent = "Notions révisées ✓";
  }

  /* Questions à choix multiples */

  if (action === "answer") {

    const id = target.dataset.id;
    const choice = Number(target.dataset.choice);
    const parent = target.closest(".quiz-block");

    const quizData = getQuizData(id);

    if (quizData && parent) {
      answerQuiz(
        id,
        choice,
        quizData.correct,
        quizData.explanation,
        parent
      );
    }
  }

  /* Classement des frontières */

  if (action === "sort") {
    sortPlace(
      target.dataset.id,
      target.dataset.choice
    );
  }

  /* Validation de la carte */

  if (action === "mapDone") {

    if (state.mapVisited.length < places.length) {

      alert(
        "Explore les huit marqueurs de la carte avant de valider cette activité."
      );

    } else {

      markTask("d2map");
      target.textContent = "Carte explorée ✓";

    }
  }

  /* Vrai / faux */

  if (action === "truth") {

    answerTruth(
      Number(target.dataset.id),
      target.dataset.choice
    );
  }

  /* Chiffres */

  if (action === "nextFigure") {
    nextFigure();
  }

  if (action === "figuresDone") {

    if (state.figuresSeen.length < figures.length) {

      alert(
        "Découvre les six chiffres avant de valider cette activité."
      );

    } else {

      markTask("d3figures");
      target.textContent = "Chiffres révisés ✓";

    }
  }

  /* Proposition de rédaction */

  if (action === "showModel") {
    $("writingFeedback").classList.toggle("hidden");
  }

  /* Enregistrement de la rédaction */

  if (action === "saveWriting") {

    const value = $("writing").value.trim();

    if (value.length < 100) {
      alert(
        "Développe un peu plus ta réponse (au moins 100 caractères)."
      );
      return;
    }

    state.writing = value;

    markTask("d3writing");

    target.textContent = "Réponse enregistrée ✓";
  }

  /* Fin de mission */

  if (action === "finishDay") {
    finishDay(Number(target.dataset.id));
  }

  /* Recommencer */

  if (action === "restart") {

    const confirmed = confirm(
      "Veux-tu vraiment recommencer le parcours ?"
    );

    if (!confirmed) return;

    state.day = 0;
    state.completed = [];
    state.tasks = {};
    state.sortAnswers = {};
    state.truthAnswers = {};
    state.selfChecks = {};
    state.mapVisited = [];
    state.figuresSeen = [];
    state.writing = "";

    saveProgress();

    $("finalReport").classList.add("hidden");

    goToDay(0);
  }

});

/* ==========================================
   GESTION DES CASES À COCHER
   ========================================== */

document.addEventListener("change", event => {

  const target = event.target;

  if (target.dataset.action === "selfCheck") {

    const id = Number(target.dataset.id);

    state.selfChecks[id] = target.checked;

    if (skills.every(
      (skill, index) => state.selfChecks[index]
    )) {

      state.tasks.d3self = true;

    } else {

      delete state.tasks.d3self;

    }

    saveProgress();
  }

});

/* ==========================================
   AFFICHAGE DES MISSIONS
   ========================================== */

function renderMission() {

  const area = $("missionContent");

  if (!area) return;

  if (state.day === 0) {

    area.innerHTML = dayOne();

  }

  if (state.day === 1) {

    area.innerHTML = dayTwo();

    renderSorting();

    initMap();

  }

  if (state.day === 2) {

    area.innerHTML = dayThree();

    renderTruth();

    renderSelfChecks();

    $("writing").value = state.writing;

  }

  updateProgress();
}

/* ==========================================
   BILAN FINAL
   ========================================== */

function renderReport() {

  const report = $("finalReport");

  if (!report) return;

  report.innerHTML = `

    <div class="card">

      <div class="eyebrow">
        PARCOURS TERMINÉ
      </div>

      <h2>Bravo, explorateur !</h2>

      <p>
        Tu as terminé les trois missions de GÉO LAB.
        Tu as travaillé sur les notions, les exemples géographiques
        et les mécanismes de fermeture des frontières.
      </p>

      <div class="score">3 / 3</div>

      <p class="muted">Missions terminées</p>

      <div class="visual">

        <strong style="color:var(--gold)">
          Ce que tu dois retenir
        </strong>

        <p>
          La barriérisation désigne le processus de fermeture
          et de durcissement des frontières.
        </p>

        <p>
          Les États renforcent les fonctions de contrôle,
          de fermeture et de filtrage, notamment pour des raisons
          militaires, migratoires et sécuritaires.
        </p>

        <p>
          La mondialisation n'entraîne pas la disparition des frontières :
          elles continuent d'organiser les territoires et les relations
          entre les États.
        </p>

      </div>

      <button class="btn btn-primary"
        data-action="restart">
        Refaire le parcours
      </button>

    </div>

  `;

  report.classList.remove("hidden");
}

/* ==========================================
   RÉINITIALISATION MANUELLE
   ========================================== */

$("resetButton").addEventListener("click", () => {

  const confirmed = confirm(
    "Veux-tu vraiment effacer toute ta progression ?"
  );

  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);

  location.reload();

});

/* ==========================================
   DÉMARRAGE DE L'APPLICATION
   ========================================== */

loadProgress();

updateProgress();

renderMission();
