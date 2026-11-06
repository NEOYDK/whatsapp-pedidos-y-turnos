(function () {
  "use strict";

  const BIZ = {
    rotiseria: {
      name: "Lo de Tito · Rotisería", avatar: "T",
      hello: "¡Hola! 👋 Gracias por escribir a Lo de Tito. Soy el asistente: te paso el menú, te tomo el pedido y te digo cuánto sale. ¿Qué tenés ganas de comer hoy?",
      suggest: ["¿Qué tienen hoy?", "Quiero 2 milanesas napolitanas", "¿Hacen delivery a San Agustín?"]
    },
    barberia: {
      name: "Filo Barber Club", avatar: "F",
      hello: "¡Buenas! ✂ Soy el asistente de Filo. Te paso precios, horarios y te saco el turno acá mismo. ¿Qué te querés hacer?",
      suggest: ["Corte y barba para el sábado", "¿Cuánto sale el corte?", "¿Cómo es el club?"]
    },
    odontologia: {
      name: "Odontología Ribera", avatar: "R",
      hello: "¡Hola! 😊 Soy Sofi, la asistente de Odontología Ribera. Te ayudo con turnos, tratamientos y obras sociales. ¿En qué te ayudo?",
      suggest: ["Me duele una muela", "Quiero turno para limpieza", "¿Atienden IOSPER?"]
    },
    inmobiliaria: {
      name: "Barranca Propiedades", avatar: "B",
      hello: "¡Hola! 👋 Soy Tomás, el asistente de Barranca Propiedades. ¿Buscás comprar, alquilar o querés tasar tu propiedad?",
      suggest: ["Busco depto para alquilar en el centro", "¿Qué piden para alquilar?", "Quiero tasar mi casa"]
    }
  };

  const $ = s => document.querySelector(s);
  const log = $("[data-log]"), form = $("[data-form]"), input = $("#msg"), suggest = $("[data-suggest]");
  let biz = "rotiseria", history = [], busy = false;

  const time = () => new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  // Texto con los links tocables (como en WhatsApp), armado sin innerHTML
  function fill(el, text) {
    String(text).split(/(https:\/\/[^\s<>"]+)/).forEach((part, i) => {
      if (i % 2 === 0) { if (part) el.appendChild(document.createTextNode(part)); return; }
      const url = part.replace(/[.,;:!?)\]]+$/, "");
      const a = document.createElement("a");
      a.href = url; a.textContent = url; a.target = "_blank"; a.rel = "noopener";
      el.appendChild(a);
      if (url.length < part.length) el.appendChild(document.createTextNode(part.slice(url.length)));
    });
  }

  function bubble(text, who) {
    const b = document.createElement("div");
    b.className = "bubble " + who;
    fill(b, text);
    const m = document.createElement("span");
    m.className = "meta";
    m.textContent = time();
    b.appendChild(m);
    log.appendChild(b);
    log.scrollTop = log.scrollHeight;
  }

  function sys(text, cls) {
    const p = document.createElement("p");
    p.className = cls;
    p.textContent = text;
    log.appendChild(p);
  }

  function load(key) {
    biz = key;
    history = [];
    const b = BIZ[key];
    $("[data-name]").textContent = b.name;
    $("[data-avatar]").textContent = b.avatar;
    $("[data-status]").textContent = "en línea";
    document.querySelectorAll("[data-biz]").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.biz === key)));
    log.textContent = "";
    sys("HOY", "day");
    sys("🤖 Demo: estás hablando con el asistente automático de un negocio de ejemplo.", "note-sys");
    bubble(b.hello, "in");
    suggest.textContent = "";
    b.suggest.forEach(s => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = s;
      btn.addEventListener("click", () => send(s));
      suggest.appendChild(btn);
    });
    suggest.hidden = false;
  }

  async function send(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    suggest.hidden = true;
    bubble(text, "out");
    $("[data-status]").textContent = "escribiendo…";
    const t = document.createElement("div");
    t.className = "typing";
    t.innerHTML = "<span></span><span></span><span></span>";
    log.appendChild(t);
    log.scrollTop = log.scrollHeight;

    let reply = "Uy, se me cortó la conexión 😅 Probá de nuevo en un ratito.";
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ negocio: biz, message: text, history: history.slice(-10) })
      });
      const j = await r.json().catch(() => ({}));
      if (j.reply) reply = j.reply;
    } catch (_) { /* sin conexión: mensaje de respaldo */ }

    t.remove();
    $("[data-status]").textContent = "en línea";
    bubble(reply, "in");
    history.push({ role: "user", text }, { role: "model", text: reply });
    busy = false;
    input.focus();
  }

  form.addEventListener("submit", e => { e.preventDefault(); const v = input.value; input.value = ""; send(v); });
  document.querySelectorAll("[data-biz]").forEach(b => b.addEventListener("click", () => { if (!busy) load(b.dataset.biz); }));
  load("rotiseria");
})();
