import { useNavigate } from "react-router-dom";

export default function ItemCard({ image, head, desc, star_count, review_count, price }) {
    // Generate stars dynamically
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fa-${i <= star_count ? 'solid' : 'regular'} fa-star text-yellow-400`}
                ></i>
            );
        }
        return stars;
    };
    const navigate = useNavigate();
    return (
        <div className="bg-pink-100 w-fit px-3 py-2 rounded-md shadow-lg">
            <img className="w-40" src={image} alt={head} />
            <h1 className="text-pink-600 w-40 text-sm md:text-lg font-bold">{head}</h1>
            <p className="w-40 text-xs md:text-sm text-gray-700 mt-1">{desc}</p>
            <p className="text-sm mt-1">
                <span>{renderStars()}</span>
                <span className="text-gray-600 text-xs md:text-sm ml-1">({review_count})</span>
            </p>
            <p className="text-sm md:text-lg font-medium mt-1">&#8377;{price}/-</p>
            <div className="flex justify-between mt-2">
                <p className="flex px-[3px] py-[1px] justify-center bg-black rounded font-medium text-white"><button onClick={()=>navigate("/checkout")}  className="text-xs md:text-sm" >Order Now</button></p>
                <p className="flex px-[3px] py-[1px] justify-center bg-pink-500 rounded font-medium text-white"><button onClick={()=>navigate("/view-card")} className="text-xs md:text-sm">Add to card</button></p>
            </div>
        </div>
    );
}
