{
  lib,
  stdenvNoCC,
}:

stdenvNoCC.mkDerivation {
  pname = "shoehorn";
  version = "0.1.1";

  src = ./.;

  dontConfigure = true;
  dontBuild = true;

  installPhase = ''
    runHook preInstall
    mkdir -p $out
    cp -r dist package.json plugin.json $out/
    cp backend/main.py $out/main.py
    mkdir -p $out/py_modules
    cp -r backend/shoehorn $out/py_modules/shoehorn
    runHook postInstall
  '';

  meta = {
    description = "Decky plugin that runs Windows installers in a Steam game's Proton prefix";
    homepage = "https://github.com/catvitalio/shoehorn";
    license = lib.licenses.mit;
    platforms = lib.platforms.all;
  };
}
