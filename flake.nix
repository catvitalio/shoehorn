{
  description = "Decky plugin that runs mod installers inside a Steam game's Proton prefix";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
    in
    {
      packages = nixpkgs.lib.genAttrs systems (system: {
        default = nixpkgs.legacyPackages.${system}.callPackage ./package.nix { };
        shoehorn = self.packages.${system}.default;
      });

      devShells = nixpkgs.lib.genAttrs systems (system: {
        default = nixpkgs.legacyPackages.${system}.mkShellNoCC {
          packages = with nixpkgs.legacyPackages.${system}; [
            just
            nodejs
            pnpm
            rsync
            ty
            zip
          ];
        };
      });
    };
}
