import React, { useEffect, useState, useCallback } from "react";
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
  const [loaded, setLoaded] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  const handleResize = useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    setLoaded(true);
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
    image.tag.some((tag) =>
      tag.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
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
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-center m-4">
        <div className="flex justify-between items-center w-full mb-2 lg:mb-0">
          <h1 className="font-bold text-center lg:text-left">IMAGE GALLERY</h1>
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        <div className="w-full lg:w-auto ml-2 flex justify-center  lg:justify-start">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tag"
            className="border border-gray-300 rounded px-2 py-1 w-full max-w-md lg:max-w-full"
          />
        </div>
      </div>

      <div className="mx-5 p-4">
        <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-center">
          This app provides a user-friendly interface for dragging and
          re-arranging images, explore a gallery of images, and even search by
          tags. Enjoy a smooth experience.
        </h1>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 2, sm: 2, xs: 1, xxs: 1 }}
        width={width}
      >
        {filteredImages.length === 0 && debouncedSearch.length > 0 ? (
          <div className="text-black font-bold">No items found</div>
        ) : loaded ? (
          filteredImages.map((image) => (
            <div key={image.id} className="overflow-hidden relative">
              <img
                src={image.src}
                alt={`${image.id}`}
                id={image.id}
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-800 bg-opacity-75">
                {image.tag.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white text-gray-800 mr-2 mb-2 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          skeletonLayout.map((item) => (
            <div
              key={item.i}
              className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-cover bg-no-repeat h-4 w-32 rounded"
            >
              <Skeleton width={100} height={100} />
            </div>
          ))
        )}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Gallery;
