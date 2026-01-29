import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";

function PasteForm() {
  const [pasteContent, setPasteContent] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const [formSubmit, setFormSubmit] = useState(false);

  const handleContentChange = (e) => {
    setPasteContent(e.target.value);
  };

  const handlePasteUrlChange = (e) => {
    setPasteUrl(e.target.value);
  };

  const handleReset = () => {
    setPasteContent("");
    setPasteUrl("");
    setFormSubmit("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pasteContent) return;
    setFormSubmit(true);
    console.log("Submitted");
  };

  return (
    <>
      <article className="paste-form-container">
        <form
          className="w-170 h-160 border flex flex-col justify-evenly items-center paste-form"
          onSubmit={handleSubmit}
        >
          <section className="w-full flex flex-row justify-center items-center">
            <input
              className="paste-url-container border border-gray h-10 w-130"
              id="paste-url-container"
              name="paste-url-container"
              placeholder="Paste URL"
              value={pasteUrl}
              onChange={handlePasteUrlChange}
            />
            <button
              type="button"
              className={`${formSubmit ? "bg-sky-700 hover:bg-sky-900" : "bg-gray-400"} h-10 w-20 font-semibold text-white flex flex-row justify-evenly items-center`}
              disabled={!formSubmit}
            >
              <FiCopy />
              Copy
            </button>
          </section>
          <section className="w-full flex flex-row justify-center items-center">
            <textarea
              className="paste-content-container w-150 h-100 border"
              id="paste-content-container"
              name="paste-content-container"
              value={pasteContent}
              onChange={handleContentChange}
              autoFocus
            ></textarea>
          </section>
          <button
            type="button"
            onClick={handleReset}
            className="bg-red-700 hover:bg-red-900 w-150 h-10 font-semibold text-white rounded-md"
          >
            Clear Paste
          </button>
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-900 w-150 h-10 font-semibold text-white rounded-md"
          >
            Create Paste
          </button>
        </form>
      </article>
    </>
  );
}

export default PasteForm;
