const manifest = {"name":"Shoehorn"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const callable = api.callable;
const toaster = api.toaster;
const openFilePicker = api.openFilePicker;
const useQuickAccessVisible = api.useQuickAccessVisible;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var attr = props.attr,
      size = props.size,
      title = props.title,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaShoePrints (props) {
  return GenIcon({"attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M192 160h32V32h-32c-35.35 0-64 28.65-64 64s28.65 64 64 64zM0 416c0 35.35 28.65 64 64 64h32V352H64c-35.35 0-64 28.65-64 64zm337.46-128c-34.91 0-76.16 13.12-104.73 32-24.79 16.38-44.52 32-104.73 32v128l57.53 15.97c26.21 7.28 53.01 13.12 80.31 15.05 32.69 2.31 65.6.67 97.58-6.2C472.9 481.3 512 429.22 512 384c0-64-84.18-96-174.54-96zM491.42 7.19C459.44.32 426.53-1.33 393.84.99c-27.3 1.93-54.1 7.77-80.31 15.04L256 32v128c60.2 0 79.94 15.62 104.73 32 28.57 18.88 69.82 32 104.73 32C555.82 224 640 192 640 128c0-45.22-39.1-97.3-148.58-120.81z"},"child":[]}]})(props);
}

const listGames = callable("list_games");
const home = callable("home");
const describePath = callable("describe_path");
const staleShortcuts = callable("stale_shortcuts");
const describeShortcut = callable("describe_shortcut");
const preparePrefix = callable("prepare_prefix");
const detectLocale = callable("installer_locale");

