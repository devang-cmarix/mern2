import { useParams } from "react-router-dom";
import ProductDetail from "../components/ProductDetails";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();

  return <ProductDetail productId={id} />;
}