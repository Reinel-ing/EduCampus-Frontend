/**
 * Encripta una contraseña usando SHA-256 (Web Crypto API nativa del navegador).
 * Así la contraseña NUNCA viaja en texto plano por la red.
 *
 * En DevTools → Network el cuerpo del request mostrará el hash hex,
 * no la contraseña original.
 */
export const hashPassword = async (plainText) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
