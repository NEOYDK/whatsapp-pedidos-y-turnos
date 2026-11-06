# Pedidos y turnos por WhatsApp

Demo de un negocio atendiendo dentro de WhatsApp: toma pedidos y turnos completos en la charla, calcula el total y manda el link para pagar. Para rotiserías, barberías, consultorios e inmobiliarias.

**Probala en vivo:** https://whatsapp-demo-ydk.pages.dev

## Qué tiene

- Pedidos y turnos
- Link de pago
- Las 24 horas

## Tecnologías

- HTML, CSS y JavaScript propios, sin plantillas ni frameworks
- Cloudflare Pages (servida desde la red de Cloudflare, con HTTPS)
- Cloudflare Workers y base de datos D1 (SQLite) para la parte del servidor
- Pensada primero para el celular y probada con pruebas automáticas (Playwright)

## Qué hay en este repositorio

La parte que ve el cliente, en `public/`. La lógica del servidor queda en un repositorio privado.

---

Hecho por Julian, de **Yardak**: webs, tiendas, apps y sistemas para negocios de Paraná, Entre Ríos.
https://yardak.pages.dev