const EN = {
    game: "Game",
    installedGames: "Installed games",
    pickGame: "Pick a game",
    prefix: "Prefix",
    noPrefix: "No prefix yet",
    noPrefixHint: "Launch the game once so Steam creates it.",
    installer: "Installer",
    chooseExe: "Choose .exe…",
    localeMissing: "Installer text needs {locale}, which this system does not have",
    run: "Run",
    openInLibrary: "Open in library",
    openInLibraryHint: "If it did not start on its own, press Play there.",
    removeShortcut: "Remove leftover shortcut",
    removeShortcutHint: "Steam needs a library entry to launch anything; this removes it.",
    installMod: "Install a mod",
    pickedFolder: "{name} is a folder — open it and pick the installer inside",
    pickedNotFile: "{name} is not a file",
    gameHasNoPrefix: "{game} has no prefix yet — launch it once first",
    prefixOverrideLost: "Steam did not keep the prefix override — not launching",
    prefixBusy: "{game} is still running — close it and try again",
    noCompatTool: "No compatibility tool is set for {game} — the installer may not open",
    closedAndRemoved: "{name} closed, shortcut removed",
    shortcutRemoved: "Shortcut removed",
    failed: "Failed",
};
const RU = {
    game: "Игра",
    installedGames: "Установленные игры",
    pickGame: "Выберите игру",
    prefix: "Префикс",
    noPrefix: "Префикса ещё нет",
    noPrefixHint: "Запустите игру один раз, чтобы Steam его создал.",
    installer: "Установщик",
    chooseExe: "Выбрать .exe…",
    localeMissing: "Тексту установщика нужна локаль {locale}, а в системе её нет",
    run: "Запустить",
    openInLibrary: "Открыть в библиотеке",
    openInLibraryHint: "Если не запустился сам — нажмите «Играть» там.",
    removeShortcut: "Удалить оставшийся ярлык",
    removeShortcutHint: "Steam умеет запускать только записи из библиотеки; эта кнопка убирает её.",
    installMod: "Установить модификацию",
    pickedFolder: "{name} — это папка, откройте её и выберите установщик внутри",
    pickedNotFile: "{name} — не файл",
    gameHasNoPrefix: "У игры {game} ещё нет префикса — запустите её один раз",
    prefixOverrideLost: "Steam не сохранил подмену префикса — запуск отменён",
    prefixBusy: "{game} ещё запущена — закройте её и попробуйте снова",
    noCompatTool: "Для {game} не выбран инструмент совместимости — установщик может не открыться",
    closedAndRemoved: "{name} закрыт, ярлык удалён",
    shortcutRemoved: "Ярлык удалён",
    failed: "Ошибка",
};
const UK = {
    game: "Гра",
    installedGames: "Встановлені ігри",
    pickGame: "Виберіть гру",
    prefix: "Префікс",
    noPrefix: "Префікса ще немає",
    noPrefixHint: "Запустіть гру один раз, щоб Steam його створив.",
    installer: "Встановлювач",
    chooseExe: "Вибрати .exe…",
    localeMissing: "Тексту встановлювача потрібна локаль {locale}, а в системі її немає",
    run: "Запустити",
    openInLibrary: "Відкрити в бібліотеці",
    openInLibraryHint: "Якщо не запустився сам — натисніть «Грати» там.",
    removeShortcut: "Видалити залишений ярлик",
    removeShortcutHint: "Steam запускає лише записи з бібліотеки; ця кнопка прибирає її.",
    installMod: "Встановити модифікацію",
    pickedFolder: "{name} — це тека, відкрийте її та виберіть встановлювач усередині",
    pickedNotFile: "{name} — не файл",
    gameHasNoPrefix: "У гри {game} ще немає префікса — запустіть її один раз",
    prefixOverrideLost: "Steam не зберіг підміну префікса — запуск скасовано",
    prefixBusy: "{game} ще запущена — закрийте її та спробуйте знову",
    noCompatTool: "Для {game} не вибрано інструмент сумісності — установник може не відкритися",
    closedAndRemoved: "{name} закрито, ярлик видалено",
    shortcutRemoved: "Ярлик видалено",
    failed: "Помилка",
};
const DE = {
    game: "Spiel",
    installedGames: "Installierte Spiele",
    pickGame: "Spiel wählen",
    prefix: "Präfix",
    noPrefix: "Noch kein Präfix",
    noPrefixHint: "Starte das Spiel einmal, damit Steam es anlegt.",
    installer: "Installationsprogramm",
    chooseExe: ".exe wählen…",
    localeMissing: "Der Text des Installers benötigt {locale}, das auf diesem System fehlt",
    run: "Starten",
    openInLibrary: "In der Bibliothek öffnen",
    openInLibraryHint: "Falls es nicht von selbst startet, dort auf Spielen drücken.",
    removeShortcut: "Übrige Verknüpfung entfernen",
    removeShortcutHint: "Steam startet nur Bibliothekseinträge; dies entfernt ihn wieder.",
    installMod: "Mod installieren",
    pickedFolder: "{name} ist ein Ordner – öffne ihn und wähle das Installationsprogramm darin",
    pickedNotFile: "{name} ist keine Datei",
    gameHasNoPrefix: "{game} hat noch kein Präfix – starte es einmal",
    prefixOverrideLost: "Steam hat das Präfix nicht übernommen – kein Start",
    prefixBusy: "{game} läuft noch — beenden und erneut versuchen",
    noCompatTool: "Für {game} ist kein Kompatibilitätstool gewählt — der Installer öffnet sich womöglich nicht",
    closedAndRemoved: "{name} beendet, Verknüpfung entfernt",
    shortcutRemoved: "Verknüpfung entfernt",
    failed: "Fehler",
};
const FR = {
    game: "Jeu",
    installedGames: "Jeux installés",
    pickGame: "Choisir un jeu",
    prefix: "Préfixe",
    noPrefix: "Pas encore de préfixe",
    noPrefixHint: "Lancez le jeu une fois pour que Steam le crée.",
    installer: "Programme d'installation",
    chooseExe: "Choisir un .exe…",
    localeMissing: "Le texte de l'installateur nécessite {locale}, absent de ce système",
    run: "Lancer",
    openInLibrary: "Ouvrir dans la bibliothèque",
    openInLibraryHint: "S'il ne démarre pas tout seul, appuyez sur Jouer là-bas.",
    removeShortcut: "Supprimer le raccourci restant",
    removeShortcutHint: "Steam ne lance que des entrées de bibliothèque ; ceci la supprime.",
    installMod: "Installer un mod",
    pickedFolder: "{name} est un dossier — ouvrez-le et choisissez l'installateur à l'intérieur",
    pickedNotFile: "{name} n'est pas un fichier",
    gameHasNoPrefix: "{game} n'a pas encore de préfixe — lancez-le une fois",
    prefixOverrideLost: "Steam n'a pas conservé le préfixe — lancement annulé",
    prefixBusy: "{game} est encore lancé — fermez-le et réessayez",
    noCompatTool: "Aucun outil de compatibilité pour {game} — l’installateur peut ne pas s’ouvrir",
    closedAndRemoved: "{name} fermé, raccourci supprimé",
    shortcutRemoved: "Raccourci supprimé",
    failed: "Échec",
};
const ES = {
    game: "Juego",
    installedGames: "Juegos instalados",
    pickGame: "Elige un juego",
    prefix: "Prefijo",
    noPrefix: "Aún sin prefijo",
    noPrefixHint: "Abre el juego una vez para que Steam lo cree.",
    installer: "Instalador",
    chooseExe: "Elegir .exe…",
    localeMissing: "El texto del instalador necesita {locale}, que no está en este sistema",
    run: "Ejecutar",
    openInLibrary: "Abrir en la biblioteca",
    openInLibraryHint: "Si no arrancó solo, pulsa Jugar allí.",
    removeShortcut: "Eliminar el acceso directo sobrante",
    removeShortcutHint: "Steam solo lanza entradas de la biblioteca; esto la elimina.",
    installMod: "Instalar un mod",
    pickedFolder: "{name} es una carpeta: ábrela y elige el instalador dentro",
    pickedNotFile: "{name} no es un archivo",
    gameHasNoPrefix: "{game} aún no tiene prefijo: ábrelo una vez",
    prefixOverrideLost: "Steam no conservó el prefijo: no se inicia",
    prefixBusy: "{game} sigue en ejecución — ciérralo e inténtalo de nuevo",
    noCompatTool: "{game} no tiene herramienta de compatibilidad — el instalador puede no abrirse",
    closedAndRemoved: "{name} se cerró, acceso directo eliminado",
    shortcutRemoved: "Acceso directo eliminado",
    failed: "Error",
};
const PT = {
    game: "Jogo",
    installedGames: "Jogos instalados",
    pickGame: "Escolha um jogo",
    prefix: "Prefixo",
    noPrefix: "Ainda sem prefixo",
    noPrefixHint: "Abra o jogo uma vez para o Steam criá-lo.",
    installer: "Instalador",
    chooseExe: "Escolher .exe…",
    localeMissing: "O texto do instalador precisa de {locale}, que não existe neste sistema",
    run: "Executar",
    openInLibrary: "Abrir na biblioteca",
    openInLibraryHint: "Se não iniciar sozinho, aperte Jogar por lá.",
    removeShortcut: "Remover o atalho restante",
    removeShortcutHint: "O Steam só inicia itens da biblioteca; isto remove o atalho.",
    installMod: "Instalar um mod",
    pickedFolder: "{name} é uma pasta — abra-a e escolha o instalador lá dentro",
    pickedNotFile: "{name} não é um arquivo",
    gameHasNoPrefix: "{game} ainda não tem prefixo — abra o jogo uma vez",
    prefixOverrideLost: "O Steam não manteve o prefixo — não vou iniciar",
    prefixBusy: "{game} ainda está em execução — feche e tente novamente",
    noCompatTool: "{game} não tem ferramenta de compatibilidade — o instalador pode não abrir",
    closedAndRemoved: "{name} fechou, atalho removido",
    shortcutRemoved: "Atalho removido",
    failed: "Falha",
};
const IT = {
    game: "Gioco",
    installedGames: "Giochi installati",
    pickGame: "Scegli un gioco",
    prefix: "Prefisso",
    noPrefix: "Nessun prefisso",
    noPrefixHint: "Avvia il gioco una volta così Steam lo crea.",
    installer: "Installer",
    chooseExe: "Scegli .exe…",
    localeMissing: "Il testo dell'installer richiede {locale}, assente su questo sistema",
    run: "Avvia",
    openInLibrary: "Apri nella libreria",
    openInLibraryHint: "Se non parte da solo, premi Gioca lì.",
    removeShortcut: "Rimuovi il collegamento rimasto",
    removeShortcutHint: "Steam avvia solo voci della libreria; questo la rimuove.",
    installMod: "Installa una mod",
    pickedFolder: "{name} è una cartella — aprila e scegli l'installer dentro",
    pickedNotFile: "{name} non è un file",
    gameHasNoPrefix: "{game} non ha ancora un prefisso — avvialo una volta",
    prefixOverrideLost: "Steam non ha mantenuto il prefisso — non avvio",
    prefixBusy: "{game} è ancora in esecuzione — chiudilo e riprova",
    noCompatTool: "Nessuno strumento di compatibilità per {game} — il programma di installazione potrebbe non aprirsi",
    closedAndRemoved: "{name} chiuso, collegamento rimosso",
    shortcutRemoved: "Collegamento rimosso",
    failed: "Errore",
};
const PL = {
    game: "Gra",
    installedGames: "Zainstalowane gry",
    pickGame: "Wybierz grę",
    prefix: "Prefiks",
    noPrefix: "Brak prefiksu",
    noPrefixHint: "Uruchom grę raz, aby Steam go utworzył.",
    installer: "Instalator",
    chooseExe: "Wybierz .exe…",
    localeMissing: "Tekst instalatora wymaga {locale}, którego nie ma w systemie",
    run: "Uruchom",
    openInLibrary: "Otwórz w bibliotece",
    openInLibraryHint: "Jeśli nie wystartował sam, naciśnij tam Graj.",
    removeShortcut: "Usuń pozostały skrót",
    removeShortcutHint: "Steam uruchamia tylko wpisy z biblioteki; to go usuwa.",
    installMod: "Zainstaluj modyfikację",
    pickedFolder: "{name} to folder — otwórz go i wybierz instalator w środku",
    pickedNotFile: "{name} nie jest plikiem",
    gameHasNoPrefix: "{game} nie ma jeszcze prefiksu — uruchom grę raz",
    prefixOverrideLost: "Steam nie zachował prefiksu — nie uruchamiam",
    prefixBusy: "{game} jest wciąż uruchomiona — zamknij ją i spróbuj ponownie",
    noCompatTool: "{game} nie ma narzędzia zgodności — instalator może się nie otworzyć",
    closedAndRemoved: "{name} zamknięty, skrót usunięty",
    shortcutRemoved: "Skrót usunięty",
    failed: "Błąd",
};
const TR = {
    game: "Oyun",
    installedGames: "Kurulu oyunlar",
    pickGame: "Bir oyun seç",
    prefix: "Ön ek",
    noPrefix: "Henüz ön ek yok",
    noPrefixHint: "Steam'in oluşturması için oyunu bir kez başlat.",
    installer: "Kurulum dosyası",
    chooseExe: ".exe seç…",
    localeMissing: "Kurulum metni {locale} gerektiriyor, bu sistemde yok",
    run: "Çalıştır",
    openInLibrary: "Kitaplıkta aç",
    openInLibraryHint: "Kendi başlamadıysa oradan Oyna'ya bas.",
    removeShortcut: "Kalan kısayolu kaldır",
    removeShortcutHint: "Steam yalnızca kitaplık girdilerini başlatır; bu onu kaldırır.",
    installMod: "Mod yükle",
    pickedFolder: "{name} bir klasör — içine girip kurulum dosyasını seç",
    pickedNotFile: "{name} bir dosya değil",
    gameHasNoPrefix: "{game} için ön ek yok — önce bir kez başlat",
    prefixOverrideLost: "Steam ön eki korumadı — başlatılmıyor",
    prefixBusy: "{game} hâlâ çalışıyor — kapatıp yeniden deneyin",
    noCompatTool: "{game} için uyumluluk aracı seçilmemiş — yükleyici açılmayabilir",
    closedAndRemoved: "{name} kapandı, kısayol kaldırıldı",
    shortcutRemoved: "Kısayol kaldırıldı",
    failed: "Hata",
};
const JA = {
    game: "ゲーム",
    installedGames: "インストール済みのゲーム",
    pickGame: "ゲームを選択",
    prefix: "プレフィックス",
    noPrefix: "プレフィックスがありません",
    noPrefixHint: "一度ゲームを起動すると Steam が作成します。",
    installer: "インストーラー",
    chooseExe: ".exe を選択…",
    localeMissing: "インストーラーの文字表示に {locale} が必要ですが、このシステムにはありません",
    run: "実行",
    openInLibrary: "ライブラリで開く",
    openInLibraryHint: "自動で始まらない場合は、そこでプレイを押してください。",
    removeShortcut: "残ったショートカットを削除",
    removeShortcutHint: "Steam はライブラリの項目しか起動できません。これで削除します。",
    installMod: "Mod をインストール",
    pickedFolder: "{name} はフォルダーです。開いて中のインストーラーを選んでください",
    pickedNotFile: "{name} はファイルではありません",
    gameHasNoPrefix: "{game} にはまだプレフィックスがありません。一度起動してください",
    prefixOverrideLost: "Steam がプレフィックス指定を保持しませんでした。起動を中止します",
    prefixBusy: "{game} がまだ実行中です。終了してからもう一度お試しください",
    noCompatTool: "{game} に互換ツールが設定されていません。インストーラーが開かない場合があります",
    closedAndRemoved: "{name} を終了し、ショートカットを削除しました",
    shortcutRemoved: "ショートカットを削除しました",
    failed: "失敗",
};
const KO = {
    game: "게임",
    installedGames: "설치된 게임",
    pickGame: "게임 선택",
    prefix: "프리픽스",
    noPrefix: "아직 프리픽스가 없음",
    noPrefixHint: "게임을 한 번 실행하면 Steam이 만들어 줍니다.",
    installer: "설치 파일",
    chooseExe: ".exe 선택…",
    localeMissing: "설치 파일 텍스트에 {locale} 가 필요하지만 이 시스템에 없습니다",
    run: "실행",
    openInLibrary: "라이브러리에서 열기",
    openInLibraryHint: "저절로 시작되지 않으면 그곳에서 플레이를 누르세요.",
    removeShortcut: "남은 바로가기 삭제",
    removeShortcutHint: "Steam은 라이브러리 항목만 실행합니다. 이 버튼이 항목을 지웁니다.",
    installMod: "모드 설치",
    pickedFolder: "{name} 은 폴더입니다. 열어서 안의 설치 파일을 선택하세요",
    pickedNotFile: "{name} 은 파일이 아닙니다",
    gameHasNoPrefix: "{game} 에 아직 프리픽스가 없습니다. 먼저 한 번 실행하세요",
    prefixOverrideLost: "Steam이 프리픽스 설정을 유지하지 않았습니다. 실행하지 않습니다",
    prefixBusy: "{game}이(가) 아직 실행 중입니다. 종료한 뒤 다시 시도하세요",
    noCompatTool: "{game}에 호환성 도구가 설정되지 않았습니다. 설치 프로그램이 열리지 않을 수 있습니다",
    closedAndRemoved: "{name} 종료됨, 바로가기 삭제됨",
    shortcutRemoved: "바로가기 삭제됨",
    failed: "실패",
};
const ZH_CN = {
    game: "游戏",
    installedGames: "已安装的游戏",
    pickGame: "选择游戏",
    prefix: "前缀",
    noPrefix: "尚无前缀",
    noPrefixHint: "先启动一次游戏，让 Steam 创建它。",
    installer: "安装程序",
    chooseExe: "选择 .exe…",
    localeMissing: "安装程序的文本需要 {locale}，但系统中没有",
    run: "运行",
    openInLibrary: "在库中打开",
    openInLibraryHint: "如果没有自动启动，请在那里按开始游戏。",
    removeShortcut: "删除残留的快捷方式",
    removeShortcutHint: "Steam 只能启动库中的条目；此按钮将其删除。",
    installMod: "安装模组",
    pickedFolder: "{name} 是文件夹——请打开它并选择里面的安装程序",
    pickedNotFile: "{name} 不是文件",
    gameHasNoPrefix: "{game} 还没有前缀——请先启动一次",
    prefixOverrideLost: "Steam 没有保留前缀设置——不启动",
    prefixBusy: "{game} 仍在运行，请先关闭后重试",
    noCompatTool: "{game} 未设置兼容性工具，安装程序可能无法打开",
    closedAndRemoved: "{name} 已关闭，快捷方式已删除",
    shortcutRemoved: "快捷方式已删除",
    failed: "失败",
};
const ZH_TW = {
    game: "遊戲",
    installedGames: "已安裝的遊戲",
    pickGame: "選擇遊戲",
    prefix: "前綴",
    noPrefix: "尚無前綴",
    noPrefixHint: "先啟動一次遊戲，讓 Steam 建立它。",
    installer: "安裝程式",
    chooseExe: "選擇 .exe…",
    localeMissing: "安裝程式的文字需要 {locale}，但系統中沒有",
    run: "執行",
    openInLibrary: "在收藏庫中開啟",
    openInLibraryHint: "如果沒有自動啟動，請在那裡按開始遊戲。",
    removeShortcut: "刪除殘留的捷徑",
    removeShortcutHint: "Steam 只能啟動收藏庫中的項目；此按鈕會將其刪除。",
    installMod: "安裝模組",
    pickedFolder: "{name} 是資料夾——請開啟它並選擇裡面的安裝程式",
    pickedNotFile: "{name} 不是檔案",
    gameHasNoPrefix: "{game} 還沒有前綴——請先啟動一次",
    prefixOverrideLost: "Steam 沒有保留前綴設定——不啟動",
    prefixBusy: "{game} 仍在執行，請先關閉後重試",
    noCompatTool: "{game} 未設定相容性工具，安裝程式可能無法開啟",
    closedAndRemoved: "{name} 已關閉，捷徑已刪除",
    shortcutRemoved: "捷徑已刪除",
    failed: "失敗",
};
const DICTIONARIES = {
    de: DE,
    es: ES,
    fr: FR,
    it: IT,
    ja: JA,
    ko: KO,
    pl: PL,
    pt: PT,
    ru: RU,
    tr: TR,
    uk: UK,
    zh: ZH_CN,
    "zh-tw": ZH_TW,
    "zh-hant": ZH_TW,
};
const candidates = () => {
    const [preferred] = window.LocalizationManager?.m_rgLocalesToUse ?? [];
    const code = (preferred || navigator.language || "en").toLowerCase();
    return [code, code.split("-")[0]];
};
const t = (key, values = {}) => {
    const dictionary = candidates()
        .map((code) => DICTIONARIES[code])
        .find(Boolean);
    const text = dictionary?.[key] ?? EN[key];
    return text.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
};

