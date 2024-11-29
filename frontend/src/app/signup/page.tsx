import styles from "../page.module.scss";
import Link from "next/link";
import { api } from "@/services/api";
import { redirect } from "next/navigation";

export default function Signup() {
  async function handleRegister(formData: FormData) {
    "use server";

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    if (username === "" || email === "" || password === "") {
      console.log("PREENCHA TODOS OS CAMPOS");
      return;
    }

    try {
      await api.post("/users",{
        username,
        email,
        password,
      });        
    } catch (err) {
      console.log("error");
      console.log(err);
    }

    redirect("/")
  }

  return (
    <>
      <div className={styles.containerCenter}>
        <h1 className={styles.logo}> Email System </h1>

        <section className={styles.login}>
          <h1>Criando sua conta</h1>
          <form action={handleRegister}>
            <input
              type="text"
              required
              name="username"
              placeholder="Digite seu nome de usuario..."
              className={styles.input}
            />

            <input
              type="email"
              required
              name="email"
              placeholder="Digite seu email..."
              className={styles.input}
            />

            <input
              type="password"
              required
              name="password"
              placeholder="************"
              className={styles.input}
            />

            <button className={styles.button} type="submit">
              Cadastrar
            </button>
          </form>

          <Link href="/" className={styles.text}>
            Já Possui uma conta? Faça Login
          </Link>
        </section>
      </div>
    </>
  );
}
