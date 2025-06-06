import { useLocation } from "react-router-dom";

export default function ProductDetails() {
  const location = useLocation();
  const { image, name, desc } = location.state || {};

  return (
    <div className="my-16">
      <div className="flex justify-center">
        <img className="w-64" src={image} alt={name} />
      </div>
      <h1 className="mt-5 font-medium text-2xl text-pink-600 text-center">{name}</h1>
      <p className="mt-2 text-justify mx-10 md:mx-96">{desc}</p>
    </div>
  );
}
