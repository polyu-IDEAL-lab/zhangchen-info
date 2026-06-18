const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const header = document.querySelector("[data-header]");
const yearNode = document.querySelector("[data-current-year]");
const directionList = document.querySelector("[data-direction-list]");
const themeList = document.querySelector("[data-theme-list]");
const publicationList = document.querySelector("[data-publication-list]");

const data = window.siteData;
const selfAuthorNames = [
  "Chen Jason Zhang",
  "Chen Zhang",
  "Jason Zhang",
  "Zhang Chen",
  "CJ Zhang",
  "JC Zhang",
  "C Zhang",
  "J. Zhang",
  "J Zhang"
];
const selfAuthorDisplayName = "C. J. Zhang";
const normalizeAuthorKey = (name) => {
  return String(name).toLowerCase().replace(/[^a-z]/g, "");
};
const selfAuthorSet = new Set(selfAuthorNames.map(normalizeAuthorKey));
const supervisedAuthorEntries = data.supervisedAuthors.map((author) => ({
  displayName: author.name,
  names: [author.name, ...(author.aliases || [])].map(normalizeAuthorKey),
  activeUntilYear: author.activeUntilYear
}));

const priorityVenueRules = [
  { label: "SIGMOD", pattern: /\b(SIGMOD|PODS|Proceedings of the ACM on Management of Data)\b/i, rank: 0 },
  { label: "ICDE", pattern: /\bICDE\b|International Conference on Data Engineering/i, rank: 1 },
  { label: "VLDB Journal", pattern: /\bVLDBJ\b|The VLDB Journal/i, rank: 2 },
  { label: "PVLDB", pattern: /\bPVLDB\b|Proceedings of the VLDB Endowment/i, rank: 3 },
  { label: "TKDE", pattern: /\bTKDE\b|IEEE Transactions on Knowledge and Data Engineering/i, rank: 4 },
  { label: "KDD", pattern: /\b(SIGKDD|KDD)\b|Knowledge Discovery/i, rank: 5 },
  { label: "WWW", pattern: /\bWWW\b|Web Conference/i, rank: 6 },
  { label: "WSDM", pattern: /\bWSDM\b|Web Search/i, rank: 6.5 },
  { label: "ACL", pattern: /\bACL\b|Annual Meeting of the Association for Computational|Association for Computational/i, rank: 7 },
  { label: "EMNLP", pattern: /\bEMNLP\b|Empirical Methods in Natural Language/i, rank: 8 },
  { label: "ICML", pattern: /\bICML\b|International Conference on Machine Learning/i, rank: 8.5 },
  { label: "Nature", pattern: /\bNature\b|\bnpj\b/i, rank: 9 },
  { label: "Science", pattern: /\bScience Advances\b/i, rank: 10 },
];

const ccfVenueRules = [
  { grade: "A", pattern: /\bSIGMOD\b|ACM Conference on Management of Data|Proceedings of the ACM on Management of Data/i },
  { grade: "A", pattern: /\bSIGKDD\b|\bKDD\b|Knowledge Discovery/i },
  { grade: "A", pattern: /\bICDE\b|International Conference on Data Engineering/i },
  { grade: "A", pattern: /\bVLDBJ\b|The VLDB Journal/i },
  { grade: "A", pattern: /\bPVLDB\b|Proceedings of the VLDB Endowment|\bVLDB\b/i },
  { grade: "A", pattern: /\bTKDE\b|IEEE Transactions on Knowledge and Data Engineering/i },
  { grade: "A", pattern: /\bWWW\b|Web Conference|World Wide Web Conference/i },
  { grade: "A", pattern: /\bACL\b|Annual Meeting of the Association for Computational|Association for Computational Linguistics/i },
  { grade: "A", pattern: /\bAAAI\b|AAAI Conference on Artificial Intelligence/i },
  { grade: "A", pattern: /\bICML\b|International Conference on Machine Learning/i },
  { grade: "A", pattern: /\bTIP\b|IEEE Transactions on Image Processing/i },
  { grade: "B", pattern: /\bWSDM\b|Web Search/i },
  { grade: "B", pattern: /\bEMNLP\b|Empirical Methods in Natural Language/i },
  { grade: "B", pattern: /\bDASFAA\b|Database Systems for Advanced Applications/i },
  { grade: "B", pattern: /\bTFS\b|IEEE Transactions on Fuzzy Systems/i },
  { grade: "B", pattern: /\bTNNLS\b|IEEE Transactions on Neural Networks/i },
  { grade: "B", pattern: /\bNeural Networks\b/i },
  { grade: "B", pattern: /\bPR\b|Pattern Recognition/i },
];