const note = (key, values) => toaster.toast({ title: "Shoehorn", body: t(key, values) });
const failed = (key, values) => toaster.toast({ title: `Shoehorn: ${t("failed")}`, body: t(key, values) });
const failedWith = (error) => toaster.toast({ title: `Shoehorn: ${t("failed")}`, body: String(error) });

const session = { games: [] };
const listeners = new Set();
/** Write a value and redraw. Usable outside React, which the context-menu
 * entry needs. */
function setSession(key, value) {
    session[key] = value;
    for (const listener of listeners)
        listener();
}
/** Read a value, following it while mounted. Read live rather than snapshotted
 * at mount, because an awaited call returns exactly when the panel is being
 * rebuilt — including into the gap before the subscription exists. */
function useSession(key) {
    const [, redraw] = SP_REACT.useState(0);
    const rendered = session[key];
    SP_REACT.useEffect(() => {
        const listener = () => redraw((count) => count + 1);
        listeners.add(listener);
        if (session[key] !== rendered)
            listener();
        return () => {
            listeners.delete(listener);
        };
    }, []);
    return [rendered, (next) => setSession(key, next)];
}

const TENFOOT_LAUNCH_SOURCE = 200;
const NO_LAUNCH_OPTION = -1;
const SHORTCUT_GAMEID_FLAG = BigInt(0x02000000);
const GAMEID_APPID_SHIFT = BigInt(32);
const NAME_PREFIX = "Shoehorn: ";
const POLL_ATTEMPTS = 20;
const POLL_INTERVAL = 150;
/** One per shortcut, so a second install cannot orphan the first's cleanup. */
const watchers = new Map();
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/** Ask until the answer is the one being waited for, then give up and return
 * whatever came last. Steam fills its files and stores on its own schedule. */
