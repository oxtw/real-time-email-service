-- CreateTable
CREATE TABLE "mensagens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idRemetente" TEXT NOT NULL,
    "idDestinatario" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "corpo" TEXT NOT NULL,
    "dataEnvio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estaLida" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mensagens_idRemetente_fkey" FOREIGN KEY ("idRemetente") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "mensagens_idDestinatario_fkey" FOREIGN KEY ("idDestinatario") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