const departmentTopConferenceRules = [
  { label: "COMP Top", pattern: /\bAAAI\b|AAAI Conference on Artificial Intelligence/i },
  { label: "COMP Top", pattern: /\bCCS\b|ACM Conference on Computer and Communications Security/i },
  { label: "COMP Top", pattern: /\bEC\b|ACM Conference on Economics and Computation/i },
  { label: "COMP Top", pattern: /\bSenSys\b|Embedded Networked Sensor Systems/i },
  { label: "COMP Top", pattern: /\bCHI\b|Human Factors in Computing Systems/i },
  { label: "COMP Top", pattern: /\bMobiCom\b|Mobile Computing and Networking/i },
  { label: "COMP Top", pattern: /\bACM MM\b|ACM International Conference on Multimedia/i },
  { label: "COMP Top", pattern: /\bSIGCOMM\b|Applications, Technologies, Architectures, and Protocols for Computer Communication/i },
  { label: "COMP Top", pattern: /\bUbiComp\b|Ubiquitous Computing/i },
  { label: "COMP Top", pattern: /\bSIGKDD\b|\bKDD\b|Knowledge Discovery/i },
  { label: "COMP Top", pattern: /\bSIGGRAPH\b/i },
  { label: "COMP Top", pattern: /\bSIGIR\b|ACM SIGIR Conference on Information Retrieval/i },
  { label: "COMP Top", pattern: /\bSIGMOD\b|ACM Conference on Management of Data|Proceedings of the ACM on Management of Data/i },
  { label: "COMP Top", pattern: /\bFSE\b|Foundations of Software Engineering/i },
  { label: "COMP Top", pattern: /\bSOSP\b|Operating Systems Principles/i },
  { label: "COMP Top", pattern: /\bSTOC\b|Theory of Computing/i },
  { label: "COMP Top", pattern: /\bSODA\b|Discrete Algorithms/i },
  { label: "COMP Top", pattern: /\bPLDI\b|Programming Language Design and Implementation/i },
  { label: "COMP Top", pattern: /\bNeurIPS\b|Neural Information Processing Systems/i },
  { label: "COMP Top", pattern: /\bACL\b|Annual Meeting of the Association for Computational|Association for Computational Linguistics/i },
  { label: "COMP Top", pattern: /\bEMNLP\b|Empirical Methods in Natural Language/i },
  { label: "COMP Top", pattern: /\bEuroSys\b|European Conference on Computer Systems/i },
  { label: "COMP Top", pattern: /\bCVPR\b|Computer Vision and Pattern Recognition/i },
  { label: "COMP Top", pattern: /\bIEEE VR\b|Virtual Reality and 3D User Interfaces/i },
  { label: "COMP Top", pattern: /\bINFOCOM\b|Computer Communications/i },
  { label: "COMP Top", pattern: /\bICDE\b|International Conference on Data Engineering/i },
  { label: "COMP Top", pattern: /\bS&P\b|Security and Privacy/i },
  { label: "COMP Top", pattern: /\bFOCS\b|Foundations of Computer Science/i },
  { label: "COMP Top", pattern: /\bSC\b|High Performance Computing, Networking, Storage, and Analysis/i },
  { label: "COMP Top", pattern: /\bASE\b|Automated Software Engineering/i },
  { label: "COMP Top", pattern: /\bICCV\b|International Conference on Computer Vision/i },
  { label: "COMP Top", pattern: /\bICLR\b|International Conference on Learning Representations/i },
  { label: "COMP Top", pattern: /\bICML\b|International Conference on Machine Learning/i },
  { label: "COMP Top", pattern: /\bICSE\b|International Conference on Software Engineering/i },
  { label: "COMP Top", pattern: /\bPVLDB\b|Proceedings of the VLDB Endowment|\bVLDB\b|Very Large Data Bases/i },
  { label: "COMP Top", pattern: /\bCRYPTO\b|International Cryptology Conference/i },
  { label: "COMP Top", pattern: /\bIJCAI\b|International Joint Conference on Artificial Intelligence/i },
  { label: "COMP Top", pattern: /\bISCA\b|Computer Architecture/i },
  { label: "COMP Top", pattern: /\bISSTA\b|Software Testing and Analysis/i },
  { label: "COMP Top", pattern: /\bWWW\b|ACM Web Conference|Web Conference|World Wide Web Conferences/i },
  { label: "COMP Top", pattern: /\bNDSS\b|Network and Distributed System Security/i },
  { label: "COMP Top", pattern: /\bRTSS\b|Real Time Systems Symposium/i },
  { label: "COMP Top", pattern: /\bDAC\b|Design Automation Conference/i },
  { label: "COMP Top", pattern: /\bUSENIX ATC\b|USENIX Annual Technical Conference/i },
  { label: "COMP Top", pattern: /\bFAST\b|File and Storage Technologies/i },
  { label: "COMP Top", pattern: /\bUSENIX Security\b|USENIX Security Symposium/i },
  { label: "COMP Top", pattern: /\bNSDI\b|Networked Systems Design/i },
  { label: "COMP Top", pattern: /\bOSDI\b|Operating Systems Design and Implementations/i },
];

