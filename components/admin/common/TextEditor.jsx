import React, { useEffect, useState } from "react";
import JoditEditor from "jodit-react";

const TextEditor = ({ editorRef, value, page }) => {
  const [content, setContent] = useState("");
  const confiq = {
    buttons: [
      "bold",
      "Italic",
      "underline",
      "link",
      "unlink",
      "source",
      "ul",
      "ol",
      "fontsize",
      "hr",
      `${page && page === "blog" ? "image" : ""}`,
    ],
  };

  useEffect(() => {
    if (value) setContent(value);
    return;
  }, [value]);

  return (
    <div>
      <JoditEditor
        ref={editorRef}
        value={content}
        config={confiq}
        tabIndex={1}
        onBlur={(newContent) => setContent(newContent)}
      />
    </div>
  );
};

export default TextEditor;
