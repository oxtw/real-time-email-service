import styles from "./page.module.scss";
import Link from "next/link";
import { api } from "@/services/api";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function Home() {
  async function handleLogin(formData: FormData) {
    "use server";

    const username = formData.get("username");
    const password = formData.get("password");

    if (username === "" || password === "") {
      return;
    }

    try {
      const response = await api.post("/session", {
        username,
        password,
      });

      if (!response.data.token) {
        return;
      }

      console.log(response.data);

      const expresstime = 60 * 60 * 24 * 30 * 1000;
      const cookieStore = await cookies();

      //salvando token do usuario
      cookieStore.set('session', response.data.token,{
        maxAge: expresstime,
        path: '/',
        httpOnly: false,

        //quando secure estiver true só sera possivel acessar via https
        // secure: process.env.NODE_ENV ==='production'
        secure: false,
      })

    } catch (err) {
      console.log(err);
      return;
    }

    redirect("/dashboard");
  }

  return (
    <>
      <div className={styles.containerCenter}>
        <h1 className={styles.logo}> Email System </h1>

        <section className={styles.login}>
          <form action={handleLogin}>
            <input
              type="username"
              required
              name="username"
              placeholder="Digite seu nome de usuario..."
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
              Acessar
            </button>
          </form>

          <Link href="/signup" className={styles.text}>
            Não Possui uma conta? Cadastre-se
          </Link>
        </section>
      </div>
    </>
  );
}
