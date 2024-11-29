import styles from "../page.module.scss";
import Link from "next/link";

export default function Signup() {
  return (
    <>
      <div className={styles.containerCenter}>
        <h1 className={styles.logo}> Email System </h1>

        <section className={styles.login}>
          <h1>Criando sua conta</h1>
          <form action="">
            <input
              type="username"
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
