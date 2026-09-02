#!/usr/bin/env bash
# scripts/setup-env.sh — Setup portable Supabase+Vercel env (dual URL)
# Uso: ./scripts/setup-env.sh [--check] [--yes]
# Clonable: copiar tal cual a futuros proyectos. No expone secrets en logs.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXAMPLE="$ROOT/.env.example"
LOCAL="$ROOT/.env.local"
ENVFILE="$ROOT/.env"
CHECK_ONLY=false
AUTO_YES=false

for arg in "$@"; do
  case "$arg" in
    --check) CHECK_ONLY=true ;;
    --yes|-y) AUTO_YES=true ;;
    --help|-h)
      echo "Uso: $0 [--check] [--yes]"
      echo "  --check  solo valida sin escribir"
      echo "  --yes    no pide confirmación"
      exit 0
      ;;
  esac
done

info()  { printf "\033[36m[setup-env]\033[0m %s\n" "$*"; }
warn()  { printf "\033[33m[setup-env WARN]\033[0m %s\n" "$*"; }
ok()    { printf "\033[32m[setup-env OK]\033[0m %s\n" "$*"; }
fail()  { printf "\033[31m[setup-env FAIL]\033[0m %s\n" "$*"; }

# 1) Crear .env.local desde .env.example si no existe
if [[ ! -f "$LOCAL" ]]; then
  if [[ "$CHECK_ONLY" == true ]]; then
    fail ".env.local no existe (y --check activo, no se crea)"
  else
    if [[ -f "$EXAMPLE" ]]; then
      cp "$EXAMPLE" "$LOCAL"
      info "Creado $LOCAL desde .env.example — EDITAR con credenciales Supabase antes de continuar"
    else
      fail ".env.example no encontrado"
      exit 1
    fi
  fi
else
  ok ".env.local existe"
fi

# 2) Detectar NEXTAUTH_SECRET débil y rotar (si no es --check)
is_weak_secret() {
  local v="$1"
  if [[ ${#v} -lt 32 ]]; then return 0; fi
  if [[ "$v" == *"cambiar-en-prod"* ]]; then return 0; fi
  if [[ "$v" == "tu-secret-aqui"* ]]; then return 0; fi
  if [[ "$v" == "dev-secret"* ]]; then return 0; fi
  return 1
}

if [[ -f "$LOCAL" ]]; then
  SECRET_LINE=$(grep -E "^NEXTAUTH_SECRET=" "$LOCAL" || true)
  SECRET_VAL=$(echo "$SECRET_LINE" | cut -d= -f2- | tr -d '"' | tr -d "'" || true)
  if [[ -z "$SECRET_VAL" ]] || is_weak_secret "$SECRET_VAL"; then
    if [[ "$CHECK_ONLY" == true ]]; then
      warn "NEXTAUTH_SECRET débil o vacío (len=${#SECRET_VAL}) — requiere rotación: openssl rand -base64 32"
    else
      NEW_SECRET=$(openssl rand -base64 32 2>/dev/null || python3 -c "import secrets,base64; print(base64.b64encode(secrets.token_bytes(32)).decode())")
      # sed portable (macOS vs linux)
      if sed --version >/dev/null 2>&1; then
        sed -i "s/^NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=$NEW_SECRET/" "$LOCAL"
      else
        sed -i '' "s/^NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=$NEW_SECRET/" "$LOCAL"
      fi
      ok "NEXTAUTH_SECRET rotado (len=${#NEW_SECRET}) en .env.local"
      # sincronizar .env si existe
      if [[ -f "$ENVFILE" ]]; then
        if sed --version >/dev/null 2>&1; then sed -i "s/^NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=$NEW_SECRET/" "$ENVFILE" 2>/dev/null || true
        else sed -i '' "s/^NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=$NEW_SECRET/" "$ENVFILE" 2>/dev/null || true; fi
      fi
    fi
  else
    ok "NEXTAUTH_SECRET OK (len=${#SECRET_VAL})"
  fi
fi

# 3) Validar puertos dual URL (sin logear valores completos)
validate_url() {
  local name="$1" file="$2" expect_port="$3" expect_pgbouncer="$4"
  local line
  line=$(grep -E "^${name}=" "$file" 2>/dev/null | head -1 || true)
  if [[ -z "$line" ]]; then warn "$name no encontrado en $file"; return 1; fi
  local val=$(echo "$line" | cut -d= -f2- | tr -d '"' | tr -d "'")
  if [[ -z "$val" || "$val" == *"user:password"* || "$val" == *"postgres.\[ref\]"* ]]; then
    warn "$name es placeholder en $file — completar con string real de Supabase"
    return 1
  fi
  local port
  port=$(echo "$val" | grep -o ":[0-9]\+/" | tr -d ':/' || true)
  if [[ "$port" != "$expect_port" ]]; then
    warn "$name puerto esperado $expect_port pero es ${port:-?} en $file"
    return 1
  fi
  if [[ "$expect_pgbouncer" == "true" && "$val" != *"pgbouncer=true"* ]]; then
    warn "$name debería contener ?pgbouncer=true (pooler)"
    return 1
  fi
  if [[ "$expect_pgbouncer" == "false" && "$val" == *"pgbouncer=true"* ]]; then
    warn "$name NO debería contener pgbouncer=true (direct)"
    return 1
  fi
  ok "$name OK (port $port, pgbouncer=$expect_pgbouncer)"
  return 0
}

FAIL=0
if [[ -f "$LOCAL" ]]; then
  validate_url "DATABASE_URL" "$LOCAL" "6543" "true"  || FAIL=1
  validate_url "DIRECT_URL"   "$LOCAL" "5432" "false" || FAIL=1
fi
if [[ ! -f "$LOCAL" ]]; then FAIL=1; fi

# 4) Sincronizar .env para Prisma (Prisma lee .env, no .env.local)
if [[ "$CHECK_ONLY" == false ]]; then
  if [[ -f "$LOCAL" ]]; then
    cp "$LOCAL" "$ENVFILE"
    ok "Sincronizado $ENVFILE desde .env.local (para prisma validate/generate)"
  fi
fi

# 5) Validar prisma schema
if command -v npx >/dev/null 2>&1; then
  if npx prisma validate >/dev/null 2>&1; then ok "prisma validate OK"
  else
    warn "prisma validate FAIL — verificar DATABASE_URL/DIRECT_URL en .env/.env.local"
    npx prisma validate 2>&1 | tail -n 20 || true
    FAIL=1
  fi
else
  warn "npx no encontrado, skip prisma validate"
fi

# 6) Resumen Vercel (si CLI disponible)
if command -v vercel >/dev/null 2>&1; then
  info "Vercel envs (resumen sin valores):"
  vercel env ls 2>&1 | sed 's/=.*/=***/' | tail -n 20 || true
  COUNT=$(vercel env ls 2>&1 | grep -c "Encrypted\|Sensitive" || true)
  if [[ "$COUNT" -ge 8 ]]; then ok "Vercel envs: $COUNT vars (esperado 8 = 4 prod + 4 preview)"
  else warn "Vercel envs: $COUNT vars (esperado 8) — verificar con 'vercel env ls'"
  fi
fi

echo ""
if [[ $FAIL -ne 0 ]]; then
  fail "setup-env completado con advertencias — revisar arriba"
  exit 0
else
  ok "setup-env OK — listo para 'npx prisma db push && npm run build'"
fi
