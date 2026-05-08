import BestMonth from "../components/BestMonth";
import Categories from "../components/Categories";
import FlashSales from "../components/FlashSales";
import Hero from "../components/Hero";
import MusicBanner from "../components/MusicBanner";
import NewArrivals from "../components/NewArrivals";
import Services from "../components/Services";

const Home = () => {
  return (
  <>
      <Hero />
      <FlashSales />
      <Categories />
      <BestMonth />
      <MusicBanner/>
      <NewArrivals/>
      <Services/>  
  </>
  )
};

export default Home;