const settle = async (probe, accept) => {
    let value = await probe();
    for (let attempt = 1; attempt < POLL_ATTEMPTS && !accept(value); attempt += 1) {
        await pause(POLL_INTERVAL);
        value = await probe();
    }
    return value;
};
const running = (appId) => (DFL.Router.RunningApps ?? []).some((app) => Number(app.appid) === appId);
const stopWatching = (appId) => {
    for (const [id, watcher] of watchers) {
        if (appId !== undefined && id !== appId)
            continue;
        watcher.unregister();
        watchers.delete(id);
    }
};
const dropShortcut = (appId) => {
    stopWatching(appId);
    SteamClient.Apps.RemoveShortcut(appId);
    if (session.shortcut === appId)
        setSession("shortcut", undefined);
};
/** Remove the shortcut once its installer has exited. A running notification
 * has to arrive first, or a stale "not running" would delete the shortcut
 * before the launch it belongs to — except for one already known to run. */
const watchForExit = (appId, name, startedAlready = false) => {
    stopWatching(appId);
    let started = startedAlready;
    watchers.set(appId, SteamClient.GameSessions.RegisterForAppLifetimeNotifications((notification) => {
        if (notification.unAppID !== appId)
            return;
        if (notification.bRunning) {
            started = true;
            return;
        }
        if (!started)
            return;
        dropShortcut(appId);
        note("closedAndRemoved", { name });
    }));
};
const installerName = (shortcutName, appId) => shortcutName?.replace(NAME_PREFIX, "") ?? String(appId);
/** Clean up after a previous run, whose watchers are gone. One still running
 * is adopted instead: a reload must not take the entry out from under an open
 * installer. */
