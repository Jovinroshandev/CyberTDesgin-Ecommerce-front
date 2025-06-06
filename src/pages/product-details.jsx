import { useLocation } from "react-router-dom";

export default function ProductDetails() {
  const location = useLocation();
  const { image, name, desc } = location.state || {};

  return (
    <div>
      <img src={image} alt={name} />
      <h1>{name}</h1>
      <p>{desc}</p>
    </div>
  );
}
