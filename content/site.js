/* site.js — CONTENIDO: datos del sitio (nombre, contacto, showreel, videoclips…). Es lo único que se edita a diario. */
/* ================================================================
   ✏️  CONFIG — EDITA SOLO ESTE BLOQUE
   · img:   miniatura (las de /assets/real son las oficiales de YouTube)
   · video: URL de YouTube, Vimeo o .mp4 → el modal lo reproduce
   · role:  tu crédito en cada pieza (ajustar cuando corresponda)
   ================================================================ */
const CONFIG = {
  name: "Francisco Benítez",
  city: "Buenos Aires, Argentina",
  email: "fs7benitez@gmail.com",
  phone: "+54 11 5975 4088",
  showreel: { title: "Reel 2026", img: "assets/showreel.jpg", video: "https://www.youtube.com/watch?v=Csj207PWog0" },
  clients: ["MUSHER", "TIERRAS RARAS", "DANO", "MIR NICOLAS", "CEROUNNO", "H DE PERRA", "EL MORTEDOR", "LOW", "B13X", "LASISTTA", "SHOWSA", "MARTOCHA", "DINÁMICA", "iQ.NO1", "MAYOR R", "BLOQQ MÁYUS"],
  socials: [
    { id: "instagram", label: "Instagram", url: "https://instagram.com/bloqqmayus" },
    { id: "youtube",   label: "YouTube",     url: "https://youtube.com/@bloqqmayus" },
    { id: "linkedin",  label: "LinkedIn",    url: "https://www.linkedin.com/in/franciscosben%C3%ADtez/" }
  ],
  /* ---- Videoclips para clientes (más nuevos primero) ---- */
  films: [
    { title: "Hard-street",          cat: "B13X", artist: "Barbara13X & Showsa", year: "2026", role: "Videoclip oficial", img: "assets/real/5Xf4IfjnmFw.jpg", video: "https://www.youtube.com/watch?v=5Xf4IfjnmFw" },
    { title: "Apagón",               cat: "SHERPA × AJITAWIRA", artist: "Sherpa & Ajitawira", year: "2026", role: "Videoclip oficial", img: "assets/real/N2OL2nSRO20.jpg", video: "https://www.youtube.com/watch?v=N2OL2nSRO20" },
    { title: "Palo Santo",         cat: "TIERRAS RARAS", artist: "Tierras Raras", lineup: "Dano, Mir Nicolas, Cerounno & H de Perra", year: "2026", role: "Videoclip oficial", img: "assets/real/Y2o1pV-uG6I.jpg", video: "https://www.youtube.com/watch?v=Y2o1pV-uG6I" },
    { title: "Los Pérez García",   cat: "TIERRAS RARAS", artist: "Tierras Raras", lineup: "Dano, Mir Nicolas, Cerounno & H de Perra", year: "2026", role: "Videoclip oficial", img: "assets/real/2fJH1lNtwZk.jpg", video: "https://www.youtube.com/watch?v=2fJH1lNtwZk" },
    { title: "Rocafella",          cat: "TIERRAS RARAS", artist: "Tierras Raras", lineup: "Dano, Mir Nicolas, Cerounno & H de Perra", year: "2026", role: "Videoclip oficial", img: "assets/real/8kXtlrirlvU.jpg", video: "https://www.youtube.com/watch?v=8kXtlrirlvU" },
    { title: "Disney Plug",        cat: "TIERRAS RARAS", artist: "Tierras Raras", lineup: "Dano, Mir Nicolas, Cerounno & H de Perra", year: "2026", role: "Videoclip oficial", img: "assets/real/OvclU3AHgmY.jpg", video: "https://www.youtube.com/watch?v=OvclU3AHgmY" },
    { title: "Doc Pájaros Free",   cat: "TIERRAS RARAS", artist: "Tierras Raras", lineup: "Dano, Mir Nicolas, Cerounno & H de Perra", year: "2026", role: "Videoclip oficial", img: "assets/real/boEKNP9OH4I.jpg", video: "https://www.youtube.com/watch?v=boEKNP9OH4I" },
    { title: "Los Beatles",        cat: "TIERRAS RARAS", artist: "Tierras Raras", lineup: "Dano, Mir Nicolas, Cerounno & H de Perra", year: "2026", role: "Videoclip oficial", img: "assets/real/Yuh5ulasmBA.jpg", video: "https://www.youtube.com/watch?v=Yuh5ulasmBA" },
    { title: "Tai Chi & Full Contact", cat: "iQ.NO1", artist: "iQ.NO1", year: "2026", role: "Videoclip oficial", img: "assets/real/HAxRAyv8Ll8.jpg", video: "https://www.youtube.com/watch?v=HAxRAyv8Ll8" },
    { title: "Esto No Se Acaba",     cat: "MARTOCHA", artist: "Martocha × Dinámica", year: "2026", role: "Videoclip oficial", img: "assets/real/6Y9qKhXRRI8.jpg", video: "https://www.youtube.com/watch?v=6Y9qKhXRRI8" },
    { title: "Caramelos de Colores", cat: "MUSHER", artist: "Musher ft. H de Perra",  year: "2026", role: "Videoclip oficial", img: "assets/real/KyrM4OIZuv0.jpg", video: "https://www.youtube.com/watch?v=KyrM4OIZuv0" },
    { title: "Ser el Uno",         cat: "MUSHER", artist: "Musher ft. El Mortedor", year: "2026", role: "Videoclip oficial", img: "assets/real/MrM7xpynHyo.jpg", video: "https://www.youtube.com/watch?v=MrM7xpynHyo" },
    { title: "FACE DE FURRO",            cat: "BLOQQ MÁYUS", artist: "BLOQQ MÁYUS", year: "2026", role: "Videoclip oficial", img: "assets/real/x5HF8rj4PC4.jpg", video: "https://www.youtube.com/watch?v=x5HF8rj4PC4" },
    { title: "FACTS",                    cat: "BLOQQ MÁYUS", artist: "BLOQQ MÁYUS", year: "2026", role: "Videoclip oficial", img: "assets/real/WPE_jtKCojc.jpg", video: "https://www.youtube.com/watch?v=WPE_jtKCojc" },
    { title: "Sopa de Papa",       cat: "MUSHER", artist: "Musher",                 year: "2025", role: "Videoclip oficial", img: "assets/real/ngeHU0vpw_Q.jpg", video: "https://www.youtube.com/watch?v=ngeHU0vpw_Q" },
    { title: "Rumpología",         cat: "MUSHER", artist: "Musher ft. Low",         year: "2025", role: "Videoclip oficial", img: "assets/real/MV9vqqJxSEM.jpg", video: "https://www.youtube.com/watch?v=MV9vqqJxSEM" },
    { title: "Freestyle Navideño", cat: "MUSHER", artist: "Musher",                 year: "2025", role: "Videoclip oficial", img: "assets/real/WE_XicUvCmA.jpg", video: "https://www.youtube.com/watch?v=WE_XicUvCmA" },
    { title: "Luna Nueva",           cat: "LIHUEL YAIR", artist: "Lihuel Yair ft. El Soud", year: "2025", role: "Lyric video oficial", img: "assets/real/oxOTVVbyYFA.jpg", video: "https://www.youtube.com/watch?v=oxOTVVbyYFA" },
    { title: "Cuanto Mas",           cat: "LIHUEL YAIR", artist: "Lihuel Yair", year: "2025", role: "Videoclip oficial", img: "assets/real/jFbh80FByT4.jpg", video: "https://www.youtube.com/watch?v=jFbh80FByT4" },
    { title: "Escorpio",             cat: "MAYOR R", artist: "Mayor R", year: "2025", role: "Videoclip oficial", img: "assets/real/SsO6Or59bhY.jpg", video: "https://www.youtube.com/watch?v=SsO6Or59bhY" },
    { title: "LA CALETA",            cat: "B13X", artist: "B13X & Conde Rodriguez", year: "2025", role: "Videoclip oficial", img: "assets/real/19N7eMg5DHg.jpg", video: "https://www.youtube.com/watch?v=19N7eMg5DHg" },
    { title: "Tabla Esmeralda",      cat: "B13X", artist: "B13X & Lasistta", year: "2023", role: "Videoclip oficial", img: "assets/real/hTIK3eSvI3M.jpg", video: "https://www.youtube.com/watch?v=hTIK3eSvI3M" },
    { title: "Siento que corone",    cat: "SEAL G", artist: "Seal G", year: "2021", role: "Videoclip oficial", img: "assets/real/GZgUjji0K-o.jpg", video: "https://www.youtube.com/watch?v=GZgUjji0K-o" },
    { title: "Mahfackas",            cat: "DELNI", artist: "Delni", year: "2021", role: "Videoclip oficial", img: "assets/real/DcKFx7KnNSk.jpg", video: "https://www.youtube.com/watch?v=DcKFx7KnNSk" },
    { title: "Si me hago viral",     cat: "SEAL G", artist: "Seal G", year: "2020", role: "Videoclip oficial", img: "assets/real/PyPTavYcGUQ.jpg", video: "https://www.youtube.com/watch?v=PyPTavYcGUQ" },
    { title: "En tu camino",         cat: "NAKKO FG", artist: "Sello De Luna ft. Nakko FG", year: "2020", role: "Videoclip oficial", img: "assets/real/bIVLTBuUCj8.jpg", video: "https://www.youtube.com/watch?v=bIVLTBuUCj8" }
  ],
  /* ---- Vertical: los reels se auto-descubren desde assets/reels/ (ver loadReels) ---- */
};
/* ================= FIN DE CONFIG ================= */