const dropStaleShortcuts = async () => {
    for (const appId of await staleShortcuts().catch(() => [])) {
        if (!running(appId)) {
            SteamClient.Apps.RemoveShortcut(appId);
            continue;
        }
        const stored = await describeShortcut(appId).catch(() => null);
        watchForExit(appId, installerName(stored?.name, appId), true);
    }
};
/** The 64-bit id Steam launches a non-Steam shortcut by. */
const shortcutGameId = (appId) => ((BigInt(appId) << GAMEID_APPID_SHIFT) | SHORTCUT_GAMEID_FLAG).toString();
/** Run an installer inside a game's prefix, as a throwaway library entry (see
 * README). AddShortcut takes only a name and an executable — anything else it
 * is handed ends up parsed as arguments — so the rest is set field by field
 * afterwards, and read back to be sure Steam kept it. */
const launchInstaller = async ({ game, installer, locale, previous, }) => {
    const prepared = await preparePrefix(game.appid);
    if ("reason" in prepared) {
        return { error: prepared.reason === "no prefix" ? "gameHasNoPrefix" : "prefixBusy" };
    }
    if (previous !== undefined && !running(previous))
        dropShortcut(previous);
    const name = installer.split("/").pop() ?? installer;
    const created = await SteamClient.Apps.AddShortcut(`${NAME_PREFIX}${name}`, installer, "", "");
    SteamClient.Apps.SetShortcutName(created, `${NAME_PREFIX}${name}`);
    SteamClient.Apps.SetShortcutStartDir(created, game.path);
    const localeVars = locale ? `LANG=${locale} LC_ALL=${locale} ` : "";
    SteamClient.Apps.SetShortcutLaunchOptions(created, `${localeVars}STEAM_COMPAT_DATA_PATH="${game.compat_path}" %command%`);
    /** Without a tool Steam runs a Windows installer natively, which ends the
     * moment it starts. */
    const inherited = window.appDetailsStore?.GetAppDetails(Number(game.appid))?.strCompatToolName;
    if (inherited)
        SteamClient.Apps.SpecifyCompatTool(created, inherited);
    else
        note("noCompatTool", { game: game.name });
    const kept = (stored) => !!stored?.launch_options.includes(game.compat_path);
    if (!kept(await settle(() => describeShortcut(created), kept))) {
        dropShortcut(created);
        return { error: "prefixOverrideLost" };
    }
    const overview = await settle(() => window.appStore?.GetAppOverviewByAppID(created), (candidate) => !!candidate?.gameid);
    watchForExit(created, name);
    SteamClient.Apps.RunGame(overview?.gameid ?? shortcutGameId(created), "", NO_LAUNCH_OPTION, TENFOOT_LAUNCH_SOURCE);
    return { shortcut: created };
};