const departmentJournalRules = [
  {
    grade: "A",
    journals: [
      "ACM Transactions on Computer Systems",
      "ACM Transactions on Computer-Human Interaction",
      "ACM Transactions on Database Systems",
      "ACM Transactions on Graphics",
      "ACM Transactions on Information Systems",
      "ACM Transactions on Programming Languages and Systems",
      "ACM Transactions on Software Engineering and Methodology",
      "Artificial Intelligence",
      "Computational Linguistics",
      "Computers and Security",
      "IEEE Computational Intelligence Magazine",
      "IEEE Journal on Selected Areas in Communications",
      "IEEE Transactions on Affective Computing",
      "IEEE Transactions on Circuits and Systems for Video Technology",
      "IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems",
      "IEEE Transactions on Computers",
      "IEEE Transactions on Cybernetics",
      "IEEE Transactions on Dependable and Secure Computing",
      "IEEE Transactions on Evolutionary Computation",
      "IEEE Transactions on Fuzzy Systems",
      "IEEE Transactions on Image Processing",
      "IEEE Transactions on Information Forensics and Security",
      "IEEE Transactions on Information Theory",
      "IEEE Transactions on Intelligent Transportation Systems",
      "IEEE Transactions on Knowledge and Data Engineering",
      "IEEE Transactions on Medical Imaging",
      "IEEE Transactions on Mobile Computing",
      "IEEE Transactions on Multimedia",
      "IEEE Transactions on Neural Networks and Learning Systems",
      "IEEE Transactions on Parallel and Distributed Systems",
      "IEEE Transactions on Pattern Analysis and Machine Intelligence",
      "IEEE Transactions on Services Computing",
      "IEEE Transactions on Software Engineering",
      "IEEE Transactions on Visualization and Computer Graphics",
      "IEEE Transactions on Wireless Communications",
      "IEEE/ACM Transactions on Networking",
      "Information and Computation",
      "Information Processing and Management",
      "Information Sciences",
      "International Journal of Computer Vision",
      "International Journal of Human Computer Studies",
      "Journal of Cryptology",
      "Journal of Machine Learning Research",
      "Journal of the ACM",
      "Neural Networks",
      "SIAM Journal on Computing",
      "VLDB Journal"
    ]
  },
  {
    grade: "B",
    journals: [
      "ACM Computing Surveys",
      "ACM Transactions on Algorithms",
      "ACM Transactions on Applied Perception",
      "ACM Transactions on Computational Logic",
      "ACM Transactions on Design Automation of Electronic Systems",
      "ACM Transactions on Embedded Computing Systems",
      "ACM Transactions on Internet Technology",
      "ACM Transactions on Knowledge Discovery from Data",
      "ACM Transactions on Multimedia Computing Communications and Applications",
      "ACM Transactions on Privacy and Security",
      "ACM Transactions on Sensor Networks",
      "ACM Transactions on Speech and Language Processing",
      "Algorithmica",
      "Automated Software Engineering",
      "Autonomous Agents and Multi-agent Systems",
      "Bioinformatics",
      "Communications of the ACM",
      "Computational Complexity",
      "Computer Aided Geometric Design",
      "Computer Graphics Forum",
      "Computer Networks",
      "Computer Vision and Image Understanding",
      "Computer-Aided Design",
      "Computers and Education",
      "Data and Knowledge Engineering",
      "Designs, Codes and Cryptography",
      "Empirical Software Engineering Journal",
      "Expert Systems with Applications",
      "Formal Methods in System Design",
      "Geoinformatica",
      "Graphical Models",
      "IEEE Communications Surveys and Tutorials",
      "IEEE Internet of Things Journal",
      "IEEE Network",
      "IEEE Transactions on Audio, Speech and Language Processing",
      "IEEE Transactions on Biomedical Engineering",
      "IEEE Transactions on Cloud Computing",
      "IEEE Transactions on Communications",
      "IEEE Transactions on Emerging Topics in Computing",
      "IEEE Transactions on Industrial Informatics",
      "IEEE Transactions on Learning Technologies",
      "IEEE Transactions on Signal Processing",
      "IEEE Transactions on Systems, Man, and Cybernetics: Systems",
      "IEEE Transactions on Vehicular Technology",
      "IEEE Transactions on Very Large Scale Integration Systems",
      "IEEE/ACM Transactions on Computational Biology and Bioinformatics",
      "IET Software",
      "Information and Software Technology",
      "Information Fusion",
      "Journal of Artificial Intelligence Research",
      "Journal of Automated Reasoning",
      "Journal of Biomedical Informatics",
      "Journal of Computer and System Sciences",
      "Journal of Computer Science and Technology",
      "Journal of Functional Programming",
      "Journal of Network and Computer Applications",
      "Journal of Parallel and Distributed Computing",
      "Journal of Strategic Information Systems",
      "Journal of Symbolic Computation",
      "Journal of Systems and Software",
      "Knowledge and Information Systems",
      "Knowledge-based Systems",
      "Machine Learning",
      "Mathematical Structures in Computer Science",
      "Medical Image Analysis",
      "Neural Computation",
      "NeuroImage",
      "Parallel Computing",
      "Pattern Recognition",
      "Performance Evaluation",
      "Real-Time Systems",
      "Soft Computing",
      "Software Practice and Experience",
      "Software Testing Verification and Reliability",
      "The Computer Journal",
      "Theoretical Computer Science",
      "Transactions of the Association for Computational Linguistics",
      "World Wide Web - Internet and Web Information Systems",
      "World Wide Web Journal"
    ]
  }
];

