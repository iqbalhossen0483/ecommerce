import "../styles/globals.css";
import "../styles/dashboard.css";
import Alert from "../components/global/Alert";
import StoreProvider from "../components/context/StoreProvider";
import { useRouter } from "next/router";
import AdminRoute from "../components/admin/AdminRoute";
import ProtectLoginPage from "../components/admin/ProtectLoginPage";

function LayOut({ Component, pageProps }) {
  const router = useRouter();
  return (
    <div>
      {router.pathname.startsWith("/admin") ? (
        <AdminRoute>
          <Component {...pageProps} />
        </AdminRoute>
      ) : router.pathname === "/login" ? (
        <ProtectLoginPage>
          <Component {...pageProps} />
        </ProtectLoginPage>
      ) : (
        <Component {...pageProps} />
      )}
      <Alert />
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <LayOut Component={Component} pageProps={pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
