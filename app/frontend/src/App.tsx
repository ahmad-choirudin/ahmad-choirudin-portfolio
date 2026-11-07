import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouterProvider } from "@/router";
import Layout from "@/components/site/Layout";
import Home from "@/pages/Home";

// Halaman selain Home dimuat saat dibutuhkan (code-splitting) supaya bundle awal kecil.
// Credentials sengaja lazy karena berisi banyak gambar sertifikat.
const Work = lazy(() => import("@/pages/Work"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const About = lazy(() => import("@/pages/About"));
const Credentials = lazy(() => import("@/pages/Credentials"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <RouterProvider>
      <Layout>
        <Suspense fallback={<div className="min-h-[70svh]" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/credentials" element={<Credentials />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </RouterProvider>
  );
}