const tourismPattern =
  /tourism|hospitality|hotel|restaurant|travel|lodging|destination|dining|OTA|avatar|metaverse|food supply|cultured meat|consumer|guest/i;

const shtmJournalRules = [
  {
    grade: "A+",
    journals: [
      "Annals of Tourism Research",
      "International Journal of Contemporary Hospitality Management",
      "International Journal of Hospitality Management",
      "Journal of Hospitality and Tourism Research",
      "Journal of Travel Research",
      "Tourism Management"
    ]
  },
  {
    grade: "A",
    journals: [
      "Journal of Destination Marketing and Management",
      "Journal of Hospitality Marketing and Management",
      "Journal of Travel and Tourism Marketing",
      "Journal of Sustainable Tourism"
    ]
  },
  {
    grade: "B+",
    journals: [
      "Asia Pacific Journal of Tourism Research",
      "Cornell Hospitality Quarterly",
      "Current Issues in Tourism",
      "International Journal of Tourism Research",
      "Journal of Hospitality and Tourism Management",
      "Tourism Economics",
      "Tourism Geographies",
      "Tourism Management Perspectives",
      "Tourism Review"
    ]
  },
  {
    grade: "B",
    journals: [
      "Information Technology and Tourism",
      "International Journal of Hospitality and Tourism Administration",
      "Journal of China Tourism Research",
      "Journal of Convention and Event Tourism",
      "Journal of Foodservice Business Research",
      "Journal of Heritage Tourism",
      "Journal of Hospitality and Tourism Education",
      "Journal of Hospitality and Tourism Technology",
      "Journal of Hospitality, Leisure, Sport and Tourism Education",
      "Journal of Tourism and Cultural Change",
      "Journal of Vacation Marketing",
      "Tourism Analysis",
      "Tourism Recreation Research",
      "Tourism Tribune",
      "Tourist Studies"
    ]
  }
];