const PLUGIN_NAME = "Shoehorn";
/** Open this plugin's Quick Access page with a game already chosen, through
 * the same call Decky's own plugin list makes. */
const openPanelFor = (appid) => {
    setSession("appid", appid);
    setSession("installer", undefined);
    setSession("locale", undefined);
    setSession("localeMissing", undefined);
    window.DeckyPluginLoader?.deckyState?.setActivePlugin(PLUGIN_NAME);
    DFL.Navigation.OpenQuickAccessMenu(DFL.QuickAccessTab.Decky);
};

const ITEM_KEY = "shoehorn-install-mod";
const CACHE_TTL = 30000;
let refreshed = 0;
/** Keep the game list warm: a menu renders in one pass with nothing to await,
 * and the answer only changes when a game is installed or removed. */
const refreshGames = () => {
    if (Date.now() - refreshed < CACHE_TTL)
        return;
    refreshed = Date.now();
    listGames()
        .then((games) => setSession("games", games))
        .catch(() => undefined);
};
const installable = (appid) => session.games.some((game) => game.appid === appid && game.has_prefix);
const item = (appid) => (SP_JSX.jsx(DFL.MenuItem, { onSelected: () => openPanelFor(appid), children: t("installMod") }, ITEM_KEY));
/** Where "Properties…" sits, or -1. Also the test for which menu this is: the
 * gear menu and its "Manage" submenu share the Menu class, and both carry an
 * item mentioning `launchSource`, but only the top level has Properties. */
