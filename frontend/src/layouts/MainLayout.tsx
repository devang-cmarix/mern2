import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main style={{ padding: "20px" }}>{children}</main>
      <Footer/>
    </>
  );
};

export default MainLayout;