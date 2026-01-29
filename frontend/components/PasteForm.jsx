import React, { useState, useEffect } from "react";
import { FiCopy } from "react-icons/fi";
import useFetch from "../hooks/useFetch/useFetch";
import PasteItem from "./PasteItem";

function PasteForm() {
  const [pasteUrl, setPasteUrl] = useState("");
  const [formSubmit, setFormSubmit] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fetchData, { loading }] = useFetch();
  const [allPastes, setAllPastes] = useState([]);
  const [selectedPaste, setSelectedPaste] = useState({
    max_views: "",
    ttl_seconds: "",
    content: "",
    id: "",
  });
  const [formContent, setFormContent] = useState({
    max_views: "",
    ttl_seconds: "",
    content: "",
  });

  useEffect(() => {
    const config = { url: "/pastes", method: "GET" };
    fetchData(config).then((data) => {
      setAllPastes(data.data.pastes);
    });
  }, [fetchData, pasteUrl]);

  useEffect(() => {
    if (!selectedPaste?.content) return;
    setFormContent({ ...formContent, ...selectedPaste });
    setPasteUrl(`/api/pastes/${selectedPaste.id}`);
  }, [selectedPaste]);

  const handleContentChange = (e) => {
    setFormContent({ ...formContent, [e.target.name]: e.target.value });
  };

  const handlePasteUrlChange = (e) => {
    setPasteUrl(e.target.value);
  };

  const handleReset = () => {
    setFormContent({ max_views: "", ttl_seconds: "", content: "" });
    setPasteUrl("");
    setFormSubmit("");
    setCopied(false);
  };

  const copyTxt = async () => {
    await navigator.clipboard.writeText(pasteUrl);
    setCopied(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formContent.content) return;
    setFormSubmit(true);
    const updatedFormData = {
      content: formContent.content,
      ttl_seconds: formContent.ttl_seconds
        ? Number(formContent.ttl_seconds)
        : null,
      max_views: formContent.max_views ? Number(formContent.max_views) : null,
    };
    const config = {
      url: "/pastes",
      method: "POST",
      data: updatedFormData,
    };
    fetchData(config)
      .then((data) => {
        setPasteUrl(data.data.url);
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  };

  return (
    <>
      <article className="paste-form-container flex flex-row justify-center items-center">
        <form
          className="w-170 h-160 flex flex-col justify-evenly items-center paste-form"
          onSubmit={handleSubmit}
        >
          <h2 className="text-lg font-semibold">Create A Paste</h2>
          <section className="w-full flex flex-row justify-center items-center">
            <input
              className="paste-url-container border border-gray-400 h-10 w-125"
              id="paste-url-container"
              name="paste-url-container"
              placeholder="Paste URL"
              value={pasteUrl}
              onChange={handlePasteUrlChange}
            />
            <button
              type="button"
              className={`${formSubmit ? "bg-sky-700 hover:bg-sky-900" : "bg-gray-400"} h-10 w-25 font-semibold text-white flex flex-row justify-evenly items-center`}
              disabled={!formSubmit}
              onClick={copyTxt}
            >
              <FiCopy />
              {!copied ? "Copy" : "Copied!!!"}
            </button>
          </section>
          <section className="w-150 flex flex-col justify-evenly items-start">
            <label htmlFor="max_views">
              Max Views(Don't enter anything for infinite)
            </label>
            <input
              type="number"
              min={0}
              className="border border-gray-400 h-10 w-80"
              placeholder="Enter Views: Eg. 1,2..."
              value={formContent.max_views}
              onChange={handleContentChange}
              name="max_views"
            />
            <label htmlFor="ttl_seconds">
              Expiry Time(In Seconds: Don't enter anything for indefinite)
            </label>
            <input
              type="number"
              min={0}
              className="border border-gray-400 h-10 w-80"
              placeholder="Enter Seconds: Eg. 5 minutes:300 seconds"
              value={formContent.ttl_seconds}
              onChange={handleContentChange}
              name="ttl_seconds"
            />
          </section>
          <section className="w-full flex flex-row justify-center items-center">
            <textarea
              className="paste-content-container w-150 h-80 border border-gray-400"
              id="paste-content-container"
              name="content"
              value={formContent.content}
              onChange={handleContentChange}
              required
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
      <article className="paste-container flex flex-row justify-center items-center">
        <article className="paste w-170 h-160 flex flex-col justify-start items-center">
          <h2 className="text-lg font-semibold">Recent Pastes</h2>
          <article className="h-130 w-150 border border-gray-400 rcnt-paste-container">
            {loading ? (
              <h2 className="text-center font-semibold text-red-600">
                Loading ...
              </h2>
            ) : (
              allPastes?.map((p) => {
                return (
                  <PasteItem
                    key={p._id}
                    id={p._id}
                    content={p.content}
                    createdAt={p.createdAt}
                    setSelectedPaste={setSelectedPaste}
                  />
                );
              })
            )}
          </article>
        </article>
      </article>
    </>
  );
}

export default PasteForm;