const propertiesIndex = (children) => children.findIndex((child) => DFL.findInReactTree(child, (node) => !!node?.onSelected?.toString().includes("AppProperties")));
const dedupe = (children) => {
    for (let index = children.length - 1; index >= 0; index -= 1) {
        if (children[index]?.key === ITEM_KEY)
            children.splice(index, 1);
    }
};
const ownerAppid = (node) => {
    const appid = node?._owner?.pendingProps?.overview?.appid;
    return appid === undefined ? undefined : String(appid);
};
const treeAppid = (tree) => {
    const found = DFL.findInTree(tree, (node) => !!node?.app?.appid, {
        walkable: ["props", "children"],
    });
    return found?.app?.appid === undefined ? undefined : String(found.app.appid);
};
const menuAppid = (component) => ownerAppid(component) ?? treeAppid(component?.props?.children) ?? "";
/** The appid of the menu being rendered, taken from the owner of its own
 * nodes. The last opened one is a fallback for a tree that names no game. */
const liveAppid = (children, fallback) => {
    const sibling = children.find((child) => {
        const appid = ownerAppid(child);
        return appid !== undefined && appid !== fallback;
    });
    return ownerAppid(sibling) ?? treeAppid(children) ?? fallback;
};
/** Steam's context menu class. It is not exported under a usable name, so the
 * module is found by a string inside it and the class by rendering a sibling
 * that returns it. */
const libraryContextMenu = () => {
    try {
        const module = DFL.findModuleByExport((exported) => !!exported?.toString && exported.toString().includes("().LibraryContextMenu"));
        const sibling = Object.values(module ?? {}).find((value) => typeof value?.toString === "function" && value.toString().includes("navigator:"));
        if (!sibling)
            return null;
        return DFL.fakeRenderComponent(sibling)?.type ?? null;
    }
    catch (error) {
        console.error("[Shoehorn] context menu not found:", error);
        return null;
    }
};
/** Add "Install a mod" to a game's gear menu. Every step may fail into a
 * no-op; a missing item beats a broken library. Patches on Steam's prototypes
 * outlive the plugin, so all of them are handed back for `unpatch` — a
 * forgotten one answers with the unloaded plugin's state. */
const patchGameMenu = () => {
    const LibraryContextMenu = libraryContextMenu();
    if (!LibraryContextMenu)
        return { unpatch: () => undefined };
    refreshGames();
    const patches = [];
    const patchedMenus = new WeakSet();
    let lastOpened = "";
    const addItem = (children) => {
        if (!Array.isArray(children))
            return;
        dedupe(children);
        const properties = propertiesIndex(children);
        if (properties < 0)
            return;
        refreshGames();
        const appid = liveAppid(children, lastOpened);
        if (installable(appid))
            children.splice(properties, 0, item(appid));
    };
    const patchMenuClass = (prototype) => {
        if (patchedMenus.has(prototype))
            return;
        patchedMenus.add(prototype);
        patches.push(DFL.afterPatch(prototype, "render", (_args, result) => {
            addItem(result?.props?.children?.[0]);
            return result;
        }), 
        /** The children array is reused between opens, so a stale copy of our
         * item has to go even when React skips the re-render. */
        DFL.afterPatch(prototype, "shouldComponentUpdate", (args, shouldUpdate) => {
            const next = args?.[0]?.children;
            if (Array.isArray(next)) {
                dedupe(next);
                if (shouldUpdate === true)
                    addItem(next);
            }
            return shouldUpdate;
        }));
    };
    let reachedMenuClass = false;
    patches.push(DFL.afterPatch(LibraryContextMenu.prototype, "render", (_args, component) => {
        lastOpened = menuAppid(component);
        if (!reachedMenuClass) {
            reachedMenuClass = true;
            patches.push(DFL.afterPatch(component, "type", (_typeArgs, rendered) => {
                const prototype = rendered?.type?.prototype;
                if (prototype)
                    patchMenuClass(prototype);
                return rendered;
            }));
        }
        else {
            /** Later opens render a component the type patch never saw. */
            addItem(component?.props?.children);
        }
        return component;
    }));
    return {
        unpatch: () => {
            for (const patch of patches.reverse()) {
                try {
                    patch.unpatch();
                }
                catch (error) {
                    console.error("[Shoehorn] context menu unpatch failed:", error);
                }
            }
            patches.length = 0;
        },
    };
};

