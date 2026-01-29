import React from "react";
import useFetch from "../hooks/useFetch/useFetch";

function PasteItem({ id, content, setSelectedPaste }) {
  const [fetchData, { loading }] = useFetch();
  const handleClick = async () => {
    try {
      const data = await fetchData({ url: `/pastes/${id}`, method: "GET" });
      const updatedData = {
        content: data.data.content,
        max_views:
          data.data.remaining_views === "infinite"
            ? ""
            : Number(data.data.remaining_views),
        ttl_seconds:
          data.data.expires_at === "never" ? "" : Number(data.data.expires_at),
        id,
      };
      setSelectedPaste(updatedData);
    } catch (error) {
      console.log("ERROR FETCHING PASTE WITH GIVEN ID", error.message);
    }
  };
  return (
    <section
      className="paste-item-container h-20 border border-gray-400"
      key={id}
    >
      <p>{content?.slice(0, 50) + " ..."}</p>
      <button
        onClick={handleClick}
        className="bg-orange-600 hover:bg-orange-800 text-white font-semibold w-25 h-8 rounded-md "
      >
        View Paste
      </button>
    </section>
  );
}

export default PasteItem;
