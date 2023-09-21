import React, { useEffect, useState } from "react";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Skeleton from "react-loading-skeleton";
import images from "../components/ImageData";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Gallery = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [search, setSearch] = useState("");
  const [Loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoaded(true);
    }, 5000);

    return () => clearTimeout(delay);
  }, []);

  const layout = images.map((image, index) => ({
    i: image.id,
    x: index % 4,
    y: Math.floor(index / 2),
    w: 1,
    h: 1,
  }));

  const skeletonLayout = layout.map((item) => ({
    ...item,
    static: true,
  }));

  const filteredImages = images.filter((image) =>
    image.tag.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid-container">
      <div className="flex justify-between items-center m-4">
        <h1 className="font-bold">IMAGE GALLERY</h1>
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tag"
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <button
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 2, sm: 2, xs: 1, xxs: 1 }}
        width={width}
      >
        {filteredImages.length === 0 && search.length > 0 ? (
          <div className="no-items-found">No items found</div>
        ) : Loaded ? (
          filteredImages.map((image) => (
            <div key={image.id} className="overflow-hidden">
              <img src={image.src} alt={`${image.id}`} id={image.id} />
            </div>
          ))
        ) : (
          skeletonLayout.map((item) => (
            <div key={item.i} className="overflow-hidden">
              <Skeleton className="skeleton-loading" width={100} height={100} />
            </div>
          ))
        )}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Gallery;