const INSTALLER_EXTENSIONS = ["exe", "msi", "bat", "cmd"];
/** The language the installer's dialogs were written in, worth a word only
 * when the system lacks it — then its text is mojibake. */
const detectAndWarn = async (path) => {
    const report = await detectLocale(path).catch(() => null);
    setSession("locale", report?.locale ?? undefined);
    setSession("localeMissing", report?.missing ?? undefined);
    if (report?.missing)
        note("localeMissing", { locale: report.missing });
    return report?.locale ?? undefined;
};
/** Browse for an installer. The picker's confirm button submits whatever
 * directory is open, so a folder arrives as an ordinary answer and becomes the
 * next starting point instead. */
const chooseInstaller = async () => {
    const start = session.browseFrom ?? (await home().catch(() => "/home"));
    const picked = await openFilePicker(0 /* FileSelectionType.FILE */, start, true, true, undefined, INSTALLER_EXTENSIONS);
    if (!picked?.realpath)
        return undefined;
    const info = await describePath(picked.realpath);
    if (!info.is_file) {
        setSession("browseFrom", picked.realpath);
        note(info.is_dir ? "pickedFolder" : "pickedNotFile", { name: info.name });
        return undefined;
    }
    setSession("installer", picked.realpath);
    setSession("browseFrom", info.parent);
    await detectAndWarn(picked.realpath);
    return picked.realpath;
};
const runInstaller = async (game, installer) => {
    setSession("busy", true);
    try {
        const outcome = await launchInstaller({
            game,
            installer,
            locale: session.locale ?? (session.localeMissing ? undefined : await detectAndWarn(installer)),
            previous: session.shortcut,
        });
        if ("error" in outcome)
            failed(outcome.error, { game: game.name });
        else
            setSession("shortcut", outcome.shortcut);
    }
    catch (error) {
        failedWith(error);
    }
    finally {
        setSession("busy", false);
    }
};

const optionData = (option) => {
    if (typeof option === "string")
        return option;
    if (option && typeof option === "object" && "data" in option) {
        return String(option.data);
    }
    return undefined;
};
function Panel() {
    const [games, setGames] = useSession("games");
    const [appid, setAppid] = useSession("appid");
    const [installer] = useSession("installer");
    const [shortcut] = useSession("shortcut");
    const [busy] = useSession("busy");
    const visible = useQuickAccessVisible();
    const game = games.find((candidate) => candidate.appid === appid);
    const gameOptions = SP_REACT.useMemo(() => games.map((candidate) => ({ data: candidate.appid, label: candidate.name })), [games]);
    SP_REACT.useEffect(() => {
        if (!visible)
            return;
        listGames().then(setGames).catch(failedWith);
    }, [visible]);
    const run = () => {
        if (game && installer)
            void runInstaller(game, installer);
    };
    const cleanUp = () => {
        if (shortcut === undefined)
            return;
        dropShortcut(shortcut);
        note("shortcutRemoved");
    };
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs(DFL.PanelSection, { title: t("game"), children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: t("game"), menuLabel: t("installedGames"), strDefaultLabel: t("pickGame"), rgOptions: gameOptions, selectedOption: appid, onChange: (option) => setAppid(optionData(option)) }) }), game && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: game.has_prefix ? t("prefix") : t("noPrefix"), focusable: true, children: SP_JSX.jsx("div", { style: { fontSize: "0.7em", wordBreak: "break-all" }, children: game.has_prefix ? game.prefix : t("noPrefixHint") }) }) }))] }), SP_JSX.jsxs(DFL.PanelSection, { title: t("installer"), children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: !appid || busy, onClick: () => void chooseInstaller(), children: installer?.split("/").pop() ?? t("chooseExe") }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: !game || !installer || busy, onClick: run, children: t("run") }) }), shortcut !== undefined && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", description: t("openInLibraryHint"), onClick: () => {
                                        DFL.Navigation.Navigate(`/library/app/${shortcut}`);
                                        DFL.Navigation.CloseSideMenus();
                                    }, children: t("openInLibrary") }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", description: t("removeShortcutHint"), onClick: cleanUp, children: t("removeShortcut") }) })] }))] })] }));
}

var index = definePlugin(() => {
    void dropStaleShortcuts();
    const menu = patchGameMenu();
    return {
        name: PLUGIN_NAME,
        titleView: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: PLUGIN_NAME }),
        content: SP_JSX.jsx(Panel, {}),
        icon: SP_JSX.jsx(FaShoePrints, {}),
        onDismount: () => {
            menu.unpatch();
            stopWatching();
        },
    };
});

export { index as default };
//# sourceMappingURL=index.js.map
