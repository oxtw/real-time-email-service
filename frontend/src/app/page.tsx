import styles from "./page.module.scss";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className={styles.containerCenter}>
        <h1 className={styles.logo}> Email System </h1>

        <section className={styles.login}>
          <form action="">
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
