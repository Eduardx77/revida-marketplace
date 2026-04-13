# ReVida - Marketplace Ecológico

Un marketplace para productos reutilizados y donaciones, construido con Next.js, TypeScript y Supabase.

## 🚀 Deployment

### Opción 1: Vercel (Recomendado)

1. **Crear cuenta en Vercel:**
   - Ve a [vercel.com](https://vercel.com) y regístrate
   - Conecta tu cuenta de GitHub

2. **Importar proyecto:**
   - Haz click en "Import Project"
   - Selecciona tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configurar variables de entorno:**
   - Ve a Settings > Environment Variables
   - Agrega estas variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
     NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
     ```

4. **Deploy:**
   - Haz click en "Deploy"
   - ¡Listo! Tu sitio estará disponible en una URL como `https://tu-proyecto.vercel.app`

### Opción 2: Netlify

1. **Crear cuenta en Netlify:**
   - Ve a [netlify.com](https://netlify.com) y regístrate

2. **Conectar repositorio:**
   - Haz click en "Add new site" > "Import an existing project"
   - Conecta tu repositorio de GitHub

3. **Configurar build:**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Variables de entorno:**
   - Ve a Site settings > Environment variables
   - Agrega las mismas variables que en Vercel

5. **Deploy:**
   - Netlify hará el deployment automáticamente

### Opción 3: Railway

1. **Crear cuenta en Railway:**
   - Ve a [railway.app](https://railway.app) y regístrate

2. **Crear nuevo proyecto:**
   - Haz click en "New Project" > "Deploy from GitHub repo"
   - Selecciona tu repositorio

3. **Configurar variables:**
   - Ve a Variables en el dashboard del proyecto
   - Agrega las variables de entorno

4. **Deploy automático:**
   - Railway detectará que es Next.js y hará el deployment

## 📋 Requisitos previos

- Node.js 18+
- Cuenta de Supabase
- Base de datos PostgreSQL configurada

## 🛠️ Configuración local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/re-vida-marketplace.git
   cd re-vida-marketplace
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Configura variables de entorno:**
   ```bash
   cp .env.example .env.local
   # Edita .env.local con tus valores reales
   ```

4. **Ejecuta la aplicación:**
   ```bash
   npm run dev
   ```

## 📁 Estructura del proyecto

```
├── app/                 # Páginas Next.js (App Router)
├── components/          # Componentes reutilizables
├── lib/                 # Utilidades y configuración
│   └── supabase/        # Cliente y queries de Supabase
├── public/              # Archivos estáticos
└── scripts/             # Scripts de base de datos
```

## 🔧 Tecnologías utilizadas

- **Frontend:** Next.js 16, React 19, TypeScript
- **UI:** Tailwind CSS, Radix UI
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Deployment:** Vercel/Netlify/Railway

## 📞 Soporte

Si tienes problemas con el deployment, revisa:
1. Que todas las variables de entorno estén configuradas
2. Que tu base de datos de Supabase esté accesible
3. Los logs de deployment para errores específicos