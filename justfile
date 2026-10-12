host := env_var_or_default("SHOEHORN_HOST", "")
plugins := env_var_or_default("SHOEHORN_PLUGINS", "homebrew/plugins")
owner := env_var_or_default("SHOEHORN_OWNER", "")

default: build

build:
    pnpm build

deploy: build
    #!/usr/bin/env bash
    set -euo pipefail
    [ -n "{{ host }}" ] || { echo "set SHOEHORN_HOST=user@host" >&2; exit 1; }
    target="{{ plugins }}/Shoehorn"
    ssh "{{ host }}" "mkdir -p '$target'"
    rsync -a --delete --exclude '*.map' dist plugin.json package.json "{{ host }}:$target/"
    rsync -a backend/main.py "{{ host }}:$target/main.py"
    rsync -a --delete --exclude '__pycache__' backend/shoehorn "{{ host }}:$target/py_modules/"
    [ -z "{{ owner }}" ] || ssh "{{ host }}" "chown -R '{{ owner }}' '$target'"
    echo "deployed to {{ host }}:$target — decky reloads on main.py and dist/index.js"

bundle: build
    #!/usr/bin/env bash
    set -euo pipefail
    rm -rf .bundle Shoehorn.zip
    mkdir -p .bundle/Shoehorn/py_modules
    cp -r dist plugin.json package.json .bundle/Shoehorn/
    rm -f .bundle/Shoehorn/dist/*.map
    cp backend/main.py .bundle/Shoehorn/main.py
    rsync -a --exclude '__pycache__' backend/shoehorn .bundle/Shoehorn/py_modules/
    cd .bundle && zip -qr ../Shoehorn.zip Shoehorn
    echo "Shoehorn.zip — install it from Decky's developer settings"

logs:
    ssh {{ host }} 'journalctl -u decky-loader -o cat -f'

fmt:
    pnpm run format

check:
    pnpm run format:check
    ty check backend
