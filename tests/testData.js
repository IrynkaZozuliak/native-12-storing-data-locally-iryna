const MyWords = [
  {
    word: "hello",
    phonetics: "həˈləʊ",

    audio:
      "https://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3",

    meaning: "used as a greeting or to begin a phone conversation.",
  },
  {
    word: "develop",
    phonetics: "/dɛˈvɛ.ləp/",
    audio:
      "https://api.dictionaryapi.dev/media/pronunciations/en/develop-us.mp3",

    partOfSpeech: "verb",
    meaning: "To change with a specific direction, progress.",
  },
  {
    word: "investigate",
    phonetics: "[ɪn.ˈves.tɪ.ɡeɪ̯t]",
    partOfSpeech: "verb",
    audio:
      "https://api.dictionaryapi.dev/media/pronunciations/en/investigate-us.mp3",
    sourceUrl: "https://commons.wikimedia.org/w/index.php?curid=2453554",

    meaning:
      "To inquire into or study in order to ascertain facts or information.",
  },
  {
    word: "customize",
    phonetics: "/ˈkʌst.ə.maɪ̯z/",
    partOfSpeech: "verb",
    meaning:
      "To build or alter according to personal preferences or specifications.",
  },
];

const savedWords = [
  {
    audio: "https://api.dictionaryapi.dev/media/pronunciations/en/test-uk.mp3",
    dateForgets: 1704826861755,
    dateTotallyForgets: 1704827821755,
    forgettingSpan: 1920000,
    image:
      "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FDictionary-35829641-54e0-4a4b-b05f-49ea5ac0af23/ImagePicker/24ebf097-5826-43db-8ca9-3e882e93c883.png",
    meaning: "A challenge, trial.",
    phonetics: "/test/",
    status: 0,
    word: "test",
  },
  {
    audio:
      "https://api.dictionaryapi.dev/media/pronunciations/en/tradition-us.mp3",
    dateForgets: 1704826023704,
    dateTotallyForgets: 1704826143704,
    forgettingSpan: 240000,
    image:
      "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FDictionary-35829641-54e0-4a4b-b05f-49ea5ac0af23/ImagePicker/99c9fbb1-8f57-4ca5-9d33-3db15365e0aa.png",
    meaning:
      "!!!A part of culture that is passed from person to person or generation to generation, possibly differing in detail from family to family, such as the way to celebrate holidays.",
    phonetics: "/tɹəˈdɪʃn̩/",
    status: 0,
    word: "tradition",
  },
  {
    audio:
      "https://api.dictionaryapi.dev/media/pronunciations/en/initial-us.mp3",
    dateForgets: 1704815429450,
    dateTotallyForgets: 1704815549450,
    forgettingSpan: 120000,
    image:
      "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FDictionary-35829641-54e0-4a4b-b05f-49ea5ac0af23/ImagePicker/5fece737-da63-4ad1-8fdd-3d8f7e4df9a7.jpeg",
    meaning: "The first letter of a word or a name.",
    phonetics: "/ɪˈnɪʃəl/",
    status: 0,
    word: "initial",
  },
  {
    audio: "https://api.dictionaryapi.dev/media/pronunciations/en/fact-us.mp3",
    dateForgets: 1704825517540,
    dateTotallyForgets: 1704825637540,
    forgettingSpan: 120000,
    image:
      "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FDictionary-35829641-54e0-4a4b-b05f-49ea5ac0af23/ImagePicker/4dffd46e-c9b3-4e47-b4be-0016301a5b2c.png",
    meaning: "Something actual as opposed to invented.",
    phonetics: "/fækt/",
    status: 0,
    word: "fact",
  },
  {
    audio: "",
    dateForgets: 1704825556140,
    dateTotallyForgets: 1704825676140,
    forgettingSpan: 120000,
    image: null,
    meaning: "An alarm.",
    phonetics: "/əˈlɜːt/",
    status: 0,
    word: "alert",
  },
  {
    audio:
      "https://api.dictionaryapi.dev/media/pronunciations/en/achievement-us.mp3",
    dateForgets: 1704825589839,
    dateTotallyForgets: 1704825709839,
    forgettingSpan: 120000,
    image: null,
    meaning:
      "The act of achieving or performing; a successful performance; accomplishment",
    phonetics: "/əˈtʃiːvmənt/",
    status: 0,
    word: "achievement",
  },
];

export { MyWords, savedWords };
