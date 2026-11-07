import { RouterProvider, usePath } from "@/router";
import Layout from "@/components/site/Layout";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import About from "@/pages/About";
import Credentials from "@/pages/Credentials";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/NotFound";

function Routes() {
  switch (usePath()) {
    case "/":
    case "/home":
    case "/index.html":
      return <Home />;
    case "/work":
      return <Work />;
    case "/about":
      return <About />;
    case "/credentials":
      return <Credentials />;
    case "/contact":
      return <ContactPage />;
    default:
      return <NotFound />;
  }
}

export default function App() {
  return (
    <RouterProvider>
      <Layout>
        <Routes />
      </Layout>
    </RouterProvider>
  );
}
