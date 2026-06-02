import { hashPassword } from "../utils/crypto";

describe("crypto — pruebas unitarias (hashPassword)", () => {
  test("UT-CR01 | hashPassword retorna una cadena hex de 64 caracteres", async () => {
    const hash = await hashPassword("miContraseña123");
    expect(typeof hash).toBe("string");
    expect(hash).toHaveLength(64);
  });

  test("UT-CR02 | hashPassword retorna solo caracteres hexadecimales", async () => {
    const hash = await hashPassword("test");
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });

  test("UT-CR03 | la misma contraseña produce el mismo hash", async () => {
    const hash1 = await hashPassword("igualContraseña");
    const hash2 = await hashPassword("igualContraseña");
    expect(hash1).toBe(hash2);
  });

  test("UT-CR04 | contraseñas diferentes producen hashes diferentes", async () => {
    const hash1 = await hashPassword("contraseña1");
    const hash2 = await hashPassword("contraseña2");
    expect(hash1).not.toBe(hash2);
  });

  test("UT-CR05 | el hash no contiene la contraseña original", async () => {
    const password = "miPasswordSecreta";
    const hash = await hashPassword(password);
    expect(hash).not.toContain(password);
  });

  test("UT-CR06 | hashPassword funciona con contraseña vacía", async () => {
    const hash = await hashPassword("");
    expect(hash).toHaveLength(64);
  });

  test("UT-CR07 | hashPassword funciona con caracteres especiales", async () => {
    const hash = await hashPassword("P@$$w0rd!#%&*");
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });

  test("UT-CR08 | hashPassword funciona con contraseña larga", async () => {
    const larga = "a".repeat(1000);
    const hash = await hashPassword(larga);
    expect(hash).toHaveLength(64);
  });
});
