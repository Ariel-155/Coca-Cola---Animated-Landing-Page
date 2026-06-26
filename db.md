# 🗄️ Base de Datos — Guía de Administración

Este proyecto usa **SQLite** como base de datos local gestionada por **Prisma ORM**.  
El archivo de la base de datos se encuentra en `backend/prisma/dev.db`.

---

## 📋 Requisitos Previos

- Node.js instalado
- Dependencias del proyecto instaladas (`npm install` en la raíz)
- Archivo `.env` configurado en `backend/` con `DATABASE_URL="file:./dev.db"`

---

## 🔧 Scripts Útiles

Todos los comandos se ejecutan desde la carpeta `backend/`:

```bash
cd backend
```

### 🔄 Reiniciar la base de datos (borrar todo y crear desde cero)

```bash
# 1. Eliminar el archivo de la DB
# Windows (PowerShell):
Remove-Item -Force prisma/dev.db -ErrorAction SilentlyContinue
Remove-Item -Force prisma/dev.db-journal -ErrorAction SilentlyContinue

# macOS / Linux:
rm -f prisma/dev.db prisma/dev.db-journal

# 2. Recrear la DB vacía desde el schema
npx prisma db push
```

> ⚠️ **Esto borra TODOS los usuarios y datos.** Usar solo en desarrollo.

### 📐 Sincronizar schema con la DB (sin borrar datos)

Cuando modificas `prisma/schema.prisma` y quieres aplicar los cambios:

```bash
npx prisma db push
```

Si los cambios son incompatibles con datos existentes, Prisma te avisará.

### 🔍 Abrir Prisma Studio (interfaz visual para ver/editar datos)

```bash
npx prisma studio
```

Se abre en `http://localhost:5555` con una UI para explorar tablas y registros.

### 🧹 Resetear con migraciones (alternativa formal)

```bash
npx prisma migrate reset
```

Esto elimina la DB, vuelve a ejecutar todas las migraciones y los seeds (si existen).

### 📊 Generar el cliente Prisma (tras cambios en el schema)

```bash
npx prisma generate
```

---

## 🏗️ Esquema Actual

```prisma
model User {
  id           String   @id @default(cuid())
  username     String
  email        String   @unique
  password     String?           // null para usuarios OAuth
  provider     String   @default("local") // "local" | "google"
  googleId     String?  @unique
  avatarUrl    String?
  location     String?
  storeName    String?
  phone        String?
  deliveryDay  String?           // "Lunes", "Martes", etc.
  deliveryTime String?           // "09:00 - 12:00"
  totalOrders  Int      @default(0)
  totalSpent   Float    @default(0.0)
  isVerified   Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Campos clave:
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `cuid()` | Identificador único (nunca se repite) |
| `username` | `String` | Nombre visible (puede repetirse) |
| `email` | `String @unique` | Email único por cuenta |
| `storeName` | `String?` | Nombre de la tienda/bodega |
| `phone` | `String?` | Teléfono de contacto |
| `provider` | `"local" \| "google"` | Método de registro |

---

## 🚨 Notas Importantes

1. **La DB no se sube al repositorio.** El archivo `dev.db` está en `.gitignore`.
2. **Redis** se usa para datos temporales (OTPs, registros pendientes), no para datos persistentes.
3. **En producción** se recomienda migrar a PostgreSQL o MySQL cambiando el `provider` en `schema.prisma`.
