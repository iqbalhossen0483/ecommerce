import useStore from "../components/context/useStore";

export default function Home() {
  const store = useStore();

  function singOut() {
    store.setUser(null);
    localStorage.removeItem("token");
  }
  return (
    <div>
      <p>Home</p>
      {store.user ? (
        <button className="btn" onClick={singOut}>
          logout
        </button>
      ) : null}
    </div>
  );
}
