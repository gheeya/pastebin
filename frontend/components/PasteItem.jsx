import React from "react";

function PasteItem({ id, content }) {
  return (
    <section
      className="flex flex-row justify-evenly items-center h-20 border border-gray-400"
      key={id}
    >
      <p>{content?.slice(0, 50) + " ..."}</p>
      <button className="bg-orange-600 hover:bg-orange-800 text-white font-semibold w-25 h-8 rounded-md ">
        View Paste
      </button>
    </section>
  );
}

export default PasteItem;