const sciencePattern =
  /solar|polymer|molecular|molecule|materials|organic|photoluminescence|computational materials|npj|Joule|Advanced Science|Nature Materials|biomedical|clinical|brain|health/i;

yearNode.textContent = new Date().getFullYear();

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks.dataset.open = String(!isOpen);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.dataset.open = "false";
  }
});

window.addEventListener(
  "scroll",
  () => {
    header.dataset.scrolled = String(window.scrollY > 12);
  },
  { passive: true }
);

const createEl = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
};

const escapeHtml = (value) => {
  return String(value).replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char];
  });
};

const cleanText = (value) => {
  return String(value)
    .replace(/\u00a0/g, " ")
    .replace(/聽鈥\?/g, "...")
    .replace(/聽…/g, "...")
    .replace(/聽/g, " ")
    .replace(/鈥恑/g, "-i")
    .replace(/鈥恡/g, "-t")
    .replace(/鈥恜/g, "-p")
    .replace(/鈥恥/g, "u")
    .replace(/鈥恇/g, "-b")
    .replace(/鈥恌/g, "-f")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizeJournalName = (value) => {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const formatVenue = (venue) => {
  const value = cleanText(venue);

  return value
    .replace(/^Findings of the Association for Computational Linguistics:\s*ACL\s*(\d{4})(.*)$/i, "ACL $1$2")
    .replace(/^Companion Proceedings of the ACM Web Conference\s*(\d{4})(.*)$/i, "WWW Companion $1$2")
    .replace(/^SIGMOD Companion\s*(\d{4}):.*$/i, "SIGMOD Companion $1")
    .replace(
      /^Proceedings of the 63rd Annual Meeting of the Association for Computational.*,\s*(\d{4})$/i,
      "ACL $1"
    )
    .replace(
      /^Proceedings of the 2025 Conference on Empirical Methods in Natural Language.*,\s*(\d{4})$/i,
      "EMNLP $1"
    )
    .replace(/^(WWW Companion|ACL)\s+(\d{4}),\s*([0-9-]+),\s*\2$/i, "$1 $2, $3");
};

const splitAuthors = (authors) => {
  return cleanText(authors).split(",").map((author) => author.trim()).filter(Boolean);
};

const isSelfAuthor = (author) => {
  return selfAuthorSet.has(normalizeAuthorKey(author));
};

const getSupervisedAuthorEntry = (author, year) => {
  const normalized = normalizeAuthorKey(author);
  return supervisedAuthorEntries.find((entry) => {
    const isNameMatch = entry.names.includes(normalized);
    const isYearMatch = !entry.activeUntilYear || Number(year) <= Number(entry.activeUntilYear);
    return isNameMatch && isYearMatch;
  });
};

const isSupervisedAuthor = (author, year) => {
  return Boolean(getSupervisedAuthorEntry(author, year));
};

const formatInitialToken = (token) => {
  if (!token) return "";
  if (/^[A-Z]{2,}$/.test(token)) {
    return token.split("").map((letter) => `${letter}.`).join(" ");
  }
  if (/^[A-Z]\.?$/.test(token)) {
    return `${token.charAt(0)}.`;
  }
  if (token.includes("-")) {
    return token
      .split("-")
      .filter(Boolean)
      .map((part) => `${part.charAt(0).toUpperCase()}.`)
      .join("-");
  }
  return `${token.charAt(0).toUpperCase()}.`;
};

const formatCompactAuthor = (author) => {
  const cleaned = cleanText(author);
  if (cleaned === "...") return "et al.";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return cleaned;

  if (/^[A-Z]{1,5}$/.test(parts[0]) && parts.length === 2) {
    return `${formatInitialToken(parts[0])} ${parts[1]}`;
  }

  const familyName = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map(formatInitialToken).filter(Boolean).join(" ");
  return `${initials} ${familyName}`;
};

const getAuthorDisplay = (author, year) => {
  if (isSelfAuthor(author)) {
    return { display: selfAuthorDisplayName, fullDisplay: "Chen Jason Zhang", type: "self" };
  }

  const supervisedAuthor = getSupervisedAuthorEntry(author, year);
  if (supervisedAuthor) {
    return {
      display: formatCompactAuthor(supervisedAuthor.displayName),
      fullDisplay: supervisedAuthor.displayName,
      type: "team"
    };
  }

  return { display: formatCompactAuthor(author), fullDisplay: cleanText(author), type: "default" };
};

const renderAuthorDisplay = (author) => {
  if (author.type === "self") {
    return `<strong class="author-self">${escapeHtml(author.display)}</strong>`;
  }
  if (author.type === "team") {
    return `<span class="author-team">${escapeHtml(author.display)}</span>`;
  }
  return escapeHtml(author.display);
};

const getAuthorDisplayKey = (author) => {
  if (author.display === "et al.") return "et-al";
  if (author.type === "self") return "self";
  if (author.type === "team") return normalizeAuthorKey(author.fullDisplay);
  return normalizeAuthorKey(author.fullDisplay || author.display);
};

const dedupeAuthorDisplays = (authors) => {
  const seen = new Set();
  return authors.filter((author) => {
    const key = getAuthorDisplayKey(author);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const formatAuthors = (authors, year, options = {}) => {
  const authorDisplays = dedupeAuthorDisplays(splitAuthors(authors).map((author) => getAuthorDisplay(author, year)));
  const visibleAuthorLimit = 8;
  const selfIndex = authorDisplays.findIndex((author) => author.type === "self");
  const hasTrailingEtAl = authorDisplays.some((author) => author.display === "et al.");
  let displayAuthors = authorDisplays;

  if (!options.showAllAuthors && (authorDisplays.length > visibleAuthorLimit || (hasTrailingEtAl && authorDisplays.length > 6))) {
    const selectedIndexes = new Set([0]);
    if (selfIndex >= 0) {
      selectedIndexes.add(selfIndex);
    }
    authorDisplays.forEach((author, index) => {
      if (author.type === "team" && selectedIndexes.size < 4) {
        selectedIndexes.add(index);
      }
    });

    const sortedIndexes = Array.from(selectedIndexes).sort((a, b) => a - b);
    displayAuthors = [];
    sortedIndexes.forEach((index, position) => {
      if (position > 0 && index - sortedIndexes[position - 1] > 1) {
        displayAuthors.push({ display: "...", fullDisplay: "...", type: "default" });
      }
      displayAuthors.push(authorDisplays[index]);
    });

    if (sortedIndexes[sortedIndexes.length - 1] < authorDisplays.length - 1 || hasTrailingEtAl) {
      displayAuthors.push({ display: "et al.", fullDisplay: "et al.", type: "default" });
    }
  }

  const displayCounts = displayAuthors.reduce((counts, author) => {
    counts.set(author.display, (counts.get(author.display) || 0) + 1);
    return counts;
  }, new Map());

  return displayAuthors
    .map((author) => {
      if (displayCounts.get(author.display) > 1) {
        author.display = author.fullDisplay;
      }
      return renderAuthorDisplay(author);
    })
    .join(", ");
};

const getTeamAuthorBadge = (publication) => {
  if (Object.prototype.hasOwnProperty.call(publication, "teamBadge")) {
    return publication.teamBadge;
  }

  const teamPositions = splitAuthors(publication.authors)
    .map((author, index) => (isSupervisedAuthor(author, publication.year) ? index : -1))
    .filter((index) => index >= 0);

  if (teamPositions.includes(0)) {
    return "Team-led";
  }
  if (teamPositions.some((index) => index <= 2)) {
    return "Team author";
  }
  return "";
};

const getPublicationSearchText = (publication) => {
  return cleanText([publication.title, publication.authors, publication.venue, publication.year].join(" "));
};

const isNonRegularConferencePaper = (text) => {
  return /\b(Companion|Findings|Workshop|Demo|Demonstration)\b/i.test(text);
};

const getPriorityVenue = (publication) => {
  const text = getPublicationSearchText(publication);
  return priorityVenueRules.find((rule) => rule.pattern.test(text));
};

const getCcfGrade = (publication) => {
  if (getPublicationArea(publication) !== "computer") {
    return "";
  }

  const text = getPublicationSearchText(publication);
  if (isNonRegularConferencePaper(text)) {
    return "";
  }

  const match = ccfVenueRules.find((rule) => rule.pattern.test(text));
  return match ? match.grade : "";
};

const getDepartmentTopLabel = (publication) => {
  if (getPublicationArea(publication) !== "computer") {
    return "";
  }

  const text = getPublicationSearchText(publication);
  if (isNonRegularConferencePaper(text)) {
    return "";
  }

  const venueName = normalizeJournalName(publication.venue);
  const journalEntries = departmentJournalRules
    .flatMap((group) => group.journals.map((journal) => ({ grade: group.grade, journal })))
    .sort((a, b) => normalizeJournalName(b.journal).length - normalizeJournalName(a.journal).length);
  const journalMatch = journalEntries.find((entry) => venueName.includes(normalizeJournalName(entry.journal)));
  if (journalMatch) {
    return `COMP ${journalMatch.grade}`;
  }

  const conferenceMatch = departmentTopConferenceRules.find((rule) => rule.pattern.test(text));
  return conferenceMatch ? conferenceMatch.label : "";
};

const getPublicationArea = (publication) => {
  const text = getPublicationSearchText(publication);
  const priorityVenue = getPriorityVenue(publication);
  if (priorityVenue) {
    return "computer";
  }
  return tourismPattern.test(text) ? "tourism" : "computer";
};

const getShtmJournalGrade = (publication) => {
  if (getPublicationArea(publication) !== "tourism") {
    return "";
  }

  const venueName = normalizeJournalName(publication.venue);
  const journalEntries = shtmJournalRules
    .flatMap((group) => group.journals.map((journal) => ({ grade: group.grade, journal })))
    .sort((a, b) => normalizeJournalName(b.journal).length - normalizeJournalName(a.journal).length);
  const match = journalEntries.find((entry) => venueName.includes(normalizeJournalName(entry.journal)));

  return match ? match.grade : "";
};

const getPublicationRank = (publication) => {
  if (typeof publication.priorityRank === "number") {
    return publication.priorityRank;
  }

  const priorityVenue = getPriorityVenue(publication);
  if (priorityVenue) {
    return priorityVenue.rank;
  }

  return sciencePattern.test(getPublicationSearchText(publication)) ? 11 : 12;
};

const comparePublications = (a, b) => {
  return (
    Number(b.year) - Number(a.year) ||
    getPublicationRank(a) - getPublicationRank(b) ||
    cleanText(a.title).localeCompare(cleanText(b.title))
  );
};

const renderDirections = () => {
  if (!directionList) return;

  data.directions.forEach((item) => {
    const row = createEl("p", "interest-line");
    row.append(createEl("strong", null, item.title));
    row.append(document.createTextNode(`: ${item.text}`));
    directionList.append(row);
  });
};

const renderThemes = () => {
  if (!themeList) return;

  data.themes.forEach((item, index) => {
    const article = createEl("article", "theme-row");
    article.append(createEl("span", "theme-index", String(index + 1).padStart(2, "0")));
    const body = createEl("div");
    body.append(createEl("h3", null, item.title));
    body.append(createEl("p", null, item.text));
    article.append(body);
    themeList.append(article);
  });
};

const renderPublications = () => {
  const groups = [
    {
      id: "publications-computer",
      title: "AI and Data Science",
      note: "Data management, database systems, AI/NLP, AI for science, FinTech, and social-good AI.",
      publications: data.publications.filter((pub) => getPublicationArea(pub) === "computer").sort(comparePublications)
    },
    {
      id: "publications-tourism",
      title: "Hospitality & Tourism",
      note: "Smart tourism, hospitality technology, travel analytics, digital service, and consumer behavior.",
      publications: data.publications.filter((pub) => getPublicationArea(pub) === "tourism").sort((a, b) => {
        return Number(b.year) - Number(a.year) || cleanText(a.title).localeCompare(cleanText(b.title));
      })
    }
  ];

  publicationList.replaceChildren();

  groups.forEach((group) => {
    if (!group.publications.length) return;

    const section = createEl("section", "publication-group");
    section.id = group.id;
    const header = createEl("div", "publication-group-header");
    const heading = createEl("h3", null, group.title);
    header.append(heading);
    header.append(createEl("p", null, group.note));
    section.append(header);

    const list = createEl("ol", "publication-list");
    group.publications.forEach((pub) => {
      const item = createEl("li", "publication-item");
      const meta = createEl("div", "publication-meta");
      const priorityVenue = getPriorityVenue(pub);
      const shtmGrade = getShtmJournalGrade(pub);
      const ccfGrade = getCcfGrade(pub);
      const departmentTopLabel = getDepartmentTopLabel(pub);

      meta.append(createEl("span", "year-pill", String(pub.year)));
      if (priorityVenue) {
        meta.append(createEl("span", "venue-pill", priorityVenue.label));
      }
      if (ccfGrade) {
        meta.append(createEl("span", "ccf-pill", `CCF ${ccfGrade}`));
      }
      if (departmentTopLabel) {
        meta.append(createEl("span", "dept-pill", departmentTopLabel));
      }
      if (shtmGrade) {
        meta.append(createEl("span", "shtm-pill", `SHTM ${shtmGrade}`));
      }

      const title = createEl("h4", null, cleanText(pub.title));

      item.append(meta);
      item.append(title);
      const authors = createEl("p", "authors");
      authors.innerHTML = formatAuthors(pub.authors, pub.year, { showAllAuthors: pub.showAllAuthors });
      item.append(authors);
      item.append(createEl("p", "venue", formatVenue(pub.venue)));
      list.append(item);
    });
    section.append(list);
    publicationList.append(section);
  });
};

renderDirections();
renderThemes();
renderPublications();